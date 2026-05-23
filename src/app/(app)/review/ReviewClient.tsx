'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface Flashcard {
  revisionId: string;
  problem: {
    _id: string;
    title: string;
    slug: string;
    difficulty: string;
    tags: string[];
    description?: string;
    hints?: string[];
  };
  solution: {
    code: string;
    language: string;
    timeComplexity?: string;
    spaceComplexity?: string;
  } | null;
  note: {
    markdownContent: string;
  } | null;
}

export default function ReviewClient({ initialCards }: { initialCards: Flashcard[] }) {
  const [cards, setCards] = useState<Flashcard[]>(initialCards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);

  const activeCard = cards[currentIndex];

  const handleFlip = () => {
    if (!isFlipped) setIsFlipped(true);
  };

  const submitScore = async (score: number) => {
    if (!activeCard || isSubmitting) return;
    setIsSubmitting(true);

    try {
      await fetch('/api/revisions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemId: activeCard.problem._id,
          confidenceScore: score
        })
      });

      // Move to next card
      setIsFlipped(false);
      setTimeout(() => {
        if (currentIndex < cards.length - 1) {
          setCurrentIndex(prev => prev + 1);
        } else {
          setCompleted(true);
        }
        setIsSubmitting(false);
      }, 400); // Wait for flip back animation before changing content
    } catch (error) {
      console.error('Failed to submit score', error);
      setIsSubmitting(false);
    }
  };

  if (completed || cards.length === 0) {
    return (
      <div className="h-[calc(100vh-64px)] flex items-center justify-center bg-background p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel p-12 rounded-2xl flex flex-col items-center max-w-md text-center"
        >
          <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-[48px] text-primary">celebration</span>
          </div>
          <h2 className="text-3xl font-display-sm font-bold text-foreground mb-2">You're all caught up!</h2>
          <p className="text-muted-foreground mb-8">You've completed your daily revision queue. Your neural pathways are getting stronger.</p>
          <Link href="/dashboard" className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-bold shadow-lg hover:bg-primary-fixed hover:text-primary-foreground-fixed transition-colors">
            Return to Dashboard
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-64px)] bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[30%] bg-secondary/5 rounded-full blur-[80px] pointer-events-none"></div>

      {/* Header Stats */}
      <div className="absolute top-8 w-full max-w-4xl px-4 flex justify-between items-center z-10">
        <div>
          <h1 className="font-headline-sm text-[24px] font-bold text-foreground">Daily Review</h1>
          <p className="text-muted-foreground text-[14px]">Card {currentIndex + 1} of {cards.length}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-32 h-2 bg-accent rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${(currentIndex / cards.length) * 100}%` }}
            ></div>
          </div>
          <span className="text-[12px] font-bold text-primary">{Math.round((currentIndex / cards.length) * 100)}%</span>
        </div>
      </div>

      {/* 3D Flashcard Container */}
      <div className="w-full max-w-3xl h-[600px] perspective-[2000px] z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            className="w-full h-full relative preserve-3d"
            initial={{ rotateX: 90, opacity: 0 }}
            animate={{ rotateX: isFlipped ? 180 : 0, opacity: 1 }}
            exit={{ rotateX: -90, opacity: 0 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 60, damping: 15 }}
          >
            
            {/* FRONT OF CARD */}
            <div 
              className={`absolute inset-0 backface-hidden glass-panel rounded-2xl border border-border/30 shadow-2xl flex flex-col cursor-pointer ${isFlipped ? 'pointer-events-none' : ''}`}
              onClick={handleFlip}
            >
              <div className="p-8 border-b border-border/10 flex justify-between items-start">
                <div>
                  <div className="flex gap-2 mb-3">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase border
                      ${activeCard.problem.difficulty === 'Easy' ? 'bg-[#132b1a] text-[#4ade80] border-[#4ade80]/20' : ''}
                      ${activeCard.problem.difficulty === 'Medium' ? 'bg-[#3b2d13] text-[#facc15] border-[#facc15]/20' : ''}
                      ${activeCard.problem.difficulty === 'Hard' ? 'bg-[#3b1313] text-[#f87171] border-[#f87171]/20' : ''}
                    `}>
                      {activeCard.problem.difficulty}
                    </span>
                    {activeCard.problem.tags.slice(0,2).map(tag => (
                      <span key={tag} className="px-2 py-0.5 rounded text-[11px] font-medium bg-accent text-muted-foreground border border-border/20">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">{activeCard.problem.title}</h2>
                </div>
                <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center shadow-inner">
                  <span className="material-symbols-outlined text-primary">touch_app</span>
                </div>
              </div>
              <div className="p-8 flex-1 overflow-y-auto custom-scrollbar prose prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                  {activeCard.problem.description || '*No description available*'}
                </ReactMarkdown>
                
                {activeCard.problem.hints && activeCard.problem.hints.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-border/10">
                    <h4 className="text-muted-foreground flex items-center gap-2 text-sm uppercase tracking-wider mb-3">
                      <span className="material-symbols-outlined text-[16px]">lightbulb</span>
                      Hints
                    </h4>
                    <ul className="list-disc pl-5 text-muted-foreground text-sm space-y-2">
                      {activeCard.problem.hints.map((hint, i) => (
                        <li key={i}><ReactMarkdown>{hint}</ReactMarkdown></li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              <div className="p-4 bg-card/50 text-center rounded-b-2xl border-t border-border/10 text-muted-foreground text-sm animate-pulse">
                Click anywhere to flip and view the solution
              </div>
            </div>

            {/* BACK OF CARD (SOLUTION & NOTES) */}
            <div 
              className={`absolute inset-0 backface-hidden glass-panel rounded-2xl border border-border/30 shadow-2xl flex flex-col [transform:rotateX(180deg)] ${!isFlipped ? 'pointer-events-none' : ''}`}
            >
              <div className="p-6 border-b border-border/10 bg-card/50 rounded-t-2xl flex justify-between items-center shrink-0">
                <h3 className="font-bold text-foreground flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">check_circle</span>
                  Optimal Solution
                </h3>
                {activeCard.solution && (
                  <div className="flex gap-4 text-[12px] font-mono text-muted-foreground">
                    {activeCard.solution.timeComplexity && <span className="bg-background px-2 py-1 rounded shadow-inner">Time: {activeCard.solution.timeComplexity}</span>}
                    {activeCard.solution.spaceComplexity && <span className="bg-background px-2 py-1 rounded shadow-inner">Space: {activeCard.solution.spaceComplexity}</span>}
                  </div>
                )}
              </div>
              
              <div className="flex-1 flex overflow-hidden">
                {/* Code Side */}
                <div className={`overflow-y-auto custom-scrollbar p-0 bg-[#1e1e1e] ${activeCard.note ? 'w-1/2 border-r border-border/20' : 'w-full'}`}>
                  {activeCard.solution ? (
                    <SyntaxHighlighter
                      language={activeCard.solution.language.toLowerCase() || 'javascript'}
                      style={vscDarkPlus}
                      customStyle={{ margin: 0, padding: '1.5rem', background: 'transparent', fontSize: '13px' }}
                      showLineNumbers
                    >
                      {activeCard.solution.code}
                    </SyntaxHighlighter>
                  ) : (
                    <div className="p-6 text-muted-foreground flex items-center justify-center h-full">No optimal solution saved for this problem.</div>
                  )}
                </div>
                
                {/* Notes Side */}
                {activeCard.note && (
                  <div className="w-1/2 overflow-y-auto custom-scrollbar p-6 prose prose-invert prose-sm">
                    <h4 className="text-muted-foreground uppercase tracking-wider text-[11px] mb-4 border-b border-border/10 pb-2">Your Notes</h4>
                    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                      {activeCard.note.markdownContent}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </div>

          </motion.div>
        </AnimatePresence>
      </div>

      {/* Scoring Bar (Visible only when flipped) */}
      <AnimatePresence>
        {isFlipped && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute bottom-8 z-20 flex flex-col items-center gap-3"
          >
            <p className="text-foreground font-medium text-sm drop-shadow-md">How well did you recall this?</p>
            <div className="flex gap-3 glass-panel p-2 rounded-full shadow-2xl border border-border/30">
              <button onClick={() => submitScore(1)} disabled={isSubmitting} className="w-12 h-12 rounded-full flex flex-col items-center justify-center hover:bg-destructive/20 text-destructive transition-colors font-bold group">
                1<span className="text-[8px] uppercase tracking-tighter opacity-0 group-hover:opacity-100 absolute -bottom-4">Blackout</span>
              </button>
              <button onClick={() => submitScore(2)} disabled={isSubmitting} className="w-12 h-12 rounded-full flex flex-col items-center justify-center hover:bg-destructive/10 text-destructive/80 transition-colors font-bold group">
                2<span className="text-[8px] uppercase tracking-tighter opacity-0 group-hover:opacity-100 absolute -bottom-4">Failed</span>
              </button>
              <button onClick={() => submitScore(3)} disabled={isSubmitting} className="w-12 h-12 rounded-full flex flex-col items-center justify-center hover:bg-secondary/20 text-secondary transition-colors font-bold group">
                3<span className="text-[8px] uppercase tracking-tighter opacity-0 group-hover:opacity-100 absolute -bottom-4">Hard</span>
              </button>
              <button onClick={() => submitScore(4)} disabled={isSubmitting} className="w-12 h-12 rounded-full flex flex-col items-center justify-center hover:bg-primary/20 text-primary transition-colors font-bold group">
                4<span className="text-[8px] uppercase tracking-tighter opacity-0 group-hover:opacity-100 absolute -bottom-4">Good</span>
              </button>
              <button onClick={() => submitScore(5)} disabled={isSubmitting} className="w-12 h-12 rounded-full flex flex-col items-center justify-center bg-primary text-primary-foreground hover:bg-primary-fixed hover:text-primary-foreground-fixed shadow-lg transition-colors font-bold group">
                5<span className="text-[8px] uppercase tracking-tighter opacity-0 group-hover:opacity-100 absolute -bottom-4">Perfect</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
