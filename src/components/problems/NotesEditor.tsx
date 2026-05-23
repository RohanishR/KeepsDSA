'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import debounce from 'lodash.debounce';

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
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  const handleFileUpload = async (file: File) => {
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
          body: JSON.stringify({ file: base64data, resourceType })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Upload failed');

        const shortId = `img-${Math.random().toString(36).substring(2, 6)}`;
        const markdownInsert = isPdf 
          ? `\n📄 [Download ${file.name}][${shortId}]\n`
          : `\n![${file.name}][${shortId}]\n`;
          
        const reference = `\n[${shortId}]: ${data.url}\n`;

        if (!textareaRef.current) return;
        const textarea = textareaRef.current;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        
        // Ensure there's a newline before appending references if it's the first one
        const hasReferences = content.includes('\n[');
        const refSection = (!hasReferences && content.trim() ? '\n\n' : '') + reference;
        
        const newContent = content.substring(0, start) + markdownInsert + content.substring(end) + refSection;
        
        setContent(newContent);
        debouncedSave(newContent);
        
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + markdownInsert.length;
          textarea.focus();
        }, 0);
      };
    } catch (err: any) {
      setError(err.message || 'File upload failed');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
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
            <span className="font-subheading text-[12px] uppercase tracking-wider text-[11px] uppercase tracking-wider font-bold">Notes</span>
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

          <input type="file" accept="image/*,application/pdf" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-2.5 py-1 text-muted-foreground hover:text-foreground hover:bg-[#3c3c3c] font-subheading text-[12px] uppercase tracking-wider text-[11px] rounded flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            {isUploading ? (
              <span className="material-symbols-outlined text-[14px] animate-spin">progress_activity</span>
            ) : (
              <span className="material-symbols-outlined text-[14px]">upload_file</span>
            )}
            <span className="hidden sm:inline">Upload</span>
          </button>

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

      {/* Editor Pane (Full Width) */}
      <div className="flex-1 flex flex-col relative min-h-0 bg-background">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          placeholder="Write your notes here using Markdown...&#10;&#10;✨ Supports:&#10;- Math formulas: $$ O(N \log N) $$&#10;- Code blocks&#10;- Drag & drop images/PDFs"
          className="flex-1 w-full p-6 bg-transparent border-none resize-none focus:outline-none focus:ring-0 text-[14px] leading-[1.6] text-foreground font-mono placeholder:text-muted-foreground custom-scrollbar"
          spellCheck={false}
        />
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
    </div>
  );
}
