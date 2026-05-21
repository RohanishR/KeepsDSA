import React from 'react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <>
      {/* Ambient Glow Background */}
      <div className="fixed inset-0 z-[-2] bg-[#070708]"></div>
      <div className="fixed inset-0 z-[-1] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgNDBoNDBWMHgtNDB6IiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjYSkiLz48L3N2Zz4=')] opacity-20 pointer-events-none"></div>
      
      {/* Hero Section */}
      <section className="relative max-w-[1280px] mx-auto px-4 md:px-12 pt-16 md:pt-32 pb-24 flex flex-col items-center text-center">
        <div className="absolute w-[600px] h-[600px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(58,82,237,0.15)_0%,rgba(7,7,8,0)_70%)] z-[-1] pointer-events-none"></div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary-container/30 bg-primary-container/10 mb-8">
          <span className="material-symbols-outlined text-primary text-[16px]">new_releases</span>
          <span className="font-label-sm text-[12px] font-medium tracking-[0.05em] text-primary">v1.0.0 is now live</span>
        </div>
        <h1 className="font-display-lg text-[48px] md:text-[64px] leading-[56px] md:leading-[72px] font-bold tracking-tighter mb-6 max-w-4xl text-on-surface">
          Your Personal <br className="hidden md:block" />
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">DSA Knowledge Base</span>
        </h1>
        <p className="font-body-lg text-[18px] leading-[28px] text-on-surface-variant max-w-2xl mb-10">
          Master patterns, track revisions, and build your technical second brain. Stop solving the same problems from scratch and start building a reusable library of algorithmic insights.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-20 w-full sm:w-auto">
          <Link href="/register" className="bg-gradient-to-r from-primary-container to-secondary-container text-white font-label-sm text-[12px] font-medium tracking-[0.05em] px-8 py-4 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity w-full sm:w-auto">
            <span className="material-symbols-outlined" data-icon="cloud_download" data-weight="fill">cloud_download</span>
            Get Started
          </Link>
          <Link href="/explore" className="glass-panel text-on-surface font-label-sm text-[12px] font-medium tracking-[0.05em] px-8 py-4 rounded-lg flex items-center justify-center gap-2 hover:bg-surface-container-high transition-all duration-200 w-full sm:w-auto">
            <span className="material-symbols-outlined" data-icon="play_circle">play_circle</span>
            View Demo
          </Link>
        </div>
        
        {/* Hero Graphic (Code Editor Preview) */}
        <div className="w-full max-w-5xl rounded-xl glass-panel overflow-hidden shadow-[0_0_40px_rgba(58,82,237,0.1)] border border-outline-variant/20 relative text-left">
          {/* Mac Window Controls */}
          <div className="h-10 bg-surface-container-high/50 border-b border-outline-variant/20 flex items-center px-4 gap-2 backdrop-blur-md">
            <div className="w-3 h-3 rounded-full bg-error/80"></div>
            <div className="w-3 h-3 rounded-full bg-secondary-container/80"></div>
            <div className="w-3 h-3 rounded-full bg-primary/80"></div>
            <div className="mx-auto font-label-sm text-[12px] font-medium tracking-[0.05em] text-on-surface-variant/50">two_sum.py — KeepsDSA</div>
          </div>
          <div className="flex h-[400px]">
            {/* Sidebar Mock */}
            <div className="hidden md:block w-[200px] border-r border-outline-variant/10 bg-surface-container-low/30 p-4">
              <div className="font-label-sm text-[10px] font-medium tracking-[0.05em] text-on-surface-variant mb-4 uppercase">Explorer</div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-primary bg-primary-container/10 px-2 py-1 rounded font-label-sm text-[12px] font-medium">
                  <span className="material-symbols-outlined text-[16px]">folder</span>
                  Arrays &amp; Hashing
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant pl-6 font-label-sm text-[12px] font-medium">
                  <span className="material-symbols-outlined text-[16px]">description</span>
                  two_sum.py
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant pl-6 font-label-sm text-[12px] font-medium">
                  <span className="material-symbols-outlined text-[16px]">description</span>
                  valid_anagram.py
                </div>
              </div>
            </div>
            {/* Editor Mock */}
            <div className="flex-1 bg-[#070708]/80 p-6 font-mono text-[14px] leading-[22px] text-on-surface overflow-hidden relative">
              <div className="pl-5 relative text-tertiary-container"><span className="absolute left-0">1</span># Pattern: Hash Map (Two Pass or One Pass)</div>
              <div className="pl-5 relative text-tertiary-container"><span className="absolute left-0">2</span># Time Complexity: O(N)</div>
              <div className="pl-5 relative text-tertiary-container"><span className="absolute left-0">3</span># Space Complexity: O(N)</div>
              <div className="pl-5 relative"><span className="absolute left-0">4</span><br /></div>
              <div className="pl-5 relative"><span className="absolute left-0">5</span><span className="text-secondary">class</span> <span className="text-primary">Solution</span>:</div>
              <div className="pl-5 relative"><span className="absolute left-0">6</span>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-secondary">def</span> <span className="text-secondary-fixed">twoSum</span>(self, nums: List[<span className="text-secondary">int</span>], target: <span className="text-secondary">int</span>) -&gt; List[<span className="text-secondary">int</span>]:</div>
              <div className="pl-5 relative bg-primary/5 border-l-2 border-primary -ml-0.5"><span className="absolute left-0 text-on-surface-variant/50">7</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;prevMap = {} <span className="text-tertiary-container"># val -&gt; index</span></div>
              <div className="pl-5 relative"><span className="absolute left-0 text-on-surface-variant/50">8</span><br /></div>
              <div className="pl-5 relative"><span className="absolute left-0 text-on-surface-variant/50">9</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-secondary">for</span> i, n <span className="text-secondary">in</span> enumerate(nums):</div>
              <div className="pl-5 relative"><span className="absolute left-0 text-on-surface-variant/50">10</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;diff = target - n</div>
              
              {/* Floating Insights Panel Mock */}
              <div className="absolute bottom-6 right-6 w-64 glass-panel rounded-lg p-4 border-l-2 border-primary-container shadow-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-primary text-[18px]">lightbulb</span>
                  <span className="font-label-sm text-[12px] font-bold text-primary">Mastery Insight</span>
                </div>
                <p className="font-body-md text-[13px] leading-relaxed text-on-surface-variant">
                  You've solved this using Brute Force last week. The Hash Map approach improves time from O(N²) to O(N).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-[1280px] mx-auto px-4 md:px-12 py-24 border-t border-outline-variant/10" id="features">
        <div className="text-center mb-16">
          <h2 className="font-headline-lg-mobile md:text-[32px] md:leading-[40px] font-bold text-on-surface mb-4">Engineered for Technical Mastery</h2>
          <p className="font-body-md text-[16px] leading-[24px] text-on-surface-variant max-w-2xl mx-auto">Everything you need to stop grinding mindlessly and start learning systematically.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-panel p-6 rounded-xl hover:shadow-[inset_0_0_10px_rgba(58,82,237,0.15)] transition-all duration-300">
            <div className="w-12 h-12 rounded-lg bg-primary-container/10 flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-primary text-[24px]">account_tree</span>
            </div>
            <h3 className="font-headline-md text-[20px] font-semibold text-on-surface mb-3">Multi-solution Tracking</h3>
            <p className="font-body-md text-[14px] text-on-surface-variant">
              Don't just store one answer. Track brute-force, optimal, and alternative approaches side-by-side to understand trade-offs.
            </p>
          </div>
          <div className="glass-panel p-6 rounded-xl hover:shadow-[inset_0_0_10px_rgba(58,82,237,0.15)] transition-all duration-300">
            <div className="w-12 h-12 rounded-lg bg-secondary-container/10 flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-secondary text-[24px]">draw</span>
            </div>
            <h3 className="font-headline-md text-[20px] font-semibold text-on-surface mb-3">Handwritten Notes</h3>
            <p className="font-body-md text-[14px] text-on-surface-variant">
              Snap a photo of your whiteboard scribbles or iPad notes. We attach them directly to the problem context.
            </p>
          </div>
          <div className="glass-panel p-6 rounded-xl hover:shadow-[inset_0_0_10px_rgba(58,82,237,0.15)] transition-all duration-300">
            <div className="w-12 h-12 rounded-lg bg-tertiary/10 flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-tertiary text-[24px]">psychology</span>
            </div>
            <h3 className="font-headline-md text-[20px] font-semibold text-on-surface mb-3">AI Explanations</h3>
            <p className="font-body-md text-[14px] text-on-surface-variant">
              Stuck on a specific line of code? Highlight it and get an instant, context-aware explanation tailored to your skill level.
            </p>
          </div>
          <div className="glass-panel p-6 rounded-xl hover:shadow-[inset_0_0_10px_rgba(58,82,237,0.15)] transition-all duration-300">
            <div className="w-12 h-12 rounded-lg bg-error/10 flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-error text-[24px]">autorenew</span>
            </div>
            <h3 className="font-headline-md text-[20px] font-semibold text-on-surface mb-3">Spaced Repetition</h3>
            <p className="font-body-md text-[14px] text-on-surface-variant">
              Our algorithm schedules revisions based on your mastery level, ensuring concepts move from short-term to long-term memory.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
