import React from 'react';
import Link from 'next/link';

export default function ExplorerPage() {
  return (
    <>
      {/* Subtle Ambient Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-secondary-container/5 blur-[100px] rounded-full"></div>
      </div>
      
      <div className="relative z-10 flex flex-col">
        {/* Page Header & Search */}
        <div className="mb-stack-gap-lg">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <h2 className="font-display-lg text-headline-lg-mobile md:text-[32px] md:leading-[40px] font-bold text-on-surface tracking-tight mb-2">Problems Explorer</h2>
              <p className="font-body-md text-[16px] leading-[24px] text-on-surface-variant">Master algorithmic patterns and data structures.</p>
            </div>
          </div>
          {/* Deep Focus Search Bar */}
          <div className="relative group w-full max-w-3xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-outline group-focus-within:text-primary transition-colors">search</span>
            </div>
            <input className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl py-4 pl-12 pr-16 text-[16px] leading-[24px] text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all duration-300 shadow-sm glass-panel" placeholder="Search problems, topics, or companies..." type="text" />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <kbd className="hidden md:inline-flex items-center gap-1 px-2 py-1 bg-surface-container-highest border border-outline-variant/20 rounded font-mono text-[12px] text-on-surface-variant">
                <span className="text-[10px]">⌘</span>K
              </kbd>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="flex flex-wrap gap-4 mb-stack-gap-lg p-4 glass-panel rounded-xl border-t border-l border-outline-variant/10 items-center">
          <div className="flex items-center gap-2 border-r border-outline-variant/20 pr-4">
            <span className="material-symbols-outlined text-outline text-[18px]">filter_list</span>
            <span className="font-label-sm text-[12px] font-medium tracking-[0.05em] text-on-surface-variant uppercase">Filters</span>
          </div>
          
          <div className="relative">
            <select className="appearance-none bg-surface-container-high border border-outline-variant/20 rounded-lg py-2 pl-3 pr-8 font-label-sm text-[12px] font-medium tracking-[0.05em] text-on-surface focus:outline-none focus:border-primary/50 cursor-pointer hover:bg-surface-container-highest transition-colors">
              <option value="">Difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-outline text-[16px] pointer-events-none">expand_more</span>
          </div>
          <div className="relative">
            <select className="appearance-none bg-surface-container-high border border-outline-variant/20 rounded-lg py-2 pl-3 pr-8 font-label-sm text-[12px] font-medium tracking-[0.05em] text-on-surface focus:outline-none focus:border-primary/50 cursor-pointer hover:bg-surface-container-highest transition-colors">
              <option value="">Status</option>
              <option value="todo">To Do</option>
              <option value="solved">Solved</option>
              <option value="revise">To Revise</option>
            </select>
            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-outline text-[16px] pointer-events-none">expand_more</span>
          </div>

          <div className="flex flex-wrap gap-2 ml-auto">
            <button className="px-3 py-1.5 rounded-full border border-outline-variant/30 font-label-sm text-[12px] font-medium tracking-[0.05em] text-on-surface-variant hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all">Array</button>
            <button className="px-3 py-1.5 rounded-full border border-primary/50 bg-primary/10 font-label-sm text-[12px] font-medium tracking-[0.05em] text-primary transition-all">Dynamic Programming</button>
            <button className="px-3 py-1.5 rounded-full border border-outline-variant/30 font-label-sm text-[12px] font-medium tracking-[0.05em] text-on-surface-variant hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all">Graphs</button>
          </div>
        </div>

        {/* List Controls & Actions */}
        <div className="flex justify-between items-center mb-4">
          <div className="font-label-sm text-[12px] font-medium tracking-[0.05em] text-on-surface-variant">
            Showing <span className="text-on-surface font-bold">42</span> matching problems
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="font-label-sm text-[12px] font-medium tracking-[0.05em] text-outline">Sort by:</span>
              <div className="relative">
                <select className="appearance-none bg-transparent border-none py-1 pr-6 font-label-sm text-[12px] font-medium tracking-[0.05em] text-primary cursor-pointer hover:text-primary-fixed transition-colors focus:ring-0 p-0">
                  <option className="bg-surface-container-high" value="recommended">Recommended</option>
                  <option className="bg-surface-container-high" value="newest">Newest</option>
                  <option className="bg-surface-container-high" value="hardest">Hardest</option>
                </select>
                <span className="material-symbols-outlined absolute right-0 top-1/2 -translate-y-1/2 text-primary text-[16px] pointer-events-none">arrow_drop_down</span>
              </div>
            </div>
            <div className="flex border border-outline-variant/20 rounded-lg overflow-hidden bg-surface-container-low">
              <button aria-label="List View" className="p-1.5 bg-surface-container-highest text-primary">
                <span className="material-symbols-outlined text-[18px]">view_list</span>
              </button>
              <button aria-label="Grid View" className="p-1.5 text-outline hover:text-on-surface transition-colors">
                <span className="material-symbols-outlined text-[18px]">grid_view</span>
              </button>
            </div>
          </div>
        </div>

        {/* Problems List Area */}
        <div className="flex flex-col gap-3">
          {/* Card 1 (Solved) */}
          <Link href="/problem/1" className="glass-panel border-t border-l border-outline-variant/10 rounded-xl p-4 flex flex-col md:flex-row md:items-center gap-4 hover:-translate-y-[2px] hover:shadow-[inset_0_0_20px_rgba(188,195,255,0.05)] cursor-pointer group transition-all duration-200">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-surface-container-high border border-outline-variant/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px] text-primary">check_circle</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-[14px] text-outline">#001</span>
                <h3 className="text-[18px] leading-[28px] font-semibold text-on-surface truncate group-hover:text-primary transition-colors">Two Sum</h3>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-label-sm uppercase tracking-wider bg-surface-container-highest text-on-surface-variant border border-outline-variant/20">Array</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-label-sm uppercase tracking-wider bg-surface-container-highest text-on-surface-variant border border-outline-variant/20">Hash Table</span>
              </div>
            </div>
            <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 md:gap-1 mt-2 md:mt-0 md:pl-4 md:border-l md:border-outline-variant/10 md:min-w-[150px]">
              <div className="flex items-center gap-1">
                <span className="px-2 py-0.5 rounded font-label-sm text-[11px] font-medium bg-[#132b1a] text-[#4ade80] border border-[#4ade80]/20">Easy</span>
              </div>
              <div className="flex items-center gap-3 font-label-sm text-[12px] font-medium tracking-[0.05em] text-outline">
                <span className="flex items-center gap-1" title="Acceptance Rate">
                  <span className="material-symbols-outlined text-[14px]">checklist</span> 51.2%
                </span>
                <span className="flex items-center gap-1" title="Solutions">
                  <span className="material-symbols-outlined text-[14px]">forum</span> 12k
                </span>
              </div>
            </div>
          </Link>

          {/* Card 2 (To Do - Medium) */}
          <Link href="/problem/15" className="glass-panel border-t border-l border-outline-variant/10 rounded-xl p-4 flex flex-col md:flex-row md:items-center gap-4 hover:-translate-y-[2px] hover:shadow-[inset_0_0_20px_rgba(188,195,255,0.05)] cursor-pointer group transition-all duration-200">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-surface-container-high border border-outline-variant/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px] text-outline">radio_button_unchecked</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-[14px] text-outline">#015</span>
                <h3 className="text-[18px] leading-[28px] font-semibold text-on-surface truncate group-hover:text-primary transition-colors">3Sum</h3>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-label-sm uppercase tracking-wider bg-surface-container-highest text-on-surface-variant border border-outline-variant/20">Array</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-label-sm uppercase tracking-wider bg-surface-container-highest text-on-surface-variant border border-outline-variant/20">Two Pointers</span>
              </div>
            </div>
            <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 md:gap-1 mt-2 md:mt-0 md:pl-4 md:border-l md:border-outline-variant/10 md:min-w-[150px]">
              <div className="flex items-center gap-1">
                <span className="px-2 py-0.5 rounded font-label-sm text-[11px] font-medium bg-[#362410] text-[#fbbf24] border border-[#fbbf24]/20">Medium</span>
              </div>
              <div className="flex items-center gap-3 font-label-sm text-[12px] font-medium tracking-[0.05em] text-outline">
                <span className="flex items-center gap-1" title="Acceptance Rate">
                  <span className="material-symbols-outlined text-[14px]">checklist</span> 34.5%
                </span>
                <span className="flex items-center gap-1" title="Solutions">
                  <span className="material-symbols-outlined text-[14px]">forum</span> 8.4k
                </span>
              </div>
            </div>
          </Link>

          {/* Card 3 (To Revise - Hard) */}
          <Link href="/problem/42" className="glass-panel border-t border-l border-outline-variant/10 border-l-error rounded-xl p-4 flex flex-col md:flex-row md:items-center gap-4 hover:-translate-y-[2px] hover:shadow-[inset_0_0_20px_rgba(188,195,255,0.05)] cursor-pointer group transition-all duration-200">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-error/10 border border-error/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px] text-error">history</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-[14px] text-outline">#042</span>
                <h3 className="text-[18px] leading-[28px] font-semibold text-on-surface truncate group-hover:text-primary transition-colors">Trapping Rain Water</h3>
                <span className="ml-2 px-1.5 py-0.5 rounded bg-error/10 text-error text-[10px] font-label-sm uppercase border border-error/20">Revise</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-label-sm uppercase tracking-wider bg-surface-container-highest text-on-surface-variant border border-outline-variant/20">Array</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-label-sm uppercase tracking-wider bg-surface-container-highest text-on-surface-variant border border-outline-variant/20">Two Pointers</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-label-sm uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">Dynamic Programming</span>
              </div>
            </div>
            <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 md:gap-1 mt-2 md:mt-0 md:pl-4 md:border-l md:border-outline-variant/10 md:min-w-[150px]">
              <div className="flex items-center gap-1">
                <span className="px-2 py-0.5 rounded font-label-sm text-[11px] font-medium bg-[#381414] text-[#f87171] border border-[#f87171]/20">Hard</span>
              </div>
              <div className="flex items-center gap-3 font-label-sm text-[12px] font-medium tracking-[0.05em] text-outline">
                <span className="flex items-center gap-1" title="Acceptance Rate">
                  <span className="material-symbols-outlined text-[14px]">checklist</span> 61.2%
                </span>
                <span className="flex items-center gap-1" title="Solutions">
                  <span className="material-symbols-outlined text-[14px]">forum</span> 4.1k
                </span>
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-8 flex justify-center pb-8">
          <button className="px-6 py-2 rounded-lg border border-outline-variant/30 font-label-sm text-[12px] font-medium tracking-[0.05em] text-on-surface-variant hover:text-primary hover:border-primary/50 hover:bg-surface-container-high transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">autorenew</span>
            Load More Problems
          </button>
        </div>
      </div>
    </>
  );
}
