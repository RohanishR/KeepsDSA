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
        <label className="block text-[11px] uppercase tracking-wider font-bold text-muted-foreground mb-2">Search</label>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-muted-foreground">search</span>
          <input 
            type="text"
            placeholder="Search problems..."
            value={filters.search}
            onChange={(e) => setters.setSearch(e.target.value)}
            className="w-full bg-card/50 border border-border/30 rounded-lg pl-10 pr-4 py-2 text-[13px] text-foreground focus:outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>

      {/* Bookmarks Toggle */}
      <div>
        <label className="ui-bookmark group">
          <input 
            type="checkbox"
            checked={filters.isBookmarked}
            onChange={() => setters.setIsBookmarked(prev => !prev)}
          />
          <div className="bookmark">
            <svg viewBox="0 0 32 32">
              <g>
                <path d="M27 4v27a1 1 0 0 1-1.625.781L16 24.281l-9.375 7.5A1 1 0 0 1 5 31V4a4 4 0 0 1 4-4h14a4 4 0 0 1 4 4z" />
              </g>
            </svg>
          </div>
          <span className="text-[13px] font-medium text-foreground group-hover:text-primary transition-colors">
            Bookmarks Only
          </span>
        </label>
      </div>

      <div className="w-full h-px bg-outline-variant/10"></div>

      {/* Status */}
      <div>
        <label className="block text-[11px] uppercase tracking-wider font-bold text-muted-foreground mb-3">Status</label>
        <div className="radio-container">
          {['', 'Solved', 'Unsolved'].map(statusOption => (
            <label key={statusOption || 'Any'} className="group">
              <input 
                type="radio" 
                name="status"
                value={statusOption}
                checked={filters.status === statusOption}
                onChange={() => setters.setStatus(statusOption)}
              />
              <span className={`text-[13px] ${filters.status === statusOption ? 'text-primary font-medium' : 'text-muted-foreground group-hover:text-foreground'}`}>
                {statusOption || 'Any Status'}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="w-full h-px bg-outline-variant/10"></div>

      {/* Difficulty */}
      <div>
        <label className="block text-[11px] uppercase tracking-wider font-bold text-muted-foreground mb-3">Difficulty</label>
        <div className="flex flex-col gap-3">
          {['Easy', 'Medium', 'Hard'].map(diff => (
            <label key={diff} className="flex items-center cursor-pointer group">
              <div className="flip-cbx-container">
                <input 
                  type="checkbox"
                  id={`cbx-diff-${diff}`}
                  className="flip-cbx-input"
                  checked={filters.difficulty.includes(diff)}
                  onChange={() => toggleArrayItem(setters.setDifficulty, diff)}
                />
                <div className="flip-cbx">
                  <div className="flip-cbx-inner">
                    <div className="flip-cbx-front" />
                    <div className="flip-cbx-back">
                      <svg viewBox="0 0 16 14" height={14} width={16}>
                        <path d="M2 8.5L6 12.5L14 1.5" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <span className={`text-[13px] ${filters.difficulty.includes(diff) ? 'text-primary font-medium' : 'text-muted-foreground group-hover:text-foreground'}`}>
                {diff}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="w-full h-px bg-outline-variant/10"></div>

      {/* Topics */}
      <div>
        <label className="block text-[11px] uppercase tracking-wider font-bold text-muted-foreground mb-3">Topics</label>
        <div className="flex flex-col gap-2 max-h-[250px] overflow-y-auto custom-scrollbar pr-2">
          {availableTags.length === 0 && <span className="text-[12px] text-muted-foreground">No topics yet</span>}
          {availableTags.map(tag => (
            <label key={tag} className="flex items-center gap-2 cursor-pointer group">
              <input 
                type="checkbox"
                checked={filters.tags.includes(tag)}
                onChange={() => toggleArrayItem(setters.setTags, tag)}
                className="w-3.5 h-3.5 rounded-[3px] accent-primary bg-card/50 border-border/30"
              />
              <span className={`text-[13px] truncate ${filters.tags.includes(tag) ? 'text-primary font-medium' : 'text-muted-foreground group-hover:text-foreground'}`}>
                {tag}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
