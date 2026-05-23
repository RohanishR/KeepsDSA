'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';
import SidebarFilters from './SidebarFilters';
import ExploreHeader from '@/components/problems/ExploreHeader';

interface ExploreClientProps {
  availableTags: string[];
}

export default function ExploreClient({ availableTags }: ExploreClientProps) {
  const [problems, setProblems] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  
  // Filters State
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [status, setStatus] = useState<string>(''); // 'Solved' | 'Unsolved' | ''
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [sort, setSort] = useState('newest');
  
  // Layout State
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '400px',
  });

  const fetchProblems = useCallback(async (pageNum: number, reset: boolean = false) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: '20',
        sort
      });

      if (search) params.append('search', search);
      if (difficulty.length) params.append('difficulty', difficulty.join(','));
      if (tags.length) params.append('tags', tags.join(','));
      if (status) params.append('status', status);
      if (isBookmarked) params.append('isBookmarked', 'true');

      const res = await fetch(`/api/explore?${params.toString()}`);
      const data = await res.json();

      if (data.problems) {
        setProblems(prev => reset ? data.problems : [...prev, ...data.problems]);
        setHasMore(data.pagination.hasNextPage);
        setTotalCount(data.pagination.total);
      }
    } catch (error) {
      console.error('Failed to fetch problems', error);
    } finally {
      setLoading(false);
    }
  }, [search, difficulty, tags, status, isBookmarked, sort]);

  // Initial load and filter changes
  useEffect(() => {
    setPage(1);
    fetchProblems(1, true);
  }, [fetchProblems]);

  // Infinite Scroll trigger
  useEffect(() => {
    if (inView && hasMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchProblems(nextPage, false);
    }
  }, [inView, hasMore, loading, page, fetchProblems]);

  const toggleBookmark = async (e: React.MouseEvent, problemId: string) => {
    e.preventDefault();
    e.stopPropagation();

    // Optimistic UI update
    setProblems(prev => prev.map(p => 
      p._id === problemId ? { ...p, isBookmarked: !p.isBookmarked } : p
    ));

    // Trigger pop animation on the heart
    const heartEl = (e.currentTarget as HTMLElement);
    heartEl.classList.add('animate-pop');
    setTimeout(() => heartEl.classList.remove('animate-pop'), 300);

    try {
      await fetch(`/api/problems/${problemId}/bookmark`, { method: 'POST' });
    } catch (err) {
      // Revert on failure
      setProblems(prev => prev.map(p => 
        p._id === problemId ? { ...p, isBookmarked: !p.isBookmarked } : p
      ));
    }
  };

  return (
    <div className="flex flex-col h-full flex-1">
      <ExploreHeader />
      
      <div className="flex flex-1 gap-6 relative pb-20">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24">
            <SidebarFilters 
              availableTags={availableTags}
              filters={{ search, difficulty, tags, status, isBookmarked, sort }}
              setters={{ setSearch, setDifficulty, setTags, setStatus, setIsBookmarked, setSort }}
            />
          </div>
        </div>

        {/* Mobile Filters Toggle */}
        {isMobileFiltersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsMobileFiltersOpen(false)} />
            <div className="relative w-4/5 max-w-sm bg-background border-r border-border/20 shadow-2xl h-full overflow-y-auto p-4 slide-in-from-left">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-[18px] font-bold text-foreground">Filters</h2>
                <button onClick={() => setIsMobileFiltersOpen(false)} className="text-muted-foreground">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <SidebarFilters 
                availableTags={availableTags}
                filters={{ search, difficulty, tags, status, isBookmarked, sort }}
                setters={{ setSearch, setDifficulty, setTags, setStatus, setIsBookmarked, setSort }}
              />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Controls Bar */}
          <motion.div 
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 bg-card/50 border border-border/20 rounded-xl p-3"
          >
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <button 
                className="lg:hidden flex items-center gap-2 text-[14px] font-medium text-muted-foreground bg-accent px-3 py-1.5 rounded-lg border border-border/30"
                onClick={() => setIsMobileFiltersOpen(true)}
              >
                <span className="material-symbols-outlined text-[18px]">filter_list</span>
                Filters
              </button>
              <div className="font-subheading text-[12px] uppercase tracking-wider text-[12px] font-medium tracking-[0.05em] text-muted-foreground">
                <span className="text-foreground font-bold">{totalCount}</span> problems
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <select 
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-accent border border-border/30 rounded-lg px-3 py-1.5 text-[13px] text-foreground focus:outline-none focus:border-primary"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="difficulty-asc">Difficulty (Easy → Hard)</option>
                <option value="difficulty-desc">Difficulty (Hard → Easy)</option>
                <option value="title-asc">Title (A-Z)</option>
              </select>

              <div className="flex border border-border/20 rounded-lg overflow-hidden bg-accent">
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 flex items-center justify-center transition-colors ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                  title="List View"
                >
                  <span className="material-symbols-outlined text-[18px]">view_list</span>
                </button>
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 flex items-center justify-center transition-colors ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                  title="Grid View"
                >
                  <span className="material-symbols-outlined text-[18px]">grid_view</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Problem List/Grid */}
          {problems.length > 0 ? (
            <motion.div 
              layout
              className={viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" 
                : "flex flex-col gap-3"}
            >
              <AnimatePresence mode='popLayout'>
                {problems.map((problem, idx) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: idx * 0.03 }}
                    key={problem._id}
                  >
                    <Link href={`/problem/${problem.slug}`} className={`glass-panel border-t border-l border-border/10 rounded-xl p-4 flex card-hover cursor-pointer group transition-all duration-200 relative ${viewMode === 'list' ? 'flex-col md:flex-row md:items-center gap-4' : 'flex-col gap-4 h-full'}`}>
                      
                      {/* Top/Left Section: Icon and Title */}
                      <div className={`flex ${viewMode === 'list' ? 'items-center gap-4 min-w-0 flex-1' : 'flex-col gap-3'}`}>
                        <div className="flex justify-between items-start w-full">
                          <div className="flex items-center gap-3 min-w-0">
                            {viewMode === 'grid' && (
                              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted/80 border border-border/20 flex items-center justify-center">
                                <span className="material-symbols-outlined text-[16px] text-primary">code</span>
                              </div>
                            )}
                            <h3 className="text-[16px] md:text-[18px] leading-tight font-semibold text-foreground truncate group-hover:text-primary transition-colors">{problem.title}</h3>
                            {problem.source === 'LeetCode' && (
                              <span className="flex-shrink-0 flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-[#ffa116]/10 text-[#ffa116] border border-[#ffa116]/20 text-[10px] font-bold tracking-wider">
                                LC
                              </span>
                            )}
                          </div>
                          {viewMode === 'grid' && (
                            <button 
                              onClick={(e) => toggleBookmark(e, problem._id)}
                              className={`p-1 rounded-full transition-colors ${problem.isBookmarked ? 'text-destructive hover:bg-destructive/10' : 'text-muted-foreground hover:text-foreground hover:bg-accent'}`}
                            >
                              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: problem.isBookmarked ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
                            </button>
                          )}
                        </div>

                        {/* Badges/Tags Area */}
                        <div className={`flex flex-wrap items-center gap-2 ${viewMode === 'list' ? 'mt-1' : ''}`}>
                          <span className={`px-2 py-0.5 rounded font-subheading text-[12px] uppercase tracking-wider text-[10px] font-medium border uppercase tracking-wider
                            ${problem.difficulty === 'Easy' ? 'bg-[#132b1a] text-[#4ade80] border-[#4ade80]/20' : ''}
                            ${problem.difficulty === 'Medium' ? 'bg-[#3b2d13] text-[#facc15] border-[#facc15]/20' : ''}
                            ${problem.difficulty === 'Hard' ? 'bg-[#3b1313] text-[#f87171] border-[#f87171]/20' : ''}
                          `}>
                            {problem.difficulty}
                          </span>
                          
                          {problem.tags?.slice(0, viewMode === 'list' ? 4 : 2).map((tag: string) => (
                            <span key={tag} className="px-1.5 py-0.5 rounded text-[9px] font-subheading text-[12px] uppercase tracking-wider uppercase tracking-wider bg-accent text-muted-foreground border border-border/20 truncate max-w-[100px]">
                              {tag}
                            </span>
                          ))}
                          {problem.tags?.length > (viewMode === 'list' ? 4 : 2) && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-subheading text-[12px] uppercase tracking-wider text-muted-foreground">+{problem.tags.length - (viewMode === 'list' ? 4 : 2)}</span>
                          )}
                        </div>
                      </div>

                      {/* Right/Bottom Section: Stats & Actions */}
                      <div className={`flex items-center justify-between ${viewMode === 'list' ? 'md:border-l md:border-border/10 md:pl-4 md:min-w-[180px]' : 'pt-3 border-t border-border/10 mt-auto'}`}>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1 text-muted-foreground" title="Saved Solutions">
                            <span className="material-symbols-outlined text-[14px]">integration_instructions</span>
                            <span className="text-[12px] font-medium">{problem.solutionCount || 0}</span>
                          </div>
                          {problem.nextRevisionDate && new Date(problem.nextRevisionDate) <= new Date() && (
                            <div className="flex items-center gap-1 text-destructive bg-destructive/10 px-1.5 py-0.5 rounded border border-destructive/20" title="Revision Due">
                              <span className="material-symbols-outlined text-[12px]">history</span>
                              <span className="text-[10px] font-bold uppercase tracking-wider">Due</span>
                            </div>
                          )}
                        </div>

                        {viewMode === 'list' && (
                          <button 
                            onClick={(e) => toggleBookmark(e, problem._id)}
                            className={`p-1.5 rounded-full transition-colors ${problem.isBookmarked ? 'text-destructive hover:bg-destructive/10' : 'text-muted-foreground hover:text-foreground hover:bg-accent'}`}
                          >
                            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: problem.isBookmarked ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
                          </button>
                        )}
                      </div>
                      
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : !loading ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
              className="text-center py-16 glass-panel rounded-xl border border-border/10"
            >
              <span className="material-symbols-outlined text-[48px] text-muted-foreground mb-4 animate-bounce-subtle">search_off</span>
              <h3 className="text-[18px] font-medium text-foreground mb-2">No problems found</h3>
              <p className="text-[14px] text-muted-foreground max-w-sm mx-auto">
                Try tweaking your filters or adding a new problem to your database.
              </p>
            </motion.div>
          ) : null}

          {/* Loading Indicator / Intersection Observer Target */}
          <div ref={ref} className="py-8 flex justify-center">
            {loading && (
              <div className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
                <span className="text-[14px] font-medium">Loading...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
