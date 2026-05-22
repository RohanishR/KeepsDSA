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
            <div className="relative w-4/5 max-w-sm bg-surface border-r border-outline-variant/20 shadow-2xl h-full overflow-y-auto p-4 slide-in-from-left">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-[18px] font-bold text-on-surface">Filters</h2>
                <button onClick={() => setIsMobileFiltersOpen(false)} className="text-on-surface-variant">
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 bg-surface-container-low border border-outline-variant/20 rounded-xl p-3">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <button 
                className="lg:hidden flex items-center gap-2 text-[14px] font-medium text-on-surface-variant bg-surface-container-highest px-3 py-1.5 rounded-lg border border-outline-variant/30"
                onClick={() => setIsMobileFiltersOpen(true)}
              >
                <span className="material-symbols-outlined text-[18px]">filter_list</span>
                Filters
              </button>
              <div className="font-label-sm text-[12px] font-medium tracking-[0.05em] text-on-surface-variant">
                <span className="text-on-surface font-bold">{totalCount}</span> problems
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <select 
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-surface-container-highest border border-outline-variant/30 rounded-lg px-3 py-1.5 text-[13px] text-on-surface focus:outline-none focus:border-primary"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="difficulty-asc">Difficulty (Easy → Hard)</option>
                <option value="difficulty-desc">Difficulty (Hard → Easy)</option>
                <option value="title-asc">Title (A-Z)</option>
              </select>

              <div className="flex border border-outline-variant/20 rounded-lg overflow-hidden bg-surface-container-highest">
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 flex items-center justify-center transition-colors ${viewMode === 'list' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
                  title="List View"
                >
                  <span className="material-symbols-outlined text-[18px]">view_list</span>
                </button>
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 flex items-center justify-center transition-colors ${viewMode === 'grid' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
                  title="Grid View"
                >
                  <span className="material-symbols-outlined text-[18px]">grid_view</span>
                </button>
              </div>
            </div>
          </div>

          {/* Problem List/Grid */}
          {problems.length > 0 ? (
            <motion.div 
              layout
              className={viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" 
                : "flex flex-col gap-3"}
            >
              <AnimatePresence mode='popLayout'>
                {problems.map((problem) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    key={problem._id}
                  >
                    <Link href={`/problem/${problem.slug}`} className={`glass-panel border-t border-l border-outline-variant/10 rounded-xl p-4 flex hover:-translate-y-[2px] hover:shadow-[inset_0_0_20px_rgba(188,195,255,0.05)] cursor-pointer group transition-all duration-200 relative ${viewMode === 'list' ? 'flex-col md:flex-row md:items-center gap-4' : 'flex-col gap-4 h-full'}`}>
                      
                      {/* Top/Left Section: Icon and Title */}
                      <div className={`flex ${viewMode === 'list' ? 'items-center gap-4 min-w-0 flex-1' : 'flex-col gap-3'}`}>
                        <div className="flex justify-between items-start w-full">
                          <div className="flex items-center gap-3 min-w-0">
                            {viewMode === 'grid' && (
                              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant/20 flex items-center justify-center">
                                <span className="material-symbols-outlined text-[16px] text-primary">code</span>
                              </div>
                            )}
                            <h3 className="text-[16px] md:text-[18px] leading-tight font-semibold text-on-surface truncate group-hover:text-primary transition-colors">{problem.title}</h3>
                            {problem.source === 'LeetCode' && (
                              <span className="flex-shrink-0 flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-[#ffa116]/10 text-[#ffa116] border border-[#ffa116]/20 text-[10px] font-bold tracking-wider">
                                LC
                              </span>
                            )}
                          </div>
                          {viewMode === 'grid' && (
                            <button 
                              onClick={(e) => toggleBookmark(e, problem._id)}
                              className={`p-1 rounded-full transition-colors ${problem.isBookmarked ? 'text-error hover:bg-error/10' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest'}`}
                            >
                              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: problem.isBookmarked ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
                            </button>
                          )}
                        </div>

                        {/* Badges/Tags Area */}
                        <div className={`flex flex-wrap items-center gap-2 ${viewMode === 'list' ? 'mt-1' : ''}`}>
                          <span className={`px-2 py-0.5 rounded font-label-sm text-[10px] font-medium border uppercase tracking-wider
                            ${problem.difficulty === 'Easy' ? 'bg-[#132b1a] text-[#4ade80] border-[#4ade80]/20' : ''}
                            ${problem.difficulty === 'Medium' ? 'bg-[#3b2d13] text-[#facc15] border-[#facc15]/20' : ''}
                            ${problem.difficulty === 'Hard' ? 'bg-[#3b1313] text-[#f87171] border-[#f87171]/20' : ''}
                          `}>
                            {problem.difficulty}
                          </span>
                          
                          {problem.tags?.slice(0, viewMode === 'list' ? 4 : 2).map((tag: string) => (
                            <span key={tag} className="px-1.5 py-0.5 rounded text-[9px] font-label-sm uppercase tracking-wider bg-surface-container-highest text-on-surface-variant border border-outline-variant/20 truncate max-w-[100px]">
                              {tag}
                            </span>
                          ))}
                          {problem.tags?.length > (viewMode === 'list' ? 4 : 2) && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-label-sm text-on-surface-variant">+{problem.tags.length - (viewMode === 'list' ? 4 : 2)}</span>
                          )}
                        </div>
                      </div>

                      {/* Right/Bottom Section: Stats & Actions */}
                      <div className={`flex items-center justify-between ${viewMode === 'list' ? 'md:border-l md:border-outline-variant/10 md:pl-4 md:min-w-[180px]' : 'pt-3 border-t border-outline-variant/10 mt-auto'}`}>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1 text-on-surface-variant" title="Saved Solutions">
                            <span className="material-symbols-outlined text-[14px]">integration_instructions</span>
                            <span className="text-[12px] font-medium">{problem.solutionCount || 0}</span>
                          </div>
                          {problem.nextRevisionDate && new Date(problem.nextRevisionDate) <= new Date() && (
                            <div className="flex items-center gap-1 text-error bg-error/10 px-1.5 py-0.5 rounded border border-error/20" title="Revision Due">
                              <span className="material-symbols-outlined text-[12px]">history</span>
                              <span className="text-[10px] font-bold uppercase tracking-wider">Due</span>
                            </div>
                          )}
                        </div>

                        {viewMode === 'list' && (
                          <button 
                            onClick={(e) => toggleBookmark(e, problem._id)}
                            className={`p-1.5 rounded-full transition-colors ${problem.isBookmarked ? 'text-error hover:bg-error/10' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest'}`}
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
            <div className="text-center py-16 glass-panel rounded-xl border border-outline-variant/10">
              <span className="material-symbols-outlined text-[48px] text-outline mb-4">search_off</span>
              <h3 className="text-[18px] font-medium text-on-surface mb-2">No problems found</h3>
              <p className="text-[14px] text-on-surface-variant max-w-sm mx-auto">
                Try tweaking your filters or adding a new problem to your database.
              </p>
            </div>
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
