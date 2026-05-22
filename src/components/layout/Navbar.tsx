'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';

export default function Navbar() {
  const { data: session } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="fixed top-0 right-0 left-0 md:left-[260px] h-16 z-30 bg-surface/80 backdrop-blur-md border-b border-outline-variant/10 flex justify-between items-center px-gutter w-full md:w-auto">
      <div className="md:hidden font-headline-md text-headline-md font-bold text-primary">KeepsDSA</div>
      <nav className="hidden md:flex gap-6 h-full items-center">
        <Link className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer font-label-sm text-label-sm h-full flex items-center" href="/explore">Problems</Link>
        <Link className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer font-label-sm text-label-sm h-full flex items-center" href="/dashboard">Dashboard</Link>
      </nav>
      <div className="flex items-center gap-4 ml-auto">
        <div className="hidden lg:flex items-center gap-2">
          <button className="text-on-surface-variant hover:text-primary transition-colors"><span className="material-symbols-outlined">notifications</span></button>
        </div>
        
        {session?.user ? (
          <div className="relative">
            <div 
              className="w-8 h-8 rounded-full bg-surface-variant overflow-hidden border border-outline-variant/50 ml-2 cursor-pointer transition-transform hover:scale-105"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <img 
                alt="User profile" 
                className="w-full h-full object-cover" 
                src={session.user.image || `https://ui-avatars.com/api/?name=${session.user.name}&background=3196e8&color=fff`}
              />
            </div>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-surface-container-high border border-outline-variant/20 rounded-lg shadow-xl py-2 z-50">
                <div className="px-4 py-2 border-b border-outline-variant/10 mb-1">
                  <p className="text-[14px] font-semibold text-on-surface truncate">{session.user.name}</p>
                  <p className="text-[12px] text-on-surface-variant truncate">{session.user.email}</p>
                </div>
                <Link 
                  href="/profile" 
                  className="block px-4 py-2 text-[14px] text-on-surface-variant hover:bg-surface-container-highest hover:text-primary transition-colors"
                  onClick={() => setShowDropdown(false)}
                >
                  Profile
                </Link>
                <button 
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="w-full text-left px-4 py-2 text-[14px] text-error hover:bg-error/10 transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-[14px] font-medium text-on-surface-variant hover:text-primary transition-colors">Log in</Link>
            <Link href="/register" className="bg-primary/10 text-primary hover:bg-primary/20 px-4 py-1.5 rounded-full text-[14px] font-medium transition-colors">Sign up</Link>
          </div>
        )}
      </div>
    </header>
  );
}
