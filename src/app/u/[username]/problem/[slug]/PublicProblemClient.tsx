'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface PublicProblemClientProps {
  data: {
    user: { name: string; username: string; image?: string };
    problem: { title: string; difficulty: string; tags: string[]; description?: string; hints?: string[] };
    solution: any | null;
    note: any | null;
  };
}

export default function PublicProblemClient({ data }: PublicProblemClientProps) {
  const { user, problem, solution, note } = data;
  const [activeTab, setActiveTab] = useState<'solution' | 'note' | 'problem'>(solution ? 'solution' : (note ? 'note' : 'problem'));

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 h-[calc(100vh-64px)] flex flex-col">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center mb-6 shrink-0">
        <div className="flex items-center gap-4">
          <Link href={`/u/${user.username}`}>
            {user.image ? (
              <Image src={user.image} alt={user.name} width={48} height={48} className="w-12 h-12 rounded-full border-2 border-surface hover:border-primary transition-colors cursor-pointer" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center border-2 border-surface hover:border-primary transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-primary text-[24px]">person</span>
              </div>
            )}
          </Link>
          <div>
            <h1 className="font-display-sm text-2xl font-bold text-foreground">{problem.title}</h1>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border
                ${problem.difficulty === 'Easy' ? 'bg-[#132b1a] text-[#4ade80] border-[#4ade80]/20' : ''}
                ${problem.difficulty === 'Medium' ? 'bg-[#3b2d13] text-[#facc15] border-[#facc15]/20' : ''}
                ${problem.difficulty === 'Hard' ? 'bg-[#3b1313] text-[#f87171] border-[#f87171]/20' : ''}
              `}>
                {problem.difficulty}
              </span>
              <span>by {user.name}</span>
            </p>
          </div>
        </div>
      </motion.div>

      <div className="flex-1 flex overflow-hidden glass-panel rounded-2xl border border-border/20 shadow-xl">
        {/* Left Pane - Problem Description */}
        <div className="w-1/3 border-r border-border/10 bg-card/50 flex flex-col hidden md:flex">
          <div className="p-4 border-b border-border/10 bg-card font-bold text-foreground flex items-center gap-2 text-sm uppercase tracking-wider">
            <span className="material-symbols-outlined text-[18px]">description</span>
            Problem
          </div>
          <div className="p-6 overflow-y-auto custom-scrollbar prose prose-invert prose-sm w-full max-w-none">
            <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
              {problem.description || '*No description provided.*'}
            </ReactMarkdown>
            
            {problem.tags && problem.tags.length > 0 && (
              <div className="mt-8 pt-4 border-t border-border/10">
                <div className="flex flex-wrap gap-2">
                  {problem.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 rounded bg-accent text-[11px] text-muted-foreground border border-border/10">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Pane - Content Tabs */}
        <div className="flex-1 flex flex-col bg-card">
          {/* Tabs */}
          <div className="flex border-b border-border/10 shrink-0">
            {solution && (
              <button 
                onClick={() => setActiveTab('solution')}
                className={`px-6 py-3 flex items-center gap-2 text-sm font-medium transition-colors ${activeTab === 'solution' ? 'bg-card/50 text-primary border-t-2 border-t-primary' : 'text-muted-foreground hover:bg-card/50 hover:text-foreground'}`}
              >
                <span className="material-symbols-outlined text-[18px]">code</span>
                Solution
              </button>
            )}
            {note && (
              <button 
                onClick={() => setActiveTab('note')}
                className={`px-6 py-3 flex items-center gap-2 text-sm font-medium transition-colors ${activeTab === 'note' ? 'bg-card/50 text-primary border-t-2 border-t-primary' : 'text-muted-foreground hover:bg-card/50 hover:text-foreground'}`}
              >
                <span className="material-symbols-outlined text-[18px]">edit_document</span>
                Notes
              </button>
            )}
            <button 
              onClick={() => setActiveTab('problem')}
              className={`md:hidden px-6 py-3 flex items-center gap-2 text-sm font-medium transition-colors ${activeTab === 'problem' ? 'bg-card/50 text-primary border-t-2 border-t-primary' : 'text-muted-foreground hover:bg-card/50 hover:text-foreground'}`}
            >
              <span className="material-symbols-outlined text-[18px]">description</span>
              Problem
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-hidden relative">
            {activeTab === 'solution' && solution && (
              <div className="h-full flex flex-col bg-[#1e1e1e]">
                <div className="flex justify-between items-center px-4 py-2 bg-[#2d2d2d] border-b border-[#404040]">
                  <span className="text-xs text-muted-foreground font-mono bg-[#1e1e1e] px-2 py-1 rounded">{solution.language}</span>
                  <div className="flex gap-4 text-xs font-mono text-[#a5a5a5]">
                    {solution.timeComplexity && <span>O({solution.timeComplexity}) Time</span>}
                    {solution.spaceComplexity && <span>O({solution.spaceComplexity}) Space</span>}
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  <SyntaxHighlighter
                    language={solution.language.toLowerCase() || 'javascript'}
                    style={vscDarkPlus}
                    customStyle={{ margin: 0, padding: '1.5rem', background: 'transparent', fontSize: '14px' }}
                    showLineNumbers
                  >
                    {solution.code}
                  </SyntaxHighlighter>
                </div>
              </div>
            )}

            {activeTab === 'note' && note && (
              <div className="h-full overflow-y-auto custom-scrollbar p-8 prose prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                  {note.markdownContent}
                </ReactMarkdown>
              </div>
            )}

            {activeTab === 'problem' && (
              <div className="h-full overflow-y-auto custom-scrollbar p-8 prose prose-invert max-w-none md:hidden">
                <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                  {problem.description || '*No description provided.*'}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
