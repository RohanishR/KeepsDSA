'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import Editor from '@monaco-editor/react';

const solutionSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  language: z.string().min(1, 'Language is required'),
  code: z.string().min(1, 'Code is required'),
  timeComplexity: z.string().optional(),
  spaceComplexity: z.string().optional(),
  explanation: z.string().optional(),
  isOptimal: z.boolean().default(false),
});

type SolutionInput = z.infer<typeof solutionSchema>;

export default function AddSolutionForm({ slug, onSuccess }: { slug: string, onSuccess: () => void }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<SolutionInput>({
    title: '',
    language: 'Python',
    code: '',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    explanation: '',
    isOptimal: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const validatedData = solutionSchema.parse(form);
      const res = await fetch(`/api/problems/${slug}/solutions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validatedData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save solution');
      }

      onSuccess();
      router.refresh();
    } catch (err: any) {
      if (err && err.errors && Array.isArray(err.errors)) {
        setError(err.errors[0].message);
      } else {
        setError(err.message || 'Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  const getMonacoLanguage = (lang: string) => {
    const map: Record<string, string> = {
      'Python': 'python',
      'JavaScript': 'javascript',
      'TypeScript': 'typescript',
      'Java': 'java',
      'C++': 'cpp',
      'C': 'c',
      'Go': 'go',
      'Rust': 'rust'
    };
    return map[lang] || 'plaintext';
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 bg-surface-container-lowest flex flex-col h-full">
      <h3 className="font-headline-sm text-[18px] text-on-surface mb-4">Add New Solution</h3>
      
      {error && (
        <div className="bg-error/10 text-error p-3 rounded-lg text-sm mb-4 border border-error/20">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 flex-1 min-h-[600px]">
        {/* Row 1: Title, Lang, Optimal */}
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 space-y-1 w-full">
            <label className="text-[12px] font-bold uppercase tracking-wider text-on-surface-variant">Title (e.g., Brute Force)</label>
            <input 
              type="text" 
              value={form.title}
              onChange={e => setForm({...form, title: e.target.value})}
              className="w-full bg-surface border border-outline-variant/30 rounded-lg px-3 py-2 text-on-surface text-sm focus:outline-none focus:border-primary"
              required
            />
          </div>
          
          <div className="w-full md:w-48 space-y-1">
            <label className="text-[12px] font-bold uppercase tracking-wider text-on-surface-variant">Language</label>
            <select 
              value={form.language}
              onChange={e => setForm({...form, language: e.target.value})}
              className="w-full bg-surface border border-outline-variant/30 rounded-lg px-3 py-2 text-on-surface text-sm focus:outline-none focus:border-primary"
            >
              {['Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'C', 'Go', 'Rust'].map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-surface-container-high transition-colors border border-transparent hover:border-outline-variant/10">
            <input 
              type="checkbox" 
              checked={form.isOptimal}
              onChange={e => setForm({...form, isOptimal: e.target.checked})}
              className="w-4 h-4 accent-primary"
            />
            <span className="text-sm font-medium text-on-surface">Mark as Optimal</span>
          </label>
        </div>

        {/* Row 2: Code Editor */}
        <div className="flex-1 flex flex-col min-h-[300px] border border-outline-variant/30 rounded-lg overflow-hidden relative">
          <div className="h-8 bg-surface-container-highest flex items-center px-3 border-b border-outline-variant/20">
            <span className="text-[11px] uppercase tracking-widest font-bold text-on-surface-variant">Code</span>
          </div>
          <div className="flex-1 relative">
            <Editor
              height="100%"
              language={getMonacoLanguage(form.language)}
              theme="vs-dark"
              value={form.code}
              onChange={(val) => setForm({...form, code: val || ''})}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                padding: { top: 16, bottom: 16 },
                cursorBlinking: "smooth",
              }}
            />
          </div>
        </div>

        {/* Row 3: Complexities */}
        <div className="flex gap-4">
          <div className="flex-1 space-y-1">
            <label className="text-[12px] font-bold uppercase tracking-wider text-on-surface-variant">Time Comp.</label>
            <input 
              type="text" 
              value={form.timeComplexity}
              onChange={e => setForm({...form, timeComplexity: e.target.value})}
              className="w-full bg-surface border border-outline-variant/30 rounded-lg px-3 py-2 text-on-surface text-sm font-mono focus:outline-none focus:border-primary"
            />
          </div>
          <div className="flex-1 space-y-1">
            <label className="text-[12px] font-bold uppercase tracking-wider text-on-surface-variant">Space Comp.</label>
            <input 
              type="text" 
              value={form.spaceComplexity}
              onChange={e => setForm({...form, spaceComplexity: e.target.value})}
              className="w-full bg-surface border border-outline-variant/30 rounded-lg px-3 py-2 text-on-surface text-sm font-mono focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Row 4: Explanation */}
        <div className="space-y-1">
          <label className="text-[12px] font-bold uppercase tracking-wider text-on-surface-variant">AI / Manual Explanation</label>
          <textarea 
            value={form.explanation}
            onChange={e => setForm({...form, explanation: e.target.value})}
            rows={4}
            placeholder="Write down the intuition and approach..."
            className="w-full bg-surface border border-outline-variant/30 rounded-lg px-3 py-2 text-on-surface text-sm focus:outline-none focus:border-primary custom-scrollbar resize-y"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button 
            type="submit" 
            disabled={loading}
            className="bg-primary text-on-primary hover:bg-primary-fixed hover:text-on-primary-fixed px-6 py-2 rounded-full font-label-md transition-colors shadow-md disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
            ) : (
              <span className="material-symbols-outlined text-[18px]">save</span>
            )}
            Save Solution
          </button>
        </div>
      </form>
    </div>
  );
}
