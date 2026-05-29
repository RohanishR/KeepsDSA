'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const NAV_ITEMS = [
  { href: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { href: '/explore', icon: 'search', label: 'Problems' },
  { href: '/notes', icon: 'edit_note', label: 'Notes' },
  { href: '/files', icon: 'folder_open', label: 'Files' },
  { href: '/extension', icon: 'extension', label: 'Extension' },
  { href: '/revision', icon: 'history_edu', label: 'Revision' },
  { href: '/settings', icon: 'settings', label: 'Settings' },
];

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);

  return (
    <nav className={`fixed left-0 top-0 h-full w-[260px] z-40 bg-background/70 backdrop-blur-xl border-r border-border/40 shadow-[0_0_20px_rgba(29,161,242,0.05)] py-gutter flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="px-gutter mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-[32px] font-bold text-primary tracking-tighter leading-none mt-2">KeepsDSA</h1>
        </div>
        <button onClick={onToggle} className="md:hidden text-muted-foreground hover:text-foreground">
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>
      
      <div className="px-gutter mb-6 relative">
        <button 
          onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
          className="w-full bg-primary text-primary-foreground font-subheading text-[12px] uppercase tracking-wider text-[13px] py-2.5 rounded shadow-[0_0_15px_rgba(29,161,242,0.3)] hover:shadow-[0_0_25px_rgba(29,161,242,0.5)] transition-all duration-300 flex items-center justify-center gap-2 font-bold hover:scale-[1.02] active:scale-[0.98]"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>New Problem</span>
          <motion.span 
            animate={{ rotate: isAddMenuOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="material-symbols-outlined text-[16px] ml-1"
          >expand_more</motion.span>
        </button>

        <AnimatePresence>
          {isAddMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="absolute top-full left-gutter right-gutter mt-2 bg-card border border-border/40 rounded-lg shadow-xl overflow-hidden z-50"
            >
              <button 
                onClick={() => {
                  router.push('/explore?action=add_problem');
                  setIsAddMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-[13px] text-foreground hover:bg-muted transition-colors"
              >
                <span className="material-symbols-outlined text-[16px] text-primary">edit_document</span>
                Add Manually
              </button>
              <button 
                onClick={() => {
                  router.push('/explore?action=import_leetcode');
                  setIsAddMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-[13px] text-foreground hover:bg-muted transition-colors border-t border-border/20"
              >
                <Image src="https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png" alt="LeetCode" width={16} height={16} className="opacity-70" style={{ filter: 'brightness(0) invert(1) sepia(1) saturate(10000%) hue-rotate(15deg) brightness(1.2)' }} />
                Import from LeetCode
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ul className="flex flex-col flex-grow px-3 gap-1">
        {NAV_ITEMS.map((item, index) => {
          const isActive = pathname === item.href;
          return (
            <motion.li 
              key={item.href}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <Link 
                className={`relative flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group ${isActive ? 'bg-primary/10 text-primary font-bold' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`} 
                href={item.href}
              >
                {/* Animated active indicator */}
                {isActive && (
                  <motion.div 
                    layoutId="sidebar-active-pill"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                <span className={`material-symbols-outlined text-[20px] transition-transform duration-200 ${isActive ? '' : 'group-hover:scale-110'}`}>{item.icon}</span>
                <span className="text-[14px]">{item.label}</span>
              </Link>
            </motion.li>
          );
        })}
      </ul>
      
      {/* Collapse button for desktop */}
      <div className="mt-auto px-4 pb-4 hidden md:block">
        <button 
          onClick={onToggle}
          className="flex items-center gap-2 text-[12px] text-muted-foreground hover:text-foreground transition-colors py-2 px-3 rounded hover:bg-muted w-full group"
        >
          <span className="material-symbols-outlined text-[16px] transition-transform duration-200 group-hover:-translate-x-0.5">keyboard_double_arrow_left</span>
          Collapse Sidebar
        </button>
      </div>
    </nav>
  );
}
