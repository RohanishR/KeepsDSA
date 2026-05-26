'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import 'katex/dist/katex.min.css';

interface NoteData {
  _id: string;
  problem: {
    title: string;
    slug: string;
    difficulty: string;
    tags: string[];
  };
  markdownContent: string;
  attachments: {
    url: string;
    originalName: string;
    resourceType: string;
  }[];
  updatedAt: string;
}

interface NotesClientProps {
  initialNotes: NoteData[];
}

export default function NotesClient({ initialNotes }: NotesClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredNotes = initialNotes.filter(note => 
    note.problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.markdownContent.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.problem.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="pb-16 max-w-6xl mx-auto w-full">
      {/* Header with entrance animation */}
      <motion.div 
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="mb-8"
      >
        <h1 className="font-heading text-[32px] md:text-[40px] font-bold text-foreground tracking-tighter leading-none mb-2">
          Your Notes
        </h1>
        <p className="font-sans text-[16px] text-muted-foreground max-w-2xl">
          A centralized view of all your handwritten and markdown notes across every problem.
        </p>
      </motion.div>

      {/* Search bar with focus glow */}
      <motion.div 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
        className="glass-panel p-2 mb-8 flex items-center gap-3 w-full max-w-2xl sticky top-20 z-20 focus-glow rounded-xl"
      >
        <span className="material-symbols-outlined text-muted-foreground ml-2">search</span>
        <input 
          type="text" 
          placeholder="Search by problem name, tag, or note content..." 
          className="bg-transparent border-none focus:outline-none focus:ring-0 text-foreground font-subheading text-[14px] w-full placeholder:text-muted-foreground/50"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <motion.button 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={() => setSearchTerm('')} 
            className="text-muted-foreground hover:text-foreground p-1 mr-1 rounded-full hover:bg-accent transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </motion.button>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredNotes.length > 0 ? (
            filteredNotes.map((note, index) => (
              <motion.div
                key={note._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, delay: index * 0.05, ease: 'easeOut' }}
                className="glass-panel rounded-xl overflow-hidden flex flex-col card-hover group"
              >
                {/* Header */}
                <div className="p-5 border-b border-border/10 bg-card/50/50 flex justify-between items-start gap-4">
                  <div>
                    <Link href={`/problem/${note.problem.slug}?tab=notes`} className="group/link">
                      <h3 className="font-bold text-[18px] text-foreground group-hover/link:text-primary transition-colors leading-tight mb-1">
                        {note.problem.title}
                      </h3>
                    </Link>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border
                        ${note.problem.difficulty === 'Easy' ? 'bg-[#132b1a] text-[#4ade80] border-[#4ade80]/20' : ''}
                        ${note.problem.difficulty === 'Medium' ? 'bg-[#3b2d13] text-[#facc15] border-[#facc15]/20' : ''}
                        ${note.problem.difficulty === 'Hard' ? 'bg-[#3b1313] text-[#f87171] border-[#f87171]/20' : ''}
                      `}>
                        {note.problem.difficulty}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        Last updated {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                  <Link 
                    href={`/problem/${note.problem.slug}?tab=notes`}
                    className="p-2 rounded-lg bg-accent hover:bg-primary/20 hover:text-primary transition-all duration-200 text-muted-foreground shrink-0 hover:scale-105 active:scale-95"
                    title="Edit Notes"
                  >
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                  </Link>
                </div>

                {/* Content Preview */}
                <div className="p-5 flex-1 bg-[#1e1e1e] relative">
                  <div className="prose prose-invert prose-sm max-w-none text-[#cccccc] prose-headings:text-[#e5e5e5] prose-a:text-primary prose-img:rounded-md prose-img:border prose-img:border-[#3c3c3c] prose-pre:bg-[#252526] prose-pre:border prose-pre:border-[#3c3c3c] line-clamp-[8] overflow-hidden">
                    {note.markdownContent ? (
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
                          }
                        }}
                      >
                        {note.markdownContent}
                      </ReactMarkdown>
                    ) : (
                      <p className="italic text-muted-foreground/50">No written notes, only attachments.</p>
                    )}
                  </div>
                  
                  {/* Fade out long content */}
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-[#1e1e1e] to-transparent pointer-events-none"></div>
                </div>

                {/* Attachments Footer */}
                {note.attachments.length > 0 && (
                  <div className="p-4 border-t border-[#3c3c3c] bg-[#252526] flex items-center gap-3 overflow-x-auto custom-scrollbar">
                    {note.attachments.map((att, i) => (
                      <a 
                        key={i} 
                        href={att.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center gap-2 bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1.5 hover:border-primary/50 transition-all duration-200 shrink-0 hover:scale-[1.02]"
                      >
                        <span className="material-symbols-outlined text-[14px] text-muted-foreground">
                          {att.resourceType === 'image' ? 'image' : 'description'}
                        </span>
                        <span className="text-[11px] text-[#cccccc] truncate max-w-[120px]">{att.originalName}</span>
                      </a>
                    ))}
                  </div>
                )}
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
              className="col-span-full glass-panel p-12 flex flex-col items-center justify-center text-center rounded-xl"
            >
              <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mb-4 text-muted-foreground animate-float">
                <span className="material-symbols-outlined text-[32px]">edit_note</span>
              </div>
              <h3 className="text-[20px] font-bold text-foreground mb-2">No notes found</h3>
              <p className="text-[14px] text-muted-foreground max-w-md">
                {searchTerm ? 'Try adjusting your search terms.' : "You haven't written any notes yet. Go to a problem workspace and start typing!"}
              </p>
              {!searchTerm && (
                <Link href="/explore" className="mt-6 bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:scale-[1.02] active:scale-[0.98]">
                  Find a Problem
                </Link>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
