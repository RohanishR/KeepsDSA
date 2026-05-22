'use client';

import React, { useState } from 'react';
import AddProblemModal from './AddProblemModal';
import ImportLeetCodeModal from './ImportLeetCodeModal';

export default function ExploreHeader() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  return (
    <div className="mb-stack-gap-lg">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display-lg text-headline-lg-mobile md:text-[32px] md:leading-[40px] font-bold text-on-surface tracking-tight mb-2">Problems Explorer</h2>
          <p className="font-body-md text-[16px] leading-[24px] text-on-surface-variant">Master algorithmic patterns and data structures.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsImportModalOpen(true)}
            className="bg-surface-container-high text-on-surface-variant hover:text-on-surface hover:bg-surface-bright px-4 py-2 rounded-lg font-medium shadow-sm border border-outline-variant/30 transition-all flex items-center gap-2"
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png" alt="LeetCode" className="w-4 h-4 opacity-70" style={{ filter: 'brightness(0) invert(1) sepia(1) saturate(10000%) hue-rotate(15deg) brightness(1.2)' }} />
            Import
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-primary text-on-primary px-4 py-2 rounded-lg font-medium shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Add Problem
          </button>
        </div>
      </div>
      
      {/* Deep Focus Search Bar */}
      <div className="relative group w-full max-w-3xl">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <span className="material-symbols-outlined text-outline group-focus-within:text-primary transition-colors">search</span>
        </div>
        <input 
          className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl py-4 pl-12 pr-16 text-[16px] leading-[24px] text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all duration-300 shadow-sm glass-panel" 
          placeholder="Search problems, topics, or companies..." 
          type="text" 
        />
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
          <kbd className="hidden md:inline-flex items-center gap-1 px-2 py-1 bg-surface-container-highest border border-outline-variant/20 rounded font-mono text-[12px] text-on-surface-variant">
            <span className="text-[10px]">⌘</span>K
          </kbd>
        </div>
      </div>

      <AddProblemModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      <ImportLeetCodeModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} />
    </div>
  );
}
