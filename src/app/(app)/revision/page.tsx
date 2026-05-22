'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function RevisionPage() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [queue, setQueue] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const res = await fetch('/api/revisions/due');
        const data = await res.json();
        if (data.queue) {
          setQueue(data.queue);
        }
      } catch (error) {
        console.error('Failed to fetch revision queue:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchQueue();
  }, []);

  const handleFeedback = async (quality: string) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    const currentItem = queue[currentIndex];
    
    try {
      await fetch('/api/revisions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemId: currentItem.problem._id,
          quality
        })
      });

      // Move to next card
      setIsFlipped(false);
      
      // Slight delay for smooth flip back before changing content
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        setIsSubmitting(false);
      }, 300);

    } catch (error) {
      console.error('Failed to submit revision feedback:', error);
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-primary animate-pulse font-mono">Loading your spaced repetition queue...</div>
      </div>
    );
  }

  if (queue.length === 0 || currentIndex >= queue.length) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center pt-8 pb-16">
        <div className="glass-panel rounded-xl p-12 glow-accent flex flex-col items-center justify-center max-w-md text-center">
          <span className="material-symbols-outlined text-[64px] text-primary mb-6">workspace_premium</span>
          <h2 className="font-headline-lg text-[32px] leading-[40px] font-bold text-on-surface tracking-tight mb-4">You're all caught up!</h2>
          <p className="text-on-surface-variant font-body-md mb-8">
            You've completed all your scheduled revisions for today. Your logic is sharp.
          </p>
          <Link href="/explore" className="px-6 py-3 rounded-lg bg-primary text-on-primary font-bold hover:bg-primary/90 transition-colors shadow-sm">
            Learn Something New
          </Link>
        </div>
      </div>
    );
  }

  const currentItem = queue[currentIndex];
  const { problem, solution } = currentItem;

  return (
    <div className="flex-1 relative flex flex-col items-center justify-center pt-8 pb-16">
      {/* Header / Context */}
      <div className="w-full max-w-[800px] mb-8 flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 text-primary font-label-sm text-[12px] font-medium tracking-[0.05em] mb-2">
            <span className="material-symbols-outlined text-[16px]">sync</span>
            <span>SPACED REPETITION SESSION</span>
          </div>
          <h2 className="font-headline-lg text-[32px] leading-[40px] font-bold text-on-surface tracking-tight">Daily Revision</h2>
        </div>
        <div className="text-right">
          <div className="text-on-surface-variant font-label-sm text-[12px] font-medium tracking-[0.05em] mb-1">Cards Due Today</div>
          <div className="text-2xl font-mono text-primary">{currentIndex + 1} <span className="text-outline-variant text-lg">/ {queue.length}</span></div>
        </div>
      </div>

      {/* Flashcard Container */}
      <div 
        className="w-full max-w-[800px] h-[450px] perspective-1000 relative group cursor-pointer" 
        onClick={() => !isSubmitting && setIsFlipped(!isFlipped)}
      >
        <div className={`w-full h-full relative transform-style-3d transition-transform duration-700 ${isFlipped ? 'rotate-y-180' : ''}`}>
          {/* Front of Card (Question) */}
          <div className="absolute inset-0 backface-hidden glass-panel rounded-xl border border-outline-variant/10 shadow-[inset_1px_1px_0px_rgba(255,255,255,0.05)] p-8 flex flex-col justify-between z-20">
            <div className="flex justify-between items-start">
              <div className="flex gap-2 flex-wrap max-w-[70%]">
                {problem.tags?.slice(0, 3).map((tag: string) => (
                  <span key={tag} className="px-2 py-1 bg-surface-container-high border border-outline-variant/30 rounded text-[12px] font-medium tracking-[0.05em] text-primary truncate max-w-[120px]">{tag}</span>
                ))}
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded text-[12px] font-medium tracking-[0.05em] border
                ${problem.difficulty === 'Hard' ? 'text-error bg-error/10 border-error/20' : ''}
                ${problem.difficulty === 'Medium' ? 'text-secondary bg-secondary/10 border-secondary/20' : ''}
                ${problem.difficulty === 'Easy' ? 'text-primary bg-primary/10 border-primary/20' : ''}
              `}>
                <span className="material-symbols-outlined text-[14px]">local_fire_department</span> {problem.difficulty}
              </div>
            </div>
            
            <div className="flex-1 flex flex-col justify-center items-center text-center px-12">
              <h3 className="text-[24px] leading-[32px] font-medium text-on-surface mb-4">{problem.title}</h3>
              <div className="text-[14px] leading-[22px] text-on-surface-variant max-w-lg max-h-[150px] overflow-hidden relative">
                <p className="whitespace-pre-wrap">{problem.description || "No description provided."}</p>
                <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-surface-container-low to-transparent"></div>
              </div>
            </div>
            
            <div className="text-center">
              <span className="inline-flex items-center gap-2 text-primary/70 text-[12px] font-medium tracking-[0.05em] animate-pulse">
                <span className="material-symbols-outlined text-[18px]">touch_app</span>
                Click to Reveal Solution
              </span>
            </div>
          </div>

          {/* Back of Card (Answer) */}
          <div className="absolute inset-0 backface-hidden glass-panel rounded-xl border border-outline-variant/10 shadow-[inset_1px_1px_0px_rgba(255,255,255,0.05)] p-8 flex flex-col rotate-y-180 z-10 bg-surface-container-high/90">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-outline-variant/20">
              <h4 className="text-[24px] leading-[32px] font-medium text-primary">Solution Overview</h4>
              <Link href={`/problem/${problem.slug}`} className="text-on-surface-variant hover:text-primary transition-colors" onClick={(e) => e.stopPropagation()}>
                <span className="material-symbols-outlined">open_in_new</span>
              </Link>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
              {solution ? (
                <>
                  {solution.explanation && (
                    <div className="text-[14px] leading-[22px] text-on-surface-variant whitespace-pre-wrap">
                      {solution.explanation}
                    </div>
                  )}
                  {solution.code && (
                    <div className="bg-surface/80 rounded border border-outline-variant/20 p-4 mt-4">
                      <pre className="font-mono text-[13px] text-tertiary-fixed overflow-x-auto"><code>{solution.code}</code></pre>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full opacity-50 py-10">
                  <span className="material-symbols-outlined text-[48px] mb-4">code_off</span>
                  <p>You haven't added a solution for this problem yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Controls */}
      <div 
        className={`w-full max-w-[800px] mt-8 flex flex-wrap justify-center gap-4 transition-opacity duration-300 ${isFlipped ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <button 
          disabled={isSubmitting}
          onClick={(e) => { e.stopPropagation(); handleFeedback('Again'); }}
          className="px-6 py-3 rounded-lg border border-outline-variant/30 bg-surface-container-low hover:bg-surface-container-high hover:border-error/50 text-error transition-all flex flex-col items-center gap-1 min-w-[120px] disabled:opacity-50"
        >
          <span className="text-[12px] font-medium tracking-[0.05em]">Again</span>
          <span className="text-[10px] font-mono opacity-50">&lt; 1m</span>
        </button>
        <button 
          disabled={isSubmitting}
          onClick={(e) => { e.stopPropagation(); handleFeedback('Hard'); }}
          className="px-6 py-3 rounded-lg border border-outline-variant/30 bg-surface-container-low hover:bg-surface-container-high hover:border-error-container/50 text-error-container transition-all flex flex-col items-center gap-1 min-w-[120px] disabled:opacity-50"
        >
          <span className="text-[12px] font-medium tracking-[0.05em]">Hard</span>
          <span className="text-[10px] font-mono opacity-50">2d</span>
        </button>
        <button 
          disabled={isSubmitting}
          onClick={(e) => { e.stopPropagation(); handleFeedback('Good'); }}
          className="px-6 py-3 rounded-lg border border-outline-variant/30 bg-surface-container-low hover:bg-surface-container-high hover:border-primary/50 text-primary transition-all flex flex-col items-center gap-1 min-w-[120px] shadow-[0_0_15px_rgba(188,195,255,0.1)] disabled:opacity-50"
        >
          <span className="text-[12px] font-medium tracking-[0.05em]">Good</span>
          <span className="text-[10px] font-mono opacity-50">5d</span>
        </button>
        <button 
          disabled={isSubmitting}
          onClick={(e) => { e.stopPropagation(); handleFeedback('Easy'); }}
          className="px-6 py-3 rounded-lg border border-outline-variant/30 bg-surface-container-low hover:bg-surface-container-high hover:border-secondary/50 text-secondary transition-all flex flex-col items-center gap-1 min-w-[120px] disabled:opacity-50"
        >
          <span className="text-[12px] font-medium tracking-[0.05em]">Easy</span>
          <span className="text-[10px] font-mono opacity-50">14d</span>
        </button>
      </div>
    </div>
  );
}
