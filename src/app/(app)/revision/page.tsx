'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function RevisionPage() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [queue, setQueue] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cardDirection, setCardDirection] = useState(0); // 1 = next, -1 = prev

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
      setCardDirection(1);
      
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
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          >
            <span className="material-symbols-outlined text-primary text-[40px]">progress_activity</span>
          </motion.div>
          <div className="text-primary font-mono text-sm">Loading your spaced repetition queue...</div>
        </motion.div>
      </div>
    );
  }

  if (queue.length === 0 || currentIndex >= queue.length) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center pt-8 pb-16">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="glass-panel rounded-xl p-12 glow-accent flex flex-col items-center justify-center max-w-md text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary-container/5 pointer-events-none"></div>
          <motion.span 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
            className="material-symbols-outlined text-[64px] text-primary mb-6 relative z-10"
          >workspace_premium</motion.span>
          <h2 className="font-heading text-[32px] leading-[40px] font-bold text-foreground tracking-tight mb-4 relative z-10">You&apos;re all caught up!</h2>
          <p className="text-muted-foreground font-sans mb-8 relative z-10">
            You&apos;ve completed all your scheduled revisions for today. Your logic is sharp.
          </p>
          <Link href="/explore" className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.03] active:scale-[0.97] relative z-10">
            Learn Something New
          </Link>
        </motion.div>
      </div>
    );
  }

  const currentItem = queue[currentIndex];
  const { problem, solution } = currentItem;

  const FEEDBACK_BUTTONS = [
    { quality: 'Again', label: 'Again', time: '< 1m', color: 'error', hoverBorder: 'hover:border-destructive/50', textColor: 'text-destructive' },
    { quality: 'Hard', label: 'Hard', time: '2d', color: 'error-container', hoverBorder: 'hover:border-destructive-container/50', textColor: 'text-destructive-container' },
    { quality: 'Good', label: 'Good', time: '5d', color: 'primary', hoverBorder: 'hover:border-primary/50', textColor: 'text-primary', glow: true },
    { quality: 'Easy', label: 'Easy', time: '14d', color: 'secondary', hoverBorder: 'hover:border-secondary/50', textColor: 'text-secondary' },
  ];

  return (
    <div className="flex-1 relative flex flex-col items-center justify-center pt-8 pb-16">
      {/* Header / Context */}
      <motion.div 
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-[800px] mb-8 flex justify-between items-end"
      >
        <div>
          <div className="flex items-center gap-2 text-primary font-subheading text-[12px] uppercase tracking-wider text-[12px] font-medium tracking-[0.05em] mb-2">
            <motion.span 
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="material-symbols-outlined text-[16px]"
            >sync</motion.span>
            <span>SPACED REPETITION SESSION</span>
          </div>
          <h2 className="font-heading text-[32px] leading-[40px] font-bold text-foreground tracking-tight">Daily Revision</h2>
        </div>
        <div className="text-right">
          <div className="text-muted-foreground font-subheading text-[12px] uppercase tracking-wider text-[12px] font-medium tracking-[0.05em] mb-1">Cards Due Today</div>
          <div className="text-2xl font-mono text-primary">
            <motion.span
              key={currentIndex}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {currentIndex + 1}
            </motion.span>
            {' '}
            <span className="text-muted-foreground-variant text-lg">/ {queue.length}</span>
          </div>
        </div>
      </motion.div>

      {/* Flashcard Container */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: cardDirection * 50, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -cardDirection * 50, scale: 0.95 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="w-full max-w-[800px] h-[450px] perspective-1000 relative group cursor-pointer" 
          onClick={() => !isSubmitting && setIsFlipped(!isFlipped)}
        >
          <div className={`w-full h-full relative transform-style-3d transition-transform duration-700 ease-in-out ${isFlipped ? 'rotate-y-180' : ''}`}>
            {/* Front of Card (Question) */}
            <div className="absolute inset-0 backface-hidden glass-panel rounded-xl border border-border/10 shadow-[inset_1px_1px_0px_rgba(255,255,255,0.05),0_20px_60px_-15px_rgba(0,0,0,0.3)] p-8 flex flex-col justify-between z-20">
              <div className="flex justify-between items-start">
                <div className="flex gap-2 flex-wrap max-w-[70%]">
                  {problem.tags?.slice(0, 3).map((tag: string) => (
                    <span key={tag} className="px-2 py-1 bg-muted/80 border border-border/30 rounded text-[12px] font-medium tracking-[0.05em] text-primary truncate max-w-[120px]">{tag}</span>
                  ))}
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded text-[12px] font-medium tracking-[0.05em] border
                  ${problem.difficulty === 'Hard' ? 'text-destructive bg-destructive/10 border-destructive/20' : ''}
                  ${problem.difficulty === 'Medium' ? 'text-secondary bg-secondary/10 border-secondary/20' : ''}
                  ${problem.difficulty === 'Easy' ? 'text-primary bg-primary/10 border-primary/20' : ''}
                `}>
                  <span className="material-symbols-outlined text-[14px]">local_fire_department</span> {problem.difficulty}
                </div>
              </div>
              
              <div className="flex-1 flex flex-col justify-center items-center text-center px-12">
                <h3 className="text-[24px] leading-[32px] font-medium text-foreground mb-4">{problem.title}</h3>
                <div className="text-[14px] leading-[22px] text-muted-foreground max-w-lg max-h-[150px] overflow-hidden relative">
                  <p className="whitespace-pre-wrap">{problem.description || "No description provided."}</p>
                  <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-surface-container-low to-transparent"></div>
                </div>
              </div>
              
              <div className="text-center">
                <motion.span 
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-flex items-center gap-2 text-primary/70 text-[12px] font-medium tracking-[0.05em]"
                >
                  <span className="material-symbols-outlined text-[18px]">touch_app</span>
                  Click to Reveal Solution
                </motion.span>
              </div>
            </div>

            {/* Back of Card (Answer) */}
            <div className="absolute inset-0 backface-hidden glass-panel rounded-xl border border-border/10 shadow-[inset_1px_1px_0px_rgba(255,255,255,0.05),0_20px_60px_-15px_rgba(0,0,0,0.3)] p-8 flex flex-col rotate-y-180 z-10 bg-muted/80/90">
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-border/20">
                <h4 className="text-[24px] leading-[32px] font-medium text-primary">Solution Overview</h4>
                <Link href={`/problem/${problem.slug}`} className="text-muted-foreground hover:text-primary transition-colors hover:scale-110 inline-block" onClick={(e) => e.stopPropagation()}>
                  <span className="material-symbols-outlined">open_in_new</span>
                </Link>
              </div>
              
              <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                {solution ? (
                  <>
                    {solution.explanation && (
                      <div className="text-[14px] leading-[22px] text-muted-foreground whitespace-pre-wrap">
                        {solution.explanation}
                      </div>
                    )}
                    {solution.code && (
                      <div className="bg-background/80 rounded border border-border/20 p-4 mt-4">
                        <pre className="font-mono text-[13px] text-tertiary-fixed overflow-x-auto"><code>{solution.code}</code></pre>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full opacity-50 py-10">
                    <span className="material-symbols-outlined text-[48px] mb-4">code_off</span>
                    <p>You haven&apos;t added a solution for this problem yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Feedback Controls — animated entrance */}
      <motion.div 
        animate={{ 
          opacity: isFlipped ? 1 : 0,
          y: isFlipped ? 0 : 12,
          pointerEvents: isFlipped ? 'auto' as const : 'none' as const
        }}
        transition={{ duration: 0.3, delay: isFlipped ? 0.2 : 0 }}
        className="w-full max-w-[800px] mt-8 flex flex-wrap justify-center gap-4"
      >
        {FEEDBACK_BUTTONS.map((btn, i) => (
          <motion.button 
            key={btn.quality}
            initial={{ opacity: 0, y: 8 }}
            animate={isFlipped ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{ delay: isFlipped ? 0.25 + i * 0.06 : 0 }}
            disabled={isSubmitting}
            onClick={(e) => { e.stopPropagation(); handleFeedback(btn.quality); }}
            className={`px-6 py-3 rounded-lg border border-border/30 bg-card/50 hover:bg-muted/80 ${btn.hoverBorder} ${btn.textColor} transition-all flex flex-col items-center gap-1 min-w-[120px] disabled:opacity-50 hover:scale-[1.03] active:scale-[0.97] ${btn.glow ? 'shadow-[0_0_15px_rgba(188,195,255,0.1)]' : ''}`}
          >
            <span className="text-[12px] font-medium tracking-[0.05em]">{btn.label}</span>
            <span className="text-[10px] font-mono opacity-50">{btn.time}</span>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
