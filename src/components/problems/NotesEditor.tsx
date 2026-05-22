'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface NotesEditorProps {
  slug: string;
  initialNote?: {
    markdownContent?: string;
  };
}

export default function NotesEditor({ slug, initialNote }: NotesEditorProps) {
  const router = useRouter();
  const [content, setContent] = useState(initialNote?.markdownContent || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  // If there's no initial content, default to edit mode
  useEffect(() => {
    if (!initialNote?.markdownContent) {
      setIsEditing(true);
    }
  }, [initialNote]);

  const handleSave = async () => {
    setIsSaving(true);
    setError('');

    try {
      const res = await fetch(`/api/problems/${slug}/notes`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          markdownContent: content,
          diagrams: [],
          references: [],
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save notes');
      }

      setIsEditing(false);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-surface-container-lowest text-on-surface">
      <div className="h-10 bg-surface-container-low border-b border-outline-variant/10 flex items-center justify-between px-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px] text-primary">edit_note</span>
          <span className="font-label-sm text-[12px] uppercase tracking-wider font-bold">Personal Notes</span>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button 
                onClick={() => setIsEditing(false)} 
                className="px-3 py-1 text-on-surface-variant hover:text-on-surface font-label-sm text-[12px] rounded border border-outline-variant/20 bg-surface-container-highest"
              >
                Preview
              </button>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="px-3 py-1 text-on-primary bg-primary hover:bg-primary/90 font-label-sm text-[12px] rounded shadow-sm disabled:opacity-50 flex items-center gap-1"
              >
                {isSaving ? 'Saving...' : 'Save Notes'}
              </button>
            </>
          ) : (
            <button 
              onClick={() => setIsEditing(true)} 
              className="px-3 py-1 text-on-surface-variant hover:text-on-surface font-label-sm text-[12px] rounded flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">edit</span> Edit
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-error/10 text-error px-4 py-2 text-[12px] border-b border-error/20">
          {error}
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 relative">
        {isEditing ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your notes here using Markdown..."
            className="w-full h-full bg-transparent border-none resize-none focus:outline-none focus:ring-0 text-[14px] leading-relaxed text-on-surface font-mono placeholder:text-outline-variant/50"
            spellCheck={false}
          />
        ) : (
          <div className="prose prose-invert prose-sm max-w-none text-on-surface-variant prose-headings:text-on-surface prose-a:text-primary">
            {content ? (
              // Basic markdown rendering (ideally use a library like react-markdown here later)
              <div className="whitespace-pre-wrap">{content}</div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full opacity-50 pt-10">
                <span className="material-symbols-outlined text-[48px] mb-4">note_stack_add</span>
                <p>No notes yet. Click Edit to start writing.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
