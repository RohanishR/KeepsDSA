'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';

export default function AppLayoutClient({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Auto-collapse on small screens on load
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, []);

  if (!isMounted) {
    // Initial server render (prevents hydration mismatch for sidebar width)
    return (
      <div className="flex flex-col md:flex-row min-h-screen w-full bg-background">
        <Sidebar isOpen={true} onToggle={() => {}} />
        <div className="flex-1 flex flex-col md:ml-[260px] min-h-[100dvh] relative">
          <Navbar onToggleSidebar={() => {}} isSidebarOpen={true} />
          <main className="flex-1 p-2 sm:p-4 md:p-8 mt-16 max-w-7xl mx-auto w-full">
            {children}
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-[100dvh] w-full bg-background overflow-x-hidden">
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div 
        className={`flex-1 flex flex-col min-h-[100dvh] relative transition-all duration-300 ${
          isSidebarOpen ? 'md:ml-[260px]' : 'ml-0'
        }`}
      >
        <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} />
        <main className="flex-1 p-2 sm:p-4 md:p-8 mt-16 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
