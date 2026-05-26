'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import debounce from 'lodash.debounce';
import { ReactSketchCanvas, ReactSketchCanvasRef } from 'react-sketch-canvas';
import { LEETCODE_TOPICS } from '@/lib/constants';
import Image from 'next/image';

interface NotesEditorProps {
  slug: string;
  initialNote?: {
    markdownContent?: string;
    history?: any[];
  };
}

export default function NotesEditor({ slug, initialNote }: NotesEditorProps) {
  const router = useRouter();
  const [content, setContent] = useState(initialNote?.markdownContent || '');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [showDrawingPad, setShowDrawingPad] = useState(false);
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(4);
  const [eraserMode, setEraserMode] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [topicSearch, setTopicSearch] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const canvasRef = useRef<ReactSketchCanvasRef>(null);

  const saveToBackend = async (markdown: string, isSnapshot = false) => {
    setIsSaving(true);
    setError('');
    try {
      const res = await fetch(`/api/problems/${slug}/notes`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          markdownContent: markdown,
          diagrams: [],
          references: [],
          isSnapshot
        }),
      });
      if (!res.ok) throw new Error('Failed to auto-save');
      setLastSaved(new Date());
      if (isSnapshot) {
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Debounced auto-save (doesn't create a snapshot)
  const debouncedSave = useCallback(
    debounce((markdown: string) => saveToBackend(markdown, false), 2000),
    [slug]
  );

  useEffect(() => {
    return () => {
      debouncedSave.cancel();
    };
  }, [debouncedSave]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setContent(val);
    debouncedSave(val);
  };

  const handleManualSave = () => {
    // Immediate save + push a snapshot to history
    saveToBackend(content, true);
    router.refresh();
  };

  const insertTextAtCursor = (text: string) => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newContent = content.substring(0, start) + text + content.substring(end);
    setContent(newContent);
    debouncedSave(newContent);
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + text.length;
      textarea.focus();
    }, 0);
  };

  const handleFileUpload = async (file: File, topics: string[] = []) => {
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }
    
    setPendingFile(null); // Close modal
    setIsUploading(true);
    setError('');
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64data = reader.result;
        
        // Determine resourceType based on file type
        const isPdf = file.type === 'application/pdf';
        const resourceType = isPdf ? 'raw' : 'auto';

        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ file: base64data, resourceType, originalName: file.name, topics })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Upload failed');

        const markdownInsert = isPdf 
          ? `\n📄 [Download ${file.name}](${data.url})\n`
          : `\n![${file.name}](${data.url})\n`;

        if (!textareaRef.current) return;
        const textarea = textareaRef.current;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        
        const newContent = content.substring(0, start) + markdownInsert + content.substring(end);
        
        setContent(newContent);
        debouncedSave(newContent);
        setViewMode('preview');
      };
    } catch (err: any) {
      setError(err.message || 'File upload failed');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
      router.refresh();
    }
  };

  const handleSaveDrawing = async () => {
    if (!canvasRef.current) return;
    try {
      const dataUrl = await canvasRef.current.exportImage("png");
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], `ipad-note-${Date.now()}.png`, { type: 'image/png' });
      setShowDrawingPad(false);
      await handleFileUpload(file);
    } catch (err) {
      setError('Failed to save drawing');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && (file.type.startsWith('image/') || file.type === 'application/pdf')) {
      handleFileUpload(file);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      insertTextAtCursor('  ');
    }
  };

  return (
    <div className="flex flex-col h-full bg-background text-foreground">
      {/* Toolbar */}
      <div className="h-10 bg-card border-b border-border flex items-center justify-between px-2 shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-2">
            <span className="material-symbols-outlined text-[16px] text-primary">markdown</span>
            <span className="font-subheading text-[12px] uppercase tracking-wider text-[11px] font-bold">Notes</span>
          </div>
          
          <div className="flex bg-black/20 p-1 rounded-lg backdrop-blur-md border border-white/5 shadow-inner">
            <button onClick={() => setViewMode('edit')} className={`px-3 py-1 rounded-md text-[12px] font-medium transition-colors ${viewMode === 'edit' ? 'bg-[#1e1e1e] text-foreground shadow-sm border border-white/5' : 'text-muted-foreground hover:text-foreground'}`}>Write</button>
            <button onClick={() => setViewMode('preview')} className={`px-3 py-1 rounded-md text-[12px] font-medium transition-colors ${viewMode === 'preview' ? 'bg-[#1e1e1e] text-foreground shadow-sm border border-white/5' : 'text-muted-foreground hover:text-foreground'}`}>Preview</button>
          </div>
          
          <div className="hidden sm:flex items-center gap-0.5 border-l border-border pl-2 ml-1">
            <button onClick={() => insertTextAtCursor('**bold**')} className="p-1 hover:bg-[#3c3c3c] rounded text-muted-foreground hover:text-foreground transition-colors"><span className="material-symbols-outlined text-[16px]">format_bold</span></button>
            <button onClick={() => insertTextAtCursor('*italic*')} className="p-1 hover:bg-[#3c3c3c] rounded text-muted-foreground hover:text-foreground transition-colors"><span className="material-symbols-outlined text-[16px]">format_italic</span></button>
            <button onClick={() => insertTextAtCursor('\n```js\n// code\n```\n')} className="p-1 hover:bg-[#3c3c3c] rounded text-muted-foreground hover:text-foreground transition-colors"><span className="material-symbols-outlined text-[16px]">code</span></button>
            <button onClick={() => insertTextAtCursor('$$ \nO(N) \n$$')} className="p-1 hover:bg-[#3c3c3c] rounded text-muted-foreground hover:text-foreground transition-colors"><span className="material-symbols-outlined text-[16px]">functions</span></button>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5">
          <div className="text-[10px] font-mono text-muted-foreground flex items-center gap-1 mr-2 hidden sm:flex">
            {isSaving ? (
              <><span className="material-symbols-outlined text-[12px] animate-spin">sync</span> Saving...</>
            ) : lastSaved ? (
              <><span className="material-symbols-outlined text-[12px] text-foreground">cloud_done</span> Saved</>
            ) : null}
          </div>

          <div className="flex items-center gap-2 border-l border-border pl-2 ml-1">
            <button 
              onClick={() => setShowDrawingPad(true)}
              className="px-2.5 py-1 text-muted-foreground hover:text-foreground hover:bg-[#3c3c3c] font-subheading text-[12px] uppercase tracking-wider rounded flex items-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[14px]">draw</span>
              <span className="hidden sm:inline">Draw</span>
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*,application/pdf"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setPendingFile(file);
                  setSelectedTopics([]);
                  setTopicSearch('');
                }
              }}
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-3 py-1.5 rounded-md bg-accent hover:bg-primary/20 hover:text-primary transition-colors text-[12px] font-medium text-foreground flex items-center gap-1.5 shadow-sm disabled:opacity-50 border border-border/10"
            >{isUploading ? (
              <span className="material-symbols-outlined text-[14px] animate-spin">progress_activity</span>
            ) : (
              <span className="material-symbols-outlined text-[14px]">upload_file</span>
            )}
            <span className="hidden sm:inline">Upload</span>
          </button>
          </div>

          <button 
            onClick={() => setShowHistory(true)}
            className="p-1 text-muted-foreground hover:text-foreground hover:bg-[#3c3c3c] rounded transition-colors"
            title="View History Snapshots"
          >
            <span className="material-symbols-outlined text-[16px]">history</span>
          </button>

          <button 
            onClick={handleManualSave}
            disabled={isSaving}
            className="px-2.5 py-1 text-primary bg-primary/10 hover:bg-primary/20 border border-primary/20 font-subheading text-[12px] uppercase tracking-wider text-[11px] rounded disabled:opacity-50 flex items-center gap-1 transition-colors ml-1"
          >
            Snapshot
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive px-4 py-1.5 text-[11px] border-b border-destructive/20 flex justify-between items-center shrink-0">
          {error}
          <button onClick={() => setError('')}><span className="material-symbols-outlined text-[14px]">close</span></button>
        </div>
      )}

      {/* Editor / Preview Pane (Full Width) */}
      <div className="flex-1 flex flex-col relative min-h-0 bg-background">
        {viewMode === 'edit' ? (
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              debouncedSave(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            placeholder="Write your notes here... Supports Markdown and MathJax $$...$$"
            className="w-full h-full p-6 bg-transparent text-foreground placeholder:text-muted-foreground/30 resize-none outline-none font-mono text-[13px] leading-relaxed custom-scrollbar"
            spellCheck="false"
          />
        ) : (
          <div className="h-full overflow-y-auto p-6 bg-[#1e1e1e] custom-scrollbar prose prose-invert prose-sm max-w-none text-[#cccccc] prose-headings:text-[#e5e5e5] prose-a:text-primary prose-img:rounded-md prose-img:border prose-img:border-[#3c3c3c] prose-pre:bg-[#252526] prose-pre:border prose-pre:border-[#3c3c3c]">
            {content ? (
              <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                  code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={vscDarkPlus as any}
                        language={match[1]}
                        PreTag="div"
                        customStyle={{ margin: 0, padding: '1rem', background: 'transparent' }}
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className="bg-[#252526] px-1.5 py-0.5 rounded text-[#ce9178] font-mono text-[13px] border border-[#3c3c3c]" {...props}>
                        {children}
                      </code>
                    );
                  },
                  img({src, alt}) {
                    return <Image src={src || ''} alt={alt || ''} width={0} height={0} sizes="100vw" style={{ width: '100%', height: 'auto' }} className="rounded-lg my-4 shadow-lg border border-white/10" />
                  },
                  a({href, children}) {
                    return <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{children}</a>
                  },
                  h1({children}) { return <h1 className="text-2xl font-bold mt-6 mb-4 text-white border-b border-white/10 pb-2">{children}</h1> },
                  h2({children}) { return <h2 className="text-xl font-bold mt-5 mb-3 text-white">{children}</h2> },
                  h3({children}) { return <h3 className="text-lg font-bold mt-4 mb-2 text-white/90">{children}</h3> },
                  p({children}) { return <p className="mb-4">{children}</p> },
                  ul({children}) { return <ul className="list-disc pl-5 mb-4 space-y-1">{children}</ul> },
                  ol({children}) { return <ol className="list-decimal pl-5 mb-4 space-y-1">{children}</ol> },
                  blockquote({children}) { return <blockquote className="border-l-4 border-primary/50 pl-4 italic text-muted-foreground my-4">{children}</blockquote> }
                }}
              >
                {content || '*No notes yet. Switch to **Write** mode to add some!*'}
              </ReactMarkdown>
            ) : (
              <div className="flex flex-col items-center justify-center h-full opacity-30 text-center">
                <span className="material-symbols-outlined text-[48px] mb-4">preview</span>
                <p>Nothing to preview. Start writing!</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* History Modal Overlay (Basic implementation) */}
      {showHistory && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card/50 w-full max-w-2xl rounded-2xl border border-border/20 shadow-2xl flex flex-col max-h-full overflow-hidden">
            <div className="p-4 border-b border-border/10 flex justify-between items-center">
              <h3 className="font-headline-sm text-[18px]">Version History</h3>
              <button onClick={() => setShowHistory(false)} className="text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-accent">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-4 overflow-y-auto custom-scrollbar flex-1 space-y-4">
              {(!initialNote?.history || initialNote.history.length === 0) ? (
                <div className="text-center opacity-50 py-10">No snapshots saved yet. Click "Snapshot" to save a version.</div>
              ) : (
                initialNote.history.map((hist: any, i: number) => (
                  <div key={i} className="bg-card p-4 rounded-xl border border-border/10">
                    <div className="text-[12px] text-muted-foreground mb-2">
                      {new Date(hist.timestamp).toLocaleString()}
                    </div>
                    <pre className="text-[12px] font-mono text-foreground bg-accent p-2 rounded max-h-32 overflow-y-auto custom-scrollbar whitespace-pre-wrap">
                      {hist.content}
                    </pre>
                  </div>
                )).reverse()
              )}
            </div>
          </div>
        </div>
      )}

      {/* Drawing Pad Modal */}
      {showDrawingPad && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-4xl rounded-2xl border border-border/20 shadow-2xl flex flex-col h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-border/10 flex justify-between items-center bg-[#1e1e1e]">
              <h3 className="font-headline-sm text-[18px] flex items-center gap-2 text-white">
                <span className="material-symbols-outlined">draw</span> iPad Canvas
              </h3>
              <div className="flex items-center gap-4">
                {/* Tools */}
                <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg">
                  <button 
                    onClick={() => { setEraserMode(false); canvasRef.current?.eraseMode(false); }} 
                    className={`p-1.5 rounded ${!eraserMode ? 'bg-primary text-white' : 'text-white/70 hover:text-white hover:bg-white/10'}`} 
                    title="Pen"
                  >
                    <span className="material-symbols-outlined text-[16px]">edit</span>
                  </button>
                  <button 
                    onClick={() => { setEraserMode(true); canvasRef.current?.eraseMode(true); }} 
                    className={`p-1.5 rounded ${eraserMode ? 'bg-primary text-white' : 'text-white/70 hover:text-white hover:bg-white/10'}`} 
                    title="Eraser"
                  >
                    <span className="material-symbols-outlined text-[16px]">ink_eraser</span>
                  </button>
                </div>

                {/* Colors */}
                {!eraserMode && (
                  <div className="flex items-center gap-2 border-l border-white/10 pl-4">
                    {['#000000', '#ef4444', '#3b82f6', '#22c55e', '#eab308'].map(color => (
                      <button
                        key={color}
                        onClick={() => setStrokeColor(color)}
                        className={`w-6 h-6 rounded-full border-2 ${strokeColor === color ? 'border-white scale-110 shadow-lg' : 'border-transparent hover:scale-110'} transition-transform`}
                        style={{ backgroundColor: color }}
                        title="Color"
                      />
                    ))}
                  </div>
                )}

                {/* Size */}
                <div className="flex items-center gap-2 border-l border-white/10 pl-4">
                  <span className="material-symbols-outlined text-[14px] text-white/50">line_weight</span>
                  <input 
                    type="range" 
                    min="1" max="20" 
                    value={strokeWidth} 
                    onChange={(e) => setStrokeWidth(parseInt(e.target.value))} 
                    className="w-20 accent-primary cursor-pointer"
                  />
                </div>

                {/* Canvas Actions */}
                <div className="flex items-center gap-1 border-l border-white/10 pl-4">
                  <button onClick={() => canvasRef.current?.undo()} className="text-white/70 hover:text-white p-1.5 rounded bg-white/5 hover:bg-white/10" title="Undo">
                    <span className="material-symbols-outlined text-[16px]">undo</span>
                  </button>
                  <button onClick={() => canvasRef.current?.clearCanvas()} className="text-white/70 hover:text-white p-1.5 rounded bg-white/5 hover:bg-white/10" title="Clear Canvas">
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 pl-2">
                  <button onClick={handleSaveDrawing} className="px-4 py-1.5 rounded bg-primary text-white font-bold text-[12px] uppercase tracking-wider hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                    Insert
                  </button>
                  <button onClick={() => setShowDrawingPad(false)} className="text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10 ml-2">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="flex-1 bg-white relative" style={{ backgroundColor: '#ffffff' }}>
              <ReactSketchCanvas
                ref={canvasRef}
                strokeWidth={strokeWidth}
                strokeColor={strokeColor}
                canvasColor="#ffffff"
                className="w-full h-full border-none"
              />
              {/* Paper grid background for better drawing experience */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.06]" style={{backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
            </div>
          </div>
        </div>
      )}

      {/* Topic Selection Modal for Inline Uploads */}
      {pendingFile && (
        <div className="absolute inset-0 bg-background/90 backdrop-blur-md z-[60] flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-lg rounded-2xl border border-border/20 shadow-2xl p-6 flex flex-col max-h-[80vh]">
            <h3 className="text-xl font-bold mb-2">Select Topics for File</h3>
            <p className="text-muted-foreground text-sm mb-4">Tag "{pendingFile.name}" with relevant topics before uploading.</p>
            
            <input 
              type="text"
              placeholder="Search topics..."
              value={topicSearch}
              onChange={(e) => setTopicSearch(e.target.value)}
              className="w-full bg-background border border-border/20 rounded p-2 mb-4 text-sm focus:outline-none focus:border-primary"
            />
            
            <div className="flex-1 overflow-y-auto mb-4 border border-border/10 rounded custom-scrollbar p-2 space-y-1">
              {LEETCODE_TOPICS.filter(t => t.toLowerCase().includes(topicSearch.toLowerCase())).map(topic => (
                <label key={topic} className="flex items-center gap-2 p-2 hover:bg-accent rounded cursor-pointer transition-colors text-sm">
                  <input 
                    type="checkbox"
                    checked={selectedTopics.includes(topic)}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedTopics([...selectedTopics, topic]);
                      else setSelectedTopics(selectedTopics.filter(t => t !== topic));
                    }}
                    className="accent-primary"
                  />
                  {topic}
                </label>
              ))}
            </div>
            
            <div className="flex items-center justify-end gap-3 mt-auto">
              <button onClick={() => setPendingFile(null)} className="px-4 py-2 rounded text-muted-foreground hover:bg-accent transition-colors text-sm">Cancel</button>
              <button onClick={() => handleFileUpload(pendingFile, selectedTopics)} className="px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-sm shadow-lg shadow-primary/20">Upload File</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
