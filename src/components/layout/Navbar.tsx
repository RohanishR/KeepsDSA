'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

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
        <Link className="relative text-muted-foreground hover:text-primary transition-colors cursor-pointer font-subheading uppercase tracking-wider text-[14px] h-full flex items-center font-medium group" href="/explore">
          Problems
          <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-primary group-hover:w-full transition-all duration-300 rounded-full"></span>
        </Link>
        <Link className="relative text-muted-foreground hover:text-primary transition-colors cursor-pointer font-subheading uppercase tracking-wider text-[14px] h-full flex items-center font-medium group" href="/dashboard">
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
              <Image 
                alt="User profile" 
                className="w-full h-full object-cover" 
                src={session.user.image || `https://ui-avatars.com/api/?name=${session.user.name}&background=3196e8&color=fff`}
                width={36}
                height={36}
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
                    
                    <div className="px-2 pb-2">
                      <div className="flex justify-center items-center gap-4 pt-1">
                        <Link 
                          href="/settings" 
                          className="settings-btn"
                          onClick={() => setShowDropdown(false)}
                          title="Settings"
                        >
                          <div className="sign">
                            <span className="material-symbols-outlined">settings</span>
                          </div>
                          <div className="text">Settings</div>
                        </Link>
                        
                        <button 
                          onClick={() => signOut({ callbackUrl: '/' })}
                          className="logout-btn"
                          title="Log out"
                        >
                          <div className="sign">
                            <svg viewBox="0 0 512 512">
                              <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" />
                            </svg>
                          </div>
                          <div className="text">Logout</div>
                        </button>
                      </div>
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
