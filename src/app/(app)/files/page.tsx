'use client';

import React, { useState, useRef, useEffect } from 'react';
import { LEETCODE_TOPICS } from '@/lib/constants';
import Image from 'next/image';

interface Attachment {
  publicId: string;
  url: string;
  originalName: string;
  resourceType: string;
  format?: string;
  size?: number;
  topics?: string[];
  createdAt: string | Date;
}

export default function GlobalFilesPage() {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [topicSearch, setTopicSearch] = useState('');
  const [filterTopic, setFilterTopic] = useState<string>('All');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const res = await fetch('/api/files');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch files');
      setAttachments(data.uploads || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAttachments = attachments.filter(att => 
    filterTopic === 'All' ? true : att.topics?.includes(filterTopic)
  );

  const formatBytes = (bytes?: number) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleUpload = async (file: File, topics: string[] = []) => {
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }
    
    setPendingFile(null);
    setIsUploading(true);
    setError('');
    setUploadProgress(10);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onprogress = (e) => {
        if (e.lengthComputable) {
          const percentLoaded = Math.round((e.loaded / e.total) * 50);
          setUploadProgress(percentLoaded);
        }
      };

      reader.onloadend = async () => {
        const base64data = reader.result;
        const isPdf = file.type === 'application/pdf';
        const resourceType = isPdf ? 'raw' : 'auto';

        setUploadProgress(60);

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            file: base64data, 
            resourceType,
            originalName: file.name,
            topics
          })
        });
        
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error || 'Cloudinary upload failed');

        setUploadProgress(100);
        await fetchFiles(); // Refresh list from server
      };
    } catch (err: any) {
      setError(err.message || 'File upload failed');
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPendingFile(file);
      setSelectedTopics([]);
      setTopicSearch('');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && (file.type.startsWith('image/') || file.type === 'application/pdf')) {
      setPendingFile(file);
      setSelectedTopics([]);
      setTopicSearch('');
    } else if (file) {
      setError('Only images and PDFs are supported');
    }
  };

  const handleDelete = async (publicId: string) => {
    if (!confirm('Are you sure you want to permanently delete this file?')) return;
    
    setError('');
    try {
      const delRes = await fetch(`/api/upload?public_id=${publicId}`, { method: 'DELETE' });
      if (!delRes.ok) {
        const delData = await delRes.json();
        throw new Error(delData.error || 'Failed to delete file');
      }

      setAttachments(attachments.filter(a => a.publicId !== publicId));
    } catch (err: any) {
      setError(err.message || 'Deletion failed');
    }
  };

  return (
    <div className="flex flex-col h-full bg-background min-h-screen text-foreground pt-12 md:pt-0">
      <div className="max-w-[1280px] mx-auto w-full px-4 md:px-8 py-8 flex-1 flex flex-col">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="font-heading text-4xl font-bold tracking-tight mb-2">Your Files</h1>
            <p className="text-muted-foreground text-sm max-w-2xl">
              A centralized repository for all your uploaded diagrams, PDFs, and whiteboard photos.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <select 
              value={filterTopic} 
              onChange={(e) => setFilterTopic(e.target.value)}
              className="px-4 py-2 bg-card border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary shadow-sm"
            >
              <option value="All">All Topics</option>
              {LEETCODE_TOPICS.map(topic => (
                <option key={topic} value={topic}>{topic}</option>
              ))}
            </select>
            <input type="file" accept="image/*,application/pdf" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading || isLoading}
              className="px-5 py-2 text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg shadow-md hover:shadow-lg disabled:opacity-50 flex items-center gap-2 transition-all font-medium text-sm"
            >
              <span className="material-symbols-outlined text-[18px]">cloud_upload</span>
              Upload File
            </button>
          </div>
        </div>

        {isUploading && (
          <div className="h-1 w-full bg-muted rounded-full overflow-hidden mb-6">
            <div 
              className="h-full bg-primary transition-all duration-300 ease-out"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}

        {error && (
          <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg text-sm border border-destructive/20 flex justify-between items-center mb-6">
            {error}
            <button onClick={() => setError('')}><span className="material-symbols-outlined">close</span></button>
          </div>
        )}

        {/* Dropzone Area */}
        <div 
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className={`border-2 border-dashed border-border/50 rounded-2xl p-10 mb-8 flex flex-col items-center justify-center transition-all duration-300 hover:border-primary/50 hover:bg-primary/5 ${attachments.length === 0 ? 'h-64' : ''}`}
        >
          <span className="material-symbols-outlined text-[48px] text-muted-foreground/50 mb-4">backup</span>
          <p className="text-foreground font-medium mb-1">Drag & Drop files here</p>
          <p className="text-muted-foreground text-sm">Supports Images (JPG, PNG) and PDFs up to 10MB</p>
        </div>

        {/* Gallery */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <span className="material-symbols-outlined text-4xl animate-spin text-primary/50">progress_activity</span>
          </div>
        ) : filteredAttachments.length > 0 ? (
          <div>
            <h4 className="font-subheading text-[12px] text-muted-foreground mb-4 uppercase tracking-wider border-b border-border/20 pb-2">
              Uploaded Files ({filteredAttachments.length})
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredAttachments.map((attachment) => {
                const isPdf = attachment.format === 'pdf' || attachment.resourceType === 'raw';
                
                return (
                  <div key={attachment.publicId} className="group relative bg-card border border-border/30 rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 flex flex-col aspect-[4/3]">
                    {/* Preview Area */}
                    <div className="flex-1 bg-muted/30 flex items-center justify-center overflow-hidden relative">
                      {isPdf ? (
                        <div className="flex flex-col items-center opacity-70">
                          <span className="material-symbols-outlined text-[56px] mb-2 text-destructive">picture_as_pdf</span>
                          <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">PDF Document</span>
                        </div>
                      ) : (
                        <Image 
                          src={attachment.url} 
                          alt={attachment.originalName} 
                          fill
                          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      )}
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3">
                        <a 
                          href={attachment.url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                          title="View File"
                        >
                          <span className="material-symbols-outlined text-[20px]">visibility</span>
                        </a>
                        <button 
                          onClick={() => navigator.clipboard.writeText(attachment.url)}
                          className="w-10 h-10 rounded-full bg-card text-foreground flex items-center justify-center hover:scale-110 transition-transform shadow-lg border border-border"
                          title="Copy Link"
                        >
                          <span className="material-symbols-outlined text-[18px]">link</span>
                        </button>
                        <button 
                          onClick={() => handleDelete(attachment.publicId)}
                          className="w-10 h-10 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                          title="Delete File"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </div>
                    
                    {/* Details Area */}
                    <div className="p-3 bg-card border-t border-border/30">
                      <p className="text-sm text-foreground font-medium truncate mb-1" title={attachment.originalName}>
                        {attachment.originalName}
                      </p>
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                        <span className="bg-muted px-1.5 py-0.5 rounded">{attachment.format ? attachment.format.toUpperCase() : 'RAW'}</span>
                        <span>{formatBytes(attachment.size)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground opacity-50">
            <span className="material-symbols-outlined text-6xl mb-4">folder_open</span>
            <p>No files found for this topic.</p>
          </div>
        )}
      </div>

      {/* Topic Selection Modal */}
      {pendingFile && (
        <div className="fixed inset-0 bg-background/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-lg rounded-2xl border border-border/20 shadow-2xl p-6 flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold mb-2">Select Topics for File</h3>
            <p className="text-muted-foreground text-sm mb-5">Tag "{pendingFile.name}" with relevant topics before uploading.</p>
            
            <input 
              type="text"
              placeholder="Search topics..."
              value={topicSearch}
              onChange={(e) => setTopicSearch(e.target.value)}
              className="w-full bg-background border border-border rounded-lg p-3 mb-4 text-sm focus:outline-none focus:border-primary shadow-sm"
            />
            
            <div className="flex-1 overflow-y-auto mb-6 border border-border/50 rounded-lg custom-scrollbar p-2 space-y-1 bg-muted/10">
              {LEETCODE_TOPICS.filter(t => t.toLowerCase().includes(topicSearch.toLowerCase())).map(topic => (
                <label key={topic} className="flex items-center gap-3 p-2.5 hover:bg-accent rounded-md cursor-pointer transition-colors text-sm">
                  <input 
                    type="checkbox"
                    checked={selectedTopics.includes(topic)}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedTopics([...selectedTopics, topic]);
                      else setSelectedTopics(selectedTopics.filter(t => t !== topic));
                    }}
                    className="accent-primary w-4 h-4"
                  />
                  {topic}
                </label>
              ))}
              {LEETCODE_TOPICS.filter(t => t.toLowerCase().includes(topicSearch.toLowerCase())).length === 0 && (
                <p className="text-center text-muted-foreground text-sm py-4">No topics found matching "{topicSearch}"</p>
              )}
            </div>
            
            <div className="flex items-center justify-end gap-3 mt-auto pt-4 border-t border-border/20">
              <button 
                onClick={() => setPendingFile(null)} 
                className="px-5 py-2.5 rounded-lg text-foreground hover:bg-accent transition-colors font-medium text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleUpload(pendingFile, selectedTopics)} 
                className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-sm shadow-md transition-all"
              >
                Upload File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
