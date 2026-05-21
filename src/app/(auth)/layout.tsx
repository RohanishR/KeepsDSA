import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-surface-container-low via-background to-background">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-secondary/10 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="w-full max-w-md z-10">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="font-headline-lg text-[32px] font-bold text-primary tracking-tighter">KeepsDSA</h1>
          <p className="text-on-surface-variant font-label-sm tracking-[0.05em] mt-2">ALGORITHMIC MASTERY</p>
        </div>
        
        {/* Auth Container */}
        <div className="glass-panel border border-outline-variant/20 rounded-xl p-8 shadow-[inset_1px_1px_0px_rgba(255,255,255,0.05),0_0_40px_rgba(188,195,255,0.05)]">
          {children}
        </div>
      </div>
    </div>
  );
}
