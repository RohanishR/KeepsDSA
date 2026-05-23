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
  approachType: z.enum(['Brute Force', 'Better', 'Optimal', 'Other']).default('Optimal'),
});

type SolutionInput = z.infer<typeof solutionSchema>;

const LANGUAGES = ['Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'C', 'Go', 'Rust'] as const;

const LANG_ICONS: Record<string, string> = {
  'Python': '', 'JavaScript': '', 'TypeScript': '', 'Java': '',
  'C++': '', 'C': '', 'Go': '', 'Rust': ''
};

export default function AddSolutionForm({ slug, initialSolution, onSuccess }: { slug: string, initialSolution?: any, onSuccess: () => void }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showExplanation, setShowExplanation] = useState(!!initialSolution?.explanation);
  const [form, setForm] = useState<SolutionInput>({
    title: initialSolution?.title || '',
    language: initialSolution?.language || 'Python',
    code: initialSolution?.code || '',
    timeComplexity: initialSolution?.timeComplexity || '',
    spaceComplexity: initialSolution?.spaceComplexity || '',
    explanation: initialSolution?.explanation || '',
    isOptimal: initialSolution?.isOptimal || false,
    approachType: initialSolution?.approachType || 'Optimal',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const validatedData = solutionSchema.parse(form);
      const url = initialSolution 
        ? `/api/problems/${slug}/solutions/${initialSolution._id}` 
        : `/api/problems/${slug}/solutions`;
      const method = initialSolution ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
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
      'Python': 'python', 'JavaScript': 'javascript', 'TypeScript': 'typescript',
      'Java': 'java', 'C++': 'cpp', 'C': 'c', 'Go': 'go', 'Rust': 'rust'
    };
    return map[lang] || 'plaintext';
  };

  return (
    <div className="flex flex-col h-full bg-surface-container-lowest">
      {/* Compact Form Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-surface-container-low border-b border-outline-variant/10">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Title Input - Inline */}
          <input 
            type="text" 
            value={form.title}
            onChange={e => setForm({...form, title: e.target.value})}
            placeholder="Solution name (e.g., Optimal Two-Pointer)"
            className="flex-1 min-w-0 bg-transparent text-on-surface text-sm font-medium focus:outline-none placeholder:text-on-surface-variant/40"
            required
          />
        </div>
        
        <div className="flex items-center gap-2 shrink-0 ml-3">
          {/* Language Selector */}
          <select 
            value={form.language}
            onChange={e => setForm({...form, language: e.target.value})}
            className="bg-surface-container-highest border border-outline-variant/20 rounded-md px-2 py-1 text-on-surface text-xs focus:outline-none focus:border-primary cursor-pointer"
          >
            {LANGUAGES.map(lang => (
              <option key={lang} value={lang}>{LANG_ICONS[lang]} {lang}</option>
            ))}
          </select>

          {/* Approach Type Selector */}
          <select 
            value={form.approachType}
            onChange={e => {
              const val = e.target.value as any;
              setForm({...form, approachType: val, isOptimal: val === 'Optimal'});
            }}
            className="bg-surface-container-highest border border-outline-variant/20 rounded-md px-2 py-1 text-on-surface text-xs focus:outline-none focus:border-primary cursor-pointer"
          >
            <option value="Brute Force"> Brute</option>
            <option value="Better"> Better</option>
            <option value="Optimal"> Optimal</option>
            <option value="Other"> Other</option>
          </select>

          {/* Save Button */}
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-1.5 bg-primary text-on-primary px-3 py-1 rounded-md text-xs font-bold shadow-md hover:shadow-lg hover:bg-primary-fixed hover:text-on-primary-fixed transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="material-symbols-outlined animate-spin text-[14px]">progress_activity</span>
            ) : (
              <span className="material-symbols-outlined text-[14px]">save</span>
            )}
            Save
          </button>
        </div>
      </div>
      
      {error && (
        <div className="bg-error/10 text-error px-4 py-2 text-xs border-b border-error/20 flex items-center gap-2">
          <span className="material-symbols-outlined text-[14px]">error</span>
          {error}
        </div>
      )}

      {/* Code Editor - Takes max space */}
      <div className="flex-1 relative min-h-0">
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
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            renderLineHighlight: 'gutter',
            overviewRulerBorder: false,
            hideCursorInOverviewRuler: true,
          }}
        />
      </div>

      {/* Bottom Bar - Complexity & Explanation */}
      <div className="border-t border-outline-variant/10 bg-surface-container-low">
        <div className="flex items-center gap-3 px-4 py-2">
          {/* Time Complexity */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Time</span>
            <input 
              type="text" 
              value={form.timeComplexity}
              onChange={e => setForm({...form, timeComplexity: e.target.value})}
              placeholder="O(n)"
              className="w-20 bg-surface-container-highest border border-outline-variant/20 rounded px-2 py-0.5 text-on-surface text-xs font-mono focus:outline-none focus:border-primary"
            />
          </div>
          
          {/* Space Complexity */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Space</span>
            <input 
              type="text" 
              value={form.spaceComplexity}
              onChange={e => setForm({...form, spaceComplexity: e.target.value})}
              placeholder="O(1)"
              className="w-20 bg-surface-container-highest border border-outline-variant/20 rounded px-2 py-0.5 text-on-surface text-xs font-mono focus:outline-none focus:border-primary"
            />
          </div>

          <div className="h-4 w-px bg-outline-variant/20"></div>

          {/* Explanation Toggle */}
          <button 
            type="button"
            onClick={() => setShowExplanation(!showExplanation)}
            className={`flex items-center gap-1.5 text-xs transition-colors ${showExplanation ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            <span className="material-symbols-outlined text-[14px]">
              {showExplanation ? 'expand_more' : 'expand_less'}
            </span>
            Explanation
          </button>

          {/* Char count */}
          <span className="ml-auto text-[10px] text-on-surface-variant font-mono">{form.code.length} chars</span>
        </div>
        
        {/* Collapsible Explanation */}
        {showExplanation && (
          <div className="px-4 pb-3 border-t border-outline-variant/10">
            <textarea 
              value={form.explanation}
              onChange={e => setForm({...form, explanation: e.target.value})}
              rows={3}
              placeholder="Write your approach, intuition, and key insights..."
              className="w-full bg-surface-container-highest border border-outline-variant/20 rounded-lg px-3 py-2 text-on-surface text-sm focus:outline-none focus:border-primary custom-scrollbar resize-none mt-2"
            />
          </div>
        )}
      </div>
    </div>
  );
}
