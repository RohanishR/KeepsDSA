'use client';

import React, { useState } from 'react';
import Editor from '@monaco-editor/react';

interface SolutionViewerProps {
  solution: {
    _id: string;
    title: string;
    language: string;
    code: string;
    isOptimal: boolean;
    approachType?: string;
    timeComplexity?: string;
    spaceComplexity?: string;
    explanation?: string;
  };
}

export default function SolutionViewer({ solution }: SolutionViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(solution.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getMonacoLanguage = (lang: string) => {
    const map: Record<string, string> = {
      'Python': 'python', 'JavaScript': 'javascript', 'TypeScript': 'typescript',
      'Java': 'java', 'C++': 'cpp', 'C': 'c', 'Go': 'go', 'Rust': 'rust'
    };
    return map[lang] || 'plaintext';
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-card border-b border-border">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono text-foreground bg-background px-2 py-0.5 rounded">{solution.language}</span>
          {solution.approachType && solution.approachType !== 'Other' ? (
            <span className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold border 
              ${solution.approachType === 'Brute Force' ? 'bg-[#3b1313] text-[#f87171] border-[#f87171]/20' : ''}
              ${solution.approachType === 'Better' ? 'bg-[#3b2d13] text-[#facc15] border-[#facc15]/20' : ''}
              ${solution.approachType === 'Optimal' ? 'bg-primary/20 text-primary border-primary/30' : ''}
            `}>
              <span className="material-symbols-outlined text-[12px]">
                {solution.approachType === 'Brute Force' ? 'hardware' : ''}
                {solution.approachType === 'Better' ? 'trending_up' : ''}
                {solution.approachType === 'Optimal' ? 'star' : ''}
              </span>
              {solution.approachType}
            </span>
          ) : solution.isOptimal ? (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold bg-primary/20 text-primary border border-primary/30">
              <span className="material-symbols-outlined text-[12px]">star</span>
              Optimal
            </span>
          ) : null}
          {solution.timeComplexity && (
            <span className="text-[11px] font-mono text-muted-foreground">
              ⏱ {solution.timeComplexity}
            </span>
          )}
          {solution.spaceComplexity && (
            <span className="text-[11px] font-mono text-muted-foreground">
              💾 {solution.spaceComplexity}
            </span>
          )}
        </div>
        <button 
          onClick={handleCopy}
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors text-[11px] px-2 py-1 rounded hover:bg-[#3c3c3c]"
        >
          <span className="material-symbols-outlined text-[14px]">
            {copied ? 'check' : 'content_copy'}
          </span>
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {/* Editor */}
      <div className="flex-1 relative min-h-0">
        <Editor
          height="100%"
          language={getMonacoLanguage(solution.language)}
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
            renderLineHighlight: 'none',
            overviewRulerBorder: false,
            hideCursorInOverviewRuler: true,
            lineNumbersMinChars: 3,
          }}
        />
      </div>
    </div>
  );
}
