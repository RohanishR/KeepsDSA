import React from 'react';

export default function Dashboard() {
  return (
    <>
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-1">Welcome back, Engineer.</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">Your logic is sharp today. Let's build.</p>
        </div>
        <div className="hidden md:block">
          <span className="font-label-sm text-label-sm text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">Status: Optimal</span>
        </div>
      </div>
      
      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-stack-gap-md lg:gap-gutter">
        {/* Stats Row */}
        <div className="glass-panel rounded-xl p-6 glow-accent flex flex-col justify-between min-h-[140px]">
          <div className="flex justify-between items-start text-on-surface-variant">
            <span className="font-label-sm text-label-sm">Total Solved</span>
            <span className="material-symbols-outlined text-[20px]">task_alt</span>
          </div>
          <div className="mt-4">
            <span className="font-display-lg text-[48px] font-bold tracking-tighter text-on-surface leading-none">452</span>
            <span className="font-label-sm text-label-sm text-secondary ml-2">+12 this week</span>
          </div>
        </div>
        
        <div className="glass-panel rounded-xl p-6 glow-accent flex flex-col justify-between min-h-[140px]">
          <div className="flex justify-between items-start text-on-surface-variant">
            <span className="font-label-sm text-label-sm">Revisions Due</span>
            <span className="material-symbols-outlined text-[20px] text-error">warning</span>
          </div>
          <div className="mt-4">
            <span className="font-display-lg text-[48px] font-bold tracking-tighter text-on-surface leading-none">12</span>
            <span className="font-label-sm text-label-sm text-error ml-2">Needs attention</span>
          </div>
        </div>
        
        <div className="glass-panel rounded-xl p-6 glow-accent flex flex-col justify-between min-h-[140px]">
          <div className="flex justify-between items-start text-on-surface-variant">
            <span className="font-label-sm text-label-sm">Current Streak</span>
            <span className="material-symbols-outlined text-[20px] text-secondary">local_fire_department</span>
          </div>
          <div className="mt-4">
            <span className="font-display-lg text-[48px] font-bold tracking-tighter text-on-surface leading-none">15</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant ml-2">Days</span>
          </div>
        </div>
        
        {/* Upcoming Reminder Card */}
        <div className="glass-panel rounded-xl p-6 glow-accent flex flex-col justify-between min-h-[140px] border-l-4 border-l-primary">
          <div>
            <span className="font-label-sm text-label-sm text-primary mb-2 block">Upcoming Revision</span>
            <h3 className="font-headline-md text-headline-md text-on-surface leading-tight">LRU Cache</h3>
            <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">Hard • Linked List, Hash Map</p>
          </div>
          <button className="mt-4 w-full bg-surface-container-high hover:bg-surface-bright text-on-surface font-label-sm text-label-sm py-2 rounded transition-colors border border-outline-variant/30">Revise Now</button>
        </div>
      </div>
    </>
  );
}
