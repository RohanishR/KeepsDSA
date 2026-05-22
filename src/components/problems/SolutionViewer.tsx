'use client';

import React from 'react';
import Editor from '@monaco-editor/react';

interface SolutionViewerProps {
  solution: {
    _id: string;
    title: string;
    language: string;
    code: string;
    isOptimal: boolean;
  };
}

export default function SolutionViewer({ solution }: SolutionViewerProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(solution.code);
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e]">
      <div className="flex items-center justify-between px-4 py-2 bg-surface-container-highest border-b border-outline-variant/10">
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-mono text-tertiary">{solution.language}</span>
          {solution.isOptimal && (
            <span className="px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold bg-primary/20 text-primary border border-primary/30">
              Optimal
            </span>
          )}
        </div>
        <button 
          onClick={handleCopy}
          className="flex items-center gap-1 text-on-surface-variant hover:text-on-surface transition-colors text-[12px] px-2 py-1 rounded bg-surface-container-low hover:bg-surface-container-high"
        >
          <span className="material-symbols-outlined text-[14px]">content_copy</span>
          Copy
        </button>
      </div>
      <div className="flex-1 relative">
        <Editor
          height="100%"
          language={solution.language.toLowerCase() === 'c++' ? 'cpp' : solution.language.toLowerCase()}
          theme="vs-dark"
          value={solution.code}
          options={{
            readOnly: true,
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            padding: { top: 16, bottom: 16 },
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorBlinking: "smooth",
          }}
        />
      </div>
    </div>
  );
}
