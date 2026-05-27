'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { PATTERN_DESCRIPTIONS } from '@/lib/patterns';

export default function RevisionPage() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [queue, setQueue] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cardDirection, setCardDirection] = useState(0); // 1 = next, -1 = prev
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [showPatternInfo, setShowPatternInfo] = useState(false);

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

  // Group queue by topic
  const groupedTopics = useMemo(() => {
    const groups: Record<string, any[]> = {};
    queue.forEach(item => {
      const tags = item.problem.tags && item.problem.tags.length > 0 ? item.problem.tags : ['Uncategorized'];
      tags.forEach((tag: string) => {
        if (!groups[tag]) groups[tag] = [];
        groups[tag].push(item);
      });
    });
    return groups;
  }, [queue]);

  // Handle returning to topic selection if queue for topic runs out
  useEffect(() => {
    if (selectedTopic && (!groupedTopics[selectedTopic] || groupedTopics[selectedTopic].length === 0)) {
      setSelectedTopic(null);
      setCurrentIndex(0);
      setIsFlipped(false);
      setShowPatternInfo(false);
    }
  }, [groupedTopics, selectedTopic]);

  const activeQueue = selectedTopic ? groupedTopics[selectedTopic] || [] : [];

  const handleNext = (e?: React.MouseEvent | TouchEvent | PointerEvent | MouseEvent) => {
    e?.stopPropagation();
    if (currentIndex < activeQueue.length - 1) {
      setIsFlipped(false);
      setCardDirection(1);
      setTimeout(() => setCurrentIndex(prev => prev + 1), 300);
    }
  };

  const handlePrev = (e?: React.MouseEvent | TouchEvent | PointerEvent | MouseEvent) => {
    e?.stopPropagation();
    if (currentIndex > 0) {
      setIsFlipped(false);
      setCardDirection(-1);
      setTimeout(() => setCurrentIndex(prev => prev - 1), 300);
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

  if (queue.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center pt-8 pb-16">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="glass-panel rounded-xl p-12 glow-accent flex flex-col items-center justify-center max-w-md text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none"></div>
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

  // --- STATE 1: Topic Selection ---
  if (!selectedTopic) {
    return (
      <div className="flex-1 p-8 md:p-12 overflow-y-auto custom-scrollbar">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <h1 className="text-4xl font-bold font-heading text-foreground tracking-tight mb-3">Topic Revision</h1>
            <p className="text-muted-foreground text-lg">Select a pattern or topic to focus your session.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(groupedTopics).sort((a, b) => b[1].length - a[1].length).map(([tag, items]) => (
              <motion.div
                key={tag}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { setSelectedTopic(tag); setCurrentIndex(0); setIsFlipped(false); }}
                className="cursor-pointer glass-panel rounded-2xl p-6 border border-border/20 hover:border-primary/50 transition-all duration-300 relative overflow-hidden group shadow-lg shadow-black/5 hover:shadow-primary/10"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">{tag}</h3>
                    <span className="bg-primary/15 text-primary px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                      {items.length} {items.length === 1 ? 'card' : 'cards'}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3 mt-auto">
                    {PATTERN_DESCRIPTIONS[tag]?.description || 'Solve these problems to strengthen your understanding of this topic.'}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- STATE 2: Topic Revision (Flashcards) ---
  const currentItem = activeQueue[currentIndex];
  if (!currentItem) return null; // Defensive check during transition
  
  const { problem, solution } = currentItem;
  const patternInfo = PATTERN_DESCRIPTIONS[selectedTopic];

  return (
    <div className="flex-1 relative flex flex-col items-center justify-start pt-8 pb-16 px-4 overflow-y-auto custom-scrollbar overflow-x-hidden">
      
      {/* Pattern / Topic Header */}
      <div className="w-full max-w-[800px] mb-6">
        <button 
          onClick={() => setSelectedTopic(null)}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm font-medium mb-6 group w-fit"
        >
          <span className="material-symbols-outlined text-[18px] transition-transform group-hover:-translate-x-1">arrow_back</span>
          Back to Topics
        </button>

        <div className="glass-panel p-6 rounded-2xl border border-border/20 shadow-lg relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-2xl font-bold text-primary flex items-center gap-3">
              <span className="material-symbols-outlined">category</span>
              {selectedTopic}
            </h2>
            <div className="text-right shrink-0">
              <div className="text-muted-foreground text-[11px] uppercase tracking-wider font-bold mb-1">Queue</div>
              <div className="text-xl font-mono text-foreground font-bold">
                {currentIndex + 1} <span className="text-muted-foreground text-sm font-normal">/ {activeQueue.length}</span>
              </div>
            </div>
          </div>
          
          {patternInfo ? (
            <div>
              <p className="text-foreground/80 text-sm leading-relaxed mb-3">{patternInfo.description}</p>
              
              <AnimatePresence>
                {showPatternInfo && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-3 pb-2 border-t border-border/10 mt-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">How to Identify</h4>
                      <ul className="space-y-1.5 list-disc pl-4">
                        {patternInfo.howToIdentify.map((tip, idx) => (
                          <li key={idx} className="text-[13px] text-muted-foreground">{tip}</li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <button 
                onClick={() => setShowPatternInfo(!showPatternInfo)}
                className="text-xs font-semibold text-primary/80 hover:text-primary transition-colors flex items-center gap-1 mt-1"
              >
                {showPatternInfo ? 'Hide details' : 'Show pattern tips'}
                <span className={`material-symbols-outlined text-[14px] transition-transform ${showPatternInfo ? 'rotate-180' : ''}`}>expand_more</span>
              </button>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">Reviewing problems tagged with {selectedTopic}.</p>
          )}
        </div>
      </div>

      {/* Flashcard Container */}
      <AnimatePresence mode="wait">
        <motion.div
          key={problem._id}
          initial={{ opacity: 0, x: cardDirection * 50, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -cardDirection * 50, scale: 0.95 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(e, { offset }) => {
            const swipe = offset.x;
            if (swipe < -50) {
              handleNext();
            } else if (swipe > 50) {
              handlePrev();
            }
          }}
          className="w-full max-w-[800px] h-[450px] perspective-1000 relative group cursor-pointer" 
          onClick={() => !isSubmitting && setIsFlipped(!isFlipped)}
        >
          <div className={`w-full h-full relative transform-style-3d transition-transform duration-700 ease-in-out ${isFlipped ? 'rotate-y-180' : ''}`}>
            {/* Front of Card (Question) */}
            <div className="absolute inset-0 backface-hidden glass-panel rounded-xl border border-border/10 shadow-[inset_1px_1px_0px_rgba(255,255,255,0.05),0_20px_60px_-15px_rgba(0,0,0,0.3)] p-8 flex flex-col justify-between z-20 bg-background/50 backdrop-blur-md">
              <div className="flex justify-between items-start">
                <div className="flex gap-2 flex-wrap max-w-[70%]">
                  {problem.tags?.filter((t: string) => t !== selectedTopic).slice(0, 2).map((tag: string) => (
                    <span key={tag} className="px-2 py-1 bg-muted border border-border/30 rounded text-[11px] font-medium tracking-[0.05em] text-muted-foreground truncate max-w-[120px]">{tag}</span>
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
              
              <div className="flex-1 flex flex-col justify-center items-center text-center px-6 md:px-12">
                <h3 className="text-[24px] md:text-[28px] leading-[36px] font-semibold text-foreground mb-4">{problem.title}</h3>
                <div className="text-[14px] leading-[24px] text-muted-foreground max-w-lg max-h-[150px] overflow-hidden relative">
                  <div 
                    className="prose prose-sm dark:prose-invert max-w-none prose-p:my-1" 
                    dangerouslySetInnerHTML={{ __html: problem.description || "No description provided." }} 
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background to-transparent pointer-events-none"></div>
                </div>
              </div>
              
              <div className="text-center">
                <motion.span 
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  className="inline-flex items-center gap-2 text-primary/80 text-[13px] font-semibold tracking-[0.05em]"
                >
                  <span className="material-symbols-outlined text-[18px]">touch_app</span>
                  Click to Reveal Solution
                </motion.span>
              </div>
            </div>

            {/* Back of Card (Answer) */}
            <div className="absolute inset-0 backface-hidden glass-panel rounded-xl border border-border/10 shadow-[inset_1px_1px_0px_rgba(255,255,255,0.05),0_20px_60px_-15px_rgba(0,0,0,0.3)] p-8 flex flex-col rotate-y-180 z-10 bg-muted/90 backdrop-blur-xl">
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-border/20 shrink-0">
                <h4 className="text-[22px] font-semibold text-primary">Solution Overview</h4>
                <Link href={`/problem/${problem.slug}`} className="text-muted-foreground hover:text-primary transition-colors hover:scale-110 inline-block p-1 bg-background/50 rounded-md border border-border/50" onClick={(e) => e.stopPropagation()}>
                  <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                </Link>
              </div>
              
              <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                {solution ? (
                  <>
                    {solution.explanation && (
                      <div className="text-[14px] leading-[24px] text-foreground/90 whitespace-pre-wrap font-sans">
                        {solution.explanation}
                      </div>
                    )}
                    {solution.code && (
                      <div className="bg-[#0d1117] rounded-lg border border-white/10 p-4 mt-4 shadow-inner">
                        <pre className="font-mono text-[13px] text-gray-300 overflow-x-auto"><code>{solution.code}</code></pre>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full opacity-60 py-10">
                    <span className="material-symbols-outlined text-[48px] mb-4">code_off</span>
                    <p className="text-sm">You haven&apos;t added a solution for this problem yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      <div className="w-full max-w-[800px] mt-8 flex justify-center gap-6 shrink-0">
        <button 
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-border/30 bg-card/60 backdrop-blur hover:bg-muted/90 transition-all disabled:opacity-30 disabled:pointer-events-none hover:-translate-y-1 active:translate-y-0 text-foreground font-semibold"
        >
          <span className="material-symbols-outlined text-[20px]">chevron_left</span>
          Previous
        </button>
        <button 
          onClick={handleNext}
          disabled={currentIndex === activeQueue.length - 1}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-border/30 bg-primary/20 backdrop-blur hover:bg-primary/30 text-primary transition-all disabled:opacity-30 disabled:pointer-events-none hover:-translate-y-1 active:translate-y-0 font-semibold"
        >
          Next
          <span className="material-symbols-outlined text-[20px]">chevron_right</span>
        </button>
      </div>
    </div>
  );
}
