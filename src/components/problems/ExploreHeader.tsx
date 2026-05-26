'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import AddProblemModal from './AddProblemModal';
import ImportLeetCodeModal from './ImportLeetCodeModal';

export default function ExploreHeader() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'add_problem') {
      setIsAddModalOpen(true);
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    } else if (action === 'import_leetcode') {
      setIsImportModalOpen(true);
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, [searchParams]);

  return (
    <div className="mb-stack-gap-lg">
      <motion.div 
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6"
      >
        <div>
          <h2 className="font-heading text-headline-lg-mobile md:text-[32px] md:leading-[40px] font-bold text-foreground tracking-tight mb-2">Problems Explorer</h2>
          <p className="font-sans text-[16px] leading-[24px] text-muted-foreground">Master algorithmic patterns and data structures.</p>
        </div>
        <div className="flex items-center gap-3">
          <motion.button 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsImportModalOpen(true)}
            className="bg-muted/80 text-muted-foreground hover:text-foreground hover:bg-background-bright px-4 py-2 rounded-lg font-medium shadow-sm border border-border/30 transition-colors flex items-center gap-2"
          >
            <Image src="https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png" alt="LeetCode" width={16} height={16} className="opacity-70" style={{ filter: 'brightness(0) invert(1) sepia(1) saturate(10000%) hue-rotate(15deg) brightness(1.2)' }} />
            Import
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsAddModalOpen(true)}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Add Problem
          </motion.button>
        </div>
      </motion.div>
      
      {/* Deep Focus Search Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
        className="relative group w-full max-w-3xl focus-glow rounded-xl"
      >
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <span className="material-symbols-outlined text-muted-foreground group-focus-within:text-primary transition-colors duration-200">search</span>
        </div>
        <input 
          className="w-full bg-card/50 border border-border/30 rounded-xl py-4 pl-12 pr-16 text-[16px] leading-[24px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all duration-300 shadow-sm glass-panel" 
          placeholder="Search problems, topics, or companies..." 
          type="text" 
        />
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
          <kbd className="hidden md:inline-flex items-center gap-1 px-2 py-1 bg-accent border border-border/20 rounded font-mono text-[12px] text-muted-foreground">
            <span className="text-[10px]">⌘</span>K
          </kbd>
        </div>
      </motion.div>

      <AddProblemModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      <ImportLeetCodeModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} />
    </div>
  );
}
