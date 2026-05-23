'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export default function Navbar({ onToggleSidebar, isSidebarOpen = true }: NavbarProps) {
  const { data: session } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className={`fixed top-0 right-0 transition-all duration-300 ${isSidebarOpen ? 'left-0 md:left-[260px]' : 'left-0'} h-16 z-30 bg-background/80 backdrop-blur-md border-b border-border/40 flex justify-between items-center px-gutter w-full md:w-auto`}>
      <div className="flex items-center gap-3">
        <button 
          onClick={onToggleSidebar} 
          className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-muted flex items-center justify-center group"
        >
          <span className="material-symbols-outlined transition-transform duration-200 group-hover:scale-110">{isSidebarOpen ? 'menu_open' : 'menu'}</span>
        </button>
        <div className="md:hidden font-heading text-[20px] font-bold text-primary tracking-tight">KeepsDSA</div>
      </div>

      <nav className="hidden md:flex gap-6 h-full items-center ml-4">
        <Link className="relative text-muted-foreground hover:text-primary transition-colors cursor-pointer font-subheading text-[12px] uppercase tracking-wider text-[14px] h-full flex items-center font-medium group" href="/explore">
          Problems
          <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-primary group-hover:w-full transition-all duration-300 rounded-full"></span>
        </Link>
        <Link className="relative text-muted-foreground hover:text-primary transition-colors cursor-pointer font-subheading text-[12px] uppercase tracking-wider text-[14px] h-full flex items-center font-medium group" href="/dashboard">
          Dashboard
          <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-primary group-hover:w-full transition-all duration-300 rounded-full"></span>
        </Link>
      </nav>

      <div className="flex items-center gap-4 ml-auto">
        <div className="hidden lg:flex items-center gap-2">
          <button className="text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-110 active:scale-95 p-1 rounded-lg hover:bg-primary/10">
            <span className="material-symbols-outlined">notifications</span>
          </button>
        </div>
        
        {session?.user ? (
          <div className="relative">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-9 h-9 rounded-full bg-muted overflow-hidden border border-border/50 cursor-pointer shadow-[0_0_10px_rgba(29,161,242,0.1)] hover:shadow-[0_0_20px_rgba(29,161,242,0.2)] transition-shadow duration-300"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <img 
                alt="User profile" 
                className="w-full h-full object-cover" 
                src={session.user.image || `https://ui-avatars.com/api/?name=${session.user.name}&background=3196e8&color=fff`}
              />
            </motion.div>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {showDropdown && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowDropdown(false)}
                  ></div>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.92, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: -4 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="absolute right-0 mt-3 w-56 bg-card/95 backdrop-blur-xl border border-border/40 rounded-xl shadow-2xl py-2 z-50"
                  >
                    <div className="px-4 py-3 border-b border-border/40 mb-2">
                      <p className="text-[14px] font-bold text-foreground truncate">{session.user.name}</p>
                      <p className="text-[12px] text-muted-foreground truncate mt-0.5">{session.user.email}</p>
                    </div>
                    
                    <div className="px-2 space-y-1">
                      <Link 
                        href="/settings" 
                        className="flex items-center gap-3 px-3 py-2 text-[13px] font-medium text-muted-foreground hover:bg-muted hover:text-primary rounded-lg transition-all duration-200 group"
                        onClick={() => setShowDropdown(false)}
                      >
                        <span className="material-symbols-outlined text-[18px] transition-transform duration-200 group-hover:rotate-45">settings</span>
                        Settings & Privacy
                      </Link>
                      
                      <button 
                        onClick={() => signOut({ callbackUrl: '/login' })}
                        className="w-full flex items-center gap-3 px-3 py-2 text-[13px] font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-all duration-200 group"
                      >
                        <span className="material-symbols-outlined text-[18px] transition-transform duration-200 group-hover:translate-x-0.5">logout</span>
                        Log out
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-[14px] font-medium text-muted-foreground hover:text-primary transition-colors">Log in</Link>
            <Link href="/register" className="bg-primary/10 text-primary hover:bg-primary/20 px-4 py-1.5 rounded-full text-[14px] font-medium transition-all duration-200 hover:scale-[1.03]">Sign up</Link>
          </div>
        )}
      </div>
    </header>
  );
}
