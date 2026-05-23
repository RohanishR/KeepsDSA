'use client';

import React, { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface Attachment {
  url: string;
  publicId: string;
  originalName: string;
  resourceType: string;
  format?: string;
  bytes?: number;
  createdAt: string | Date;
}

interface AttachmentsManagerProps {
  slug: string;
  initialAttachments?: Attachment[];
}

export default function AttachmentsManager({ slug, initialAttachments = [] }: AttachmentsManagerProps) {
  const router = useRouter();
  const [attachments, setAttachments] = useState<Attachment[]>(initialAttachments);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleUpload = async (file: File) => {
    // Basic validation
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }
    
    setIsUploading(true);
    setError('');
    setUploadProgress(10); // Start progress

    try {
      // 1. Read file as base64
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

        // 2. Upload to Cloudinary via Next.js API
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ file: base64data, resourceType })
        });
        
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error || 'Cloudinary upload failed');

        setUploadProgress(80);

        // 3. Save to MongoDB (Notes Attachments array)
        const newAttachment: Attachment = {
          url: uploadData.url,
          publicId: uploadData.publicId,
          originalName: uploadData.originalName || file.name,
          resourceType: uploadData.resourceType,
          format: uploadData.format,
          bytes: uploadData.bytes,
          createdAt: new Date(),
        };

        const newAttachmentsArray = [...attachments, newAttachment];

        const dbRes = await fetch(`/api/problems/${slug}/notes`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ attachments: newAttachmentsArray }),
        });

        if (!dbRes.ok) {
          // Rollback Cloudinary if DB save fails
          await fetch(`/api/upload?public_id=${uploadData.publicId}`, { method: 'DELETE' });
          throw new Error('Failed to save attachment to database');
        }

        setUploadProgress(100);
        setAttachments(newAttachmentsArray);
        router.refresh();
      };
    } catch (err: any) {
      setError(err.message || 'File upload failed');
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 500); // Small delay to let progress bar finish
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && (file.type.startsWith('image/') || file.type === 'application/pdf')) {
      handleUpload(file);
    } else if (file) {
      setError('Only images and PDFs are supported');
    }
  };

  const handleDelete = async (publicId: string) => {
    if (!confirm('Are you sure you want to permanently delete this file?')) return;
    
    setError('');
    try {
      // 1. Delete from Cloudinary
      const delRes = await fetch(`/api/upload?public_id=${publicId}`, { method: 'DELETE' });
      if (!delRes.ok) {
        const delData = await delRes.json();
        throw new Error(delData.error || 'Failed to delete from Cloudinary');
      }

      // 2. Update MongoDB
      const newAttachmentsArray = attachments.filter(a => a.publicId !== publicId);
      const dbRes = await fetch(`/api/problems/${slug}/notes`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attachments: newAttachmentsArray }),
      });

      if (!dbRes.ok) throw new Error('Failed to update database');

      setAttachments(newAttachmentsArray);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Deletion failed');
    }
  };

  return (
    <div className="flex flex-col h-full bg-card text-foreground">
      <div className="h-12 bg-card/50 border-b border-border/10 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-primary">attachment</span>
          <span className="font-subheading text-[12px] uppercase tracking-wider text-[12px] uppercase tracking-wider font-bold">Attachments Manager</span>
        </div>
        <div className="flex items-center gap-3">
          <input type="file" accept="image/*,application/pdf" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-4 py-1.5 text-primary-foreground bg-primary hover:bg-primary-fixed hover:text-primary-foreground-fixed font-subheading text-[12px] uppercase tracking-wider text-[12px] rounded shadow-sm disabled:opacity-50 flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[14px]">upload</span>
            Upload File
          </button>
        </div>
      </div>

      {isUploading && (
        <div className="h-1 w-full bg-accent overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}

      {error && (
        <div className="bg-destructive/10 text-destructive px-4 py-2 text-[12px] border-b border-destructive/20 flex justify-between items-center shrink-0">
          {error}
          <button onClick={() => setError('')}><span className="material-symbols-outlined text-[14px]">close</span></button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {/* Dropzone Area */}
        <div 
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className={`border-2 border-dashed border-border/30 rounded-xl p-8 mb-6 flex flex-col items-center justify-center transition-colors hover:border-primary/50 hover:bg-card/50/50 ${attachments.length === 0 ? 'h-64' : ''}`}
        >
          <span className="material-symbols-outlined text-[48px] text-muted-foreground mb-4">cloud_upload</span>
          <p className="text-foreground font-medium text-sm mb-1">Drag & Drop files here</p>
          <p className="text-muted-foreground text-xs">Supports Images (JPG, PNG) and PDFs up to 10MB</p>
        </div>

        {/* Gallery */}
        {attachments.length > 0 && (
          <div>
            <h4 className="font-subheading text-[14px] text-muted-foreground mb-4 uppercase tracking-wider text-[11px] border-b border-border/10 pb-2">Uploaded Files ({attachments.length})</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {attachments.map((attachment) => {
                const isPdf = attachment.format === 'pdf' || attachment.resourceType === 'raw';
                
                return (
                  <div key={attachment.publicId} className="group relative bg-card/50 border border-border/20 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-border/40 transition-all flex flex-col h-48">
                    {/* Preview Area */}
                    <div className="flex-1 bg-card flex items-center justify-center overflow-hidden relative">
                      {isPdf ? (
                        <div className="flex flex-col items-center opacity-60">
                          <span className="material-symbols-outlined text-[48px] mb-2 text-destructive">picture_as_pdf</span>
                          <span className="text-[10px] font-mono uppercase tracking-wider">PDF Document</span>
                        </div>
                      ) : (
                        <img 
                          src={attachment.url} 
                          alt={attachment.originalName} 
                          className="w-full h-full object-cover"
                        />
                      )}
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <a 
                          href={attachment.url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                          title="View File"
                        >
                          <span className="material-symbols-outlined text-[18px]">visibility</span>
                        </a>
                        <button 
                          onClick={() => navigator.clipboard.writeText(attachment.url)}
                          className="w-10 h-10 rounded-full bg-accent text-foreground flex items-center justify-center hover:scale-110 transition-transform border border-border/20 shadow-lg"
                          title="Copy Link"
                        >
                          <span className="material-symbols-outlined text-[18px]">link</span>
                        </button>
                        <button 
                          onClick={() => handleDelete(attachment.publicId)}
                          className="w-10 h-10 rounded-full bg-destructive text-on-error flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                          title="Delete File"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </div>
                    
                    {/* Details Area */}
                    <div className="h-14 p-2 bg-card/50 border-t border-border/10 flex flex-col justify-center">
                      <p className="text-[12px] text-foreground font-medium truncate mb-0.5">{attachment.originalName}</p>
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono">
                        <span>{attachment.format ? attachment.format.toUpperCase() : 'RAW'}</span>
                        <span>{attachment.bytes ? formatBytes(attachment.bytes) : 'Unknown size'}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
