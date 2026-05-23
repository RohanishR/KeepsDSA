import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center p-4 relative overflow-x-hidden overflow-y-auto bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-surface-container-low via-background to-background">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-secondary/10 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="w-full max-w-md z-10">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="font-heading text-[32px] font-bold text-primary tracking-tighter">KeepsDSA</h1>
          <p className="text-muted-foreground font-subheading text-[12px] uppercase tracking-wider tracking-[0.05em] mt-2">ALGORITHMIC MASTERY</p>
        </div>
        
        {/* Auth Container */}
        <div className="animated-border-box">
          <div className="animated-border-box-inner p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
