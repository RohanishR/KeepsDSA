'use client';

import React from 'react';

interface SidebarFiltersProps {
  availableTags: string[];
  filters: {
    search: string;
    difficulty: string[];
    tags: string[];
    status: string;
    isBookmarked: boolean;
    sort: string;
  };
  setters: {
    setSearch: (val: string) => void;
    setDifficulty: (val: string[] | ((prev: string[]) => string[])) => void;
    setTags: (val: string[] | ((prev: string[]) => string[])) => void;
    setStatus: (val: string) => void;
    setIsBookmarked: (val: boolean | ((prev: boolean) => boolean)) => void;
    setSort: (val: string) => void;
  };
}

export default function SidebarFilters({ availableTags, filters, setters }: SidebarFiltersProps) {
  const toggleArrayItem = (setter: any, item: string) => {
    setter((prev: string[]) => 
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Search */}
      <div>
        <label className="block text-[11px] uppercase tracking-wider font-bold text-on-surface-variant mb-2">Search</label>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-outline">search</span>
          <input 
            type="text"
            placeholder="Search problems..."
            value={filters.search}
            onChange={(e) => setters.setSearch(e.target.value)}
            className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg pl-10 pr-4 py-2 text-[13px] text-on-surface focus:outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>

      {/* Bookmarks Toggle */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className={`w-8 h-4 rounded-full transition-colors relative ${filters.isBookmarked ? 'bg-primary' : 'bg-surface-container-highest border border-outline-variant/30'}`}>
            <div className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white transition-transform ${filters.isBookmarked ? 'translate-x-4' : 'translate-x-0'}`}></div>
          </div>
          <span className="text-[13px] font-medium text-on-surface group-hover:text-primary transition-colors flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-error">favorite</span>
            Favorites Only
          </span>
          <input 
            type="checkbox"
            className="hidden"
            checked={filters.isBookmarked}
            onChange={() => setters.setIsBookmarked(prev => !prev)}
          />
        </label>
      </div>

      <div className="w-full h-px bg-outline-variant/10"></div>

      {/* Status */}
      <div>
        <label className="block text-[11px] uppercase tracking-wider font-bold text-on-surface-variant mb-3">Status</label>
        <div className="flex flex-col gap-2">
          {['', 'Solved', 'Unsolved'].map(statusOption => (
            <label key={statusOption || 'Any'} className="flex items-center gap-2 cursor-pointer group">
              <input 
                type="radio" 
                name="status"
                value={statusOption}
                checked={filters.status === statusOption}
                onChange={() => setters.setStatus(statusOption)}
                className="w-3.5 h-3.5 accent-primary bg-surface-container-low border-outline-variant/30"
              />
              <span className={`text-[13px] ${filters.status === statusOption ? 'text-primary font-medium' : 'text-on-surface-variant group-hover:text-on-surface'}`}>
                {statusOption || 'Any Status'}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="w-full h-px bg-outline-variant/10"></div>

      {/* Difficulty */}
      <div>
        <label className="block text-[11px] uppercase tracking-wider font-bold text-on-surface-variant mb-3">Difficulty</label>
        <div className="flex flex-col gap-2">
          {['Easy', 'Medium', 'Hard'].map(diff => (
            <label key={diff} className="flex items-center gap-2 cursor-pointer group">
              <input 
                type="checkbox"
                checked={filters.difficulty.includes(diff)}
                onChange={() => toggleArrayItem(setters.setDifficulty, diff)}
                className="w-3.5 h-3.5 rounded-[3px] accent-primary bg-surface-container-low border-outline-variant/30"
              />
              <span className={`text-[13px] ${filters.difficulty.includes(diff) ? 'text-primary font-medium' : 'text-on-surface-variant group-hover:text-on-surface'}`}>
                {diff}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="w-full h-px bg-outline-variant/10"></div>

      {/* Topics */}
      <div>
        <label className="block text-[11px] uppercase tracking-wider font-bold text-on-surface-variant mb-3">Topics</label>
        <div className="flex flex-col gap-2 max-h-[250px] overflow-y-auto custom-scrollbar pr-2">
          {availableTags.length === 0 && <span className="text-[12px] text-on-surface-variant">No topics yet</span>}
          {availableTags.map(tag => (
            <label key={tag} className="flex items-center gap-2 cursor-pointer group">
              <input 
                type="checkbox"
                checked={filters.tags.includes(tag)}
                onChange={() => toggleArrayItem(setters.setTags, tag)}
                className="w-3.5 h-3.5 rounded-[3px] accent-primary bg-surface-container-low border-outline-variant/30"
              />
              <span className={`text-[13px] truncate ${filters.tags.includes(tag) ? 'text-primary font-medium' : 'text-on-surface-variant group-hover:text-on-surface'}`}>
                {tag}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
