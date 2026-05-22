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

        const markdownInsert = isPdf 
          ? `\n📄 [Download ${file.name}](${data.url})\n`
          : `\n![${file.name}](${data.url})\n`;
          
        insertTextAtCursor(markdownInsert);
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
    <div className="flex flex-col h-full bg-surface-container-lowest text-on-surface">
      {/* Toolbar */}
      <div className="h-12 bg-surface-container-low border-b border-outline-variant/10 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-primary">markdown</span>
            <span className="font-label-sm text-[12px] uppercase tracking-wider font-bold">Notes Editor</span>
          </div>
          <div className="hidden sm:flex items-center gap-1 border-l border-outline-variant/20 pl-4">
            <button onClick={() => insertTextAtCursor('**bold**')} className="p-1.5 hover:bg-surface-container-highest rounded text-on-surface-variant transition-colors"><span className="material-symbols-outlined text-[16px]">format_bold</span></button>
            <button onClick={() => insertTextAtCursor('*italic*')} className="p-1.5 hover:bg-surface-container-highest rounded text-on-surface-variant transition-colors"><span className="material-symbols-outlined text-[16px]">format_italic</span></button>
            <button onClick={() => insertTextAtCursor('\n```js\n// code\n```\n')} className="p-1.5 hover:bg-surface-container-highest rounded text-on-surface-variant transition-colors"><span className="material-symbols-outlined text-[16px]">code</span></button>
            <button onClick={() => insertTextAtCursor('$$ \nO(N) \n$$')} className="p-1.5 hover:bg-surface-container-highest rounded text-on-surface-variant transition-colors"><span className="material-symbols-outlined text-[16px]">functions</span></button>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-[11px] text-on-surface-variant flex items-center gap-1 mr-2 hidden sm:flex">
            {isSaving ? (
              <><span className="material-symbols-outlined text-[14px] animate-spin">sync</span> Saving...</>
            ) : lastSaved ? (
              <><span className="material-symbols-outlined text-[14px] text-primary">cloud_done</span> Saved</>
            ) : null}
          </div>

          <input type="file" accept="image/*,application/pdf" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-3 py-1.5 text-on-surface-variant hover:text-primary font-label-sm text-[12px] rounded border border-outline-variant/20 flex items-center gap-1.5 transition-colors disabled:opacity-50"
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
            className="p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest rounded border border-transparent transition-colors"
            title="View History Snapshots"
          >
            <span className="material-symbols-outlined text-[16px]">history</span>
          </button>

          <button 
            onClick={handleManualSave}
            disabled={isSaving}
            className="px-3 py-1.5 text-on-primary bg-primary hover:bg-primary-fixed hover:text-on-primary-fixed font-label-sm text-[12px] rounded shadow-sm disabled:opacity-50 flex items-center gap-1.5 transition-colors"
          >
            Snapshot
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-error/10 text-error px-4 py-2 text-[12px] border-b border-error/20 flex justify-between items-center shrink-0">
          {error}
          <button onClick={() => setError('')}><span className="material-symbols-outlined text-[14px]">close</span></button>
        </div>
      )}

      {/* Split Pane */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Editor Pane */}
        <div className="flex-1 border-b lg:border-b-0 lg:border-r border-outline-variant/20 flex flex-col relative bg-surface-container-lowest">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            placeholder="Write your notes here using Markdown...&#10;&#10;✨ Supports:&#10;- Math formulas: $$ O(N \log N) $$&#10;- Code blocks&#10;- Drag & drop images/PDFs"
            className="flex-1 w-full p-4 bg-transparent border-none resize-none focus:outline-none focus:ring-0 text-[14px] leading-relaxed text-on-surface font-mono placeholder:text-outline-variant/40 custom-scrollbar"
            spellCheck={false}
          />
        </div>

        {/* Live Preview Pane */}
        <div className="flex-1 bg-[#1e1e1e] overflow-y-auto p-6 custom-scrollbar">
          <div className="prose prose-invert prose-sm max-w-none text-on-surface-variant prose-headings:text-on-surface prose-a:text-primary prose-img:rounded-xl prose-img:border prose-img:border-outline-variant/20 prose-img:shadow-lg">
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
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className="bg-surface-container-high px-1.5 py-0.5 rounded text-secondary font-mono text-[13px]" {...props}>
                        {children}
                      </code>
                    );
                  }
                }}
              >
                {content}
              </ReactMarkdown>
            ) : (
              <div className="flex flex-col items-center justify-center h-full opacity-30 pt-20">
                <span className="material-symbols-outlined text-[48px] mb-4">visibility</span>
                <p>Live Preview</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* History Modal Overlay (Basic implementation) */}
      {showHistory && (
        <div className="absolute inset-0 bg-surface/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-low w-full max-w-2xl rounded-2xl border border-outline-variant/20 shadow-2xl flex flex-col max-h-full overflow-hidden">
            <div className="p-4 border-b border-outline-variant/10 flex justify-between items-center">
              <h3 className="font-headline-sm text-[18px]">Version History</h3>
              <button onClick={() => setShowHistory(false)} className="text-on-surface-variant hover:text-on-surface p-1 rounded-full hover:bg-surface-container-highest">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-4 overflow-y-auto custom-scrollbar flex-1 space-y-4">
              {(!initialNote?.history || initialNote.history.length === 0) ? (
                <div className="text-center opacity-50 py-10">No snapshots saved yet. Click "Snapshot" to save a version.</div>
              ) : (
                initialNote.history.map((hist: any, i: number) => (
                  <div key={i} className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/10">
                    <div className="text-[12px] text-on-surface-variant mb-2">
                      {new Date(hist.timestamp).toLocaleString()}
                    </div>
                    <pre className="text-[12px] font-mono text-on-surface bg-surface-container-highest p-2 rounded max-h-32 overflow-y-auto custom-scrollbar whitespace-pre-wrap">
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
