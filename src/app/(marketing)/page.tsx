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
        
        {/* Animated Badge */}
        <div className="animate-fade-in-down inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary-container/30 bg-primary/20/10 mb-8 animate-glow-pulse">
          <span className="material-symbols-outlined text-primary text-[16px]">new_releases</span>
          <span className="font-subheading text-[12px] uppercase tracking-wider text-[12px] font-medium tracking-[0.05em] text-primary">v1.0.0 is now live</span>
        </div>
        
        {/* Animated Heading */}
        <h1 className="animate-fade-in-up font-heading text-[48px] md:text-[64px] leading-[56px] md:leading-[72px] font-bold tracking-tighter mb-6 max-w-4xl text-foreground">
          Your Personal <br className="hidden md:block" />
          <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent bg-[length:200%_200%] animate-gradient-shift">DSA Knowledge Base</span>
        </h1>
        
        {/* Animated Subtitle */}
        <p className="animate-fade-in-up delay-150 font-sans text-[18px] leading-[28px] text-muted-foreground max-w-2xl mb-10">
          Master patterns, track revisions, and build your technical second brain. Stop solving the same problems from scratch and start building a reusable library of algorithmic insights.
        </p>
        
        {/* Animated CTA Buttons */}
        <div className="animate-fade-in-up delay-300 flex flex-col sm:flex-row gap-4 mb-20 w-full sm:w-auto">
          <Link href="/register" className="group bg-gradient-to-r from-primary-container to-secondary-container text-white font-subheading text-[12px] uppercase tracking-wider text-[12px] font-medium tracking-[0.05em] px-8 py-4 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-all duration-300 w-full sm:w-auto shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.02]">
            <span className="material-symbols-outlined transition-transform duration-300 group-hover:translate-x-0.5">cloud_download</span>
            Get Started
          </Link>
          <Link href="/explore" className="group glass-panel text-foreground font-subheading text-[12px] uppercase tracking-wider text-[12px] font-medium tracking-[0.05em] px-8 py-4 rounded-lg flex items-center justify-center gap-2 hover:bg-muted/80 transition-all duration-300 w-full sm:w-auto hover:scale-[1.02]">
            <span className="material-symbols-outlined transition-transform duration-300 group-hover:scale-110">play_circle</span>
            View Demo
          </Link>
        </div>
        
        {/* Hero Graphic (Code Editor Preview) */}
        <div className="animate-fade-in-up delay-500 w-full max-w-5xl rounded-xl glass-panel overflow-hidden shadow-[0_0_60px_rgba(58,82,237,0.12)] border border-border/20 relative text-left hover:shadow-[0_0_80px_rgba(58,82,237,0.18)] transition-shadow duration-700">
          {/* Mac Window Controls */}
          <div className="h-10 bg-muted/80/50 border-b border-border/20 flex items-center px-4 gap-2 backdrop-blur-md">
            <div className="w-3 h-3 rounded-full bg-destructive/80"></div>
            <div className="w-3 h-3 rounded-full bg-secondary/80"></div>
            <div className="w-3 h-3 rounded-full bg-primary/80"></div>
            <div className="mx-auto font-subheading text-[12px] uppercase tracking-wider text-[12px] font-medium tracking-[0.05em] text-muted-foreground/50">two_sum.py — KeepsDSA</div>
          </div>
          <div className="flex h-[400px]">
            {/* Sidebar Mock */}
            <div className="hidden md:block w-[200px] border-r border-border/10 bg-card/50/30 p-4">
              <div className="font-subheading text-[12px] uppercase tracking-wider text-[10px] font-medium tracking-[0.05em] text-muted-foreground mb-4 uppercase">Explorer</div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-primary bg-primary/20/10 px-2 py-1 rounded font-subheading text-[12px] uppercase tracking-wider text-[12px] font-medium">
                  <span className="material-symbols-outlined text-[16px]">folder</span>
                  Arrays &amp; Hashing
                </div>
                <div className="flex items-center gap-2 text-muted-foreground pl-6 font-subheading text-[12px] uppercase tracking-wider text-[12px] font-medium">
                  <span className="material-symbols-outlined text-[16px]">description</span>
                  two_sum.py
                </div>
                <div className="flex items-center gap-2 text-muted-foreground pl-6 font-subheading text-[12px] uppercase tracking-wider text-[12px] font-medium">
                  <span className="material-symbols-outlined text-[16px]">description</span>
                  valid_anagram.py
                </div>
              </div>
            </div>
            {/* Editor Mock */}
            <div className="flex-1 bg-[#070708]/80 p-6 font-mono text-[14px] leading-[22px] text-foreground overflow-hidden relative">
              <div className="pl-5 relative text-tertiary-container"><span className="absolute left-0">1</span># Pattern: Hash Map (Two Pass or One Pass)</div>
              <div className="pl-5 relative text-tertiary-container"><span className="absolute left-0">2</span># Time Complexity: O(N)</div>
              <div className="pl-5 relative text-tertiary-container"><span className="absolute left-0">3</span># Space Complexity: O(N)</div>
              <div className="pl-5 relative"><span className="absolute left-0">4</span><br /></div>
              <div className="pl-5 relative"><span className="absolute left-0">5</span><span className="text-secondary">class</span> <span className="text-primary">Solution</span>:</div>
              <div className="pl-5 relative"><span className="absolute left-0">6</span>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-secondary">def</span> <span className="text-secondary-fixed">twoSum</span>(self, nums: List[<span className="text-secondary">int</span>], target: <span className="text-secondary">int</span>) -&gt; List[<span className="text-secondary">int</span>]:</div>
              <div className="pl-5 relative bg-primary/5 border-l-2 border-primary -ml-0.5"><span className="absolute left-0 text-muted-foreground/50">7</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;prevMap = {} <span className="text-tertiary-container"># val -&gt; index</span></div>
              <div className="pl-5 relative"><span className="absolute left-0 text-muted-foreground/50">8</span><br /></div>
              <div className="pl-5 relative"><span className="absolute left-0 text-muted-foreground/50">9</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-secondary">for</span> i, n <span className="text-secondary">in</span> enumerate(nums):</div>
              <div className="pl-5 relative"><span className="absolute left-0 text-muted-foreground/50">10</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;diff = target - n</div>
              
              {/* Floating Insights Panel Mock — animated */}
              <div className="absolute bottom-6 right-6 w-64 glass-panel rounded-lg p-4 border-l-2 border-primary-container shadow-lg animate-float">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-primary text-[18px]">lightbulb</span>
                  <span className="font-subheading text-[12px] uppercase tracking-wider text-[12px] font-bold text-primary">Mastery Insight</span>
                </div>
                <p className="font-sans text-[13px] leading-relaxed text-muted-foreground">
                  You've solved this using Brute Force last week. The Hash Map approach improves time from O(N²) to O(N).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-[1280px] mx-auto px-4 md:px-12 py-24 border-t border-border/10" id="features">
        <div className="text-center mb-16">
          <h2 className="animate-fade-in-up font-heading-mobile md:text-[32px] md:leading-[40px] font-bold text-foreground mb-4">Engineered for Technical Mastery</h2>
          <p className="animate-fade-in-up delay-100 font-sans text-[16px] leading-[24px] text-muted-foreground max-w-2xl mx-auto">Everything you need to stop grinding mindlessly and start learning systematically.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: 'account_tree', color: 'primary', title: 'Multi-solution Tracking', desc: "Don't just store one answer. Track brute-force, optimal, and alternative approaches side-by-side to understand trade-offs.", delay: '' },
            { icon: 'draw', color: 'secondary', title: 'Handwritten Notes', desc: 'Snap a photo of your whiteboard scribbles or iPad notes. We attach them directly to the problem context.', delay: 'delay-100' },
            { icon: 'psychology', color: 'tertiary', title: 'AI Explanations', desc: 'Stuck on a specific line of code? Highlight it and get an instant, context-aware explanation tailored to your skill level.', delay: 'delay-200' },
            { icon: 'autorenew', color: 'error', title: 'Spaced Repetition', desc: 'Our algorithm schedules revisions based on your mastery level, ensuring concepts move from short-term to long-term memory.', delay: 'delay-300' },
          ].map((feature) => (
            <div key={feature.title} className={`animate-fade-in-up ${feature.delay} glass-panel p-6 rounded-xl group cursor-default card-hover`}>
              <div className={`w-12 h-12 rounded-lg bg-${feature.color}/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <span className={`material-symbols-outlined text-${feature.color} text-[24px]`}>{feature.icon}</span>
              </div>
              <h3 className="font-heading text-[20px] font-semibold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">{feature.title}</h3>
              <p className="font-sans text-[14px] text-muted-foreground">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* New CTA Section */}
      <section className="max-w-[1280px] mx-auto px-4 md:px-12 py-24 border-t border-border/10">
        <div className="glass-panel rounded-2xl p-12 md:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary-container/10 pointer-events-none"></div>
          <div className="relative z-10">
            <h2 className="font-heading text-[28px] md:text-[36px] font-bold text-foreground mb-4 tracking-tight">
              Ready to build your <span className="text-primary">second brain</span>?
            </h2>
            <p className="font-sans text-[16px] md:text-[18px] text-muted-foreground max-w-xl mx-auto mb-8">
              Join developers who are mastering DSA patterns systematically instead of grinding blindly.
            </p>
            <Link href="/register" className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-container to-secondary-container text-white font-subheading text-[12px] uppercase tracking-wider text-[14px] font-bold tracking-[0.05em] px-10 py-4 rounded-lg shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.03] transition-all duration-300">
              <span className="material-symbols-outlined text-[20px]">rocket_launch</span>
              Get Started — It&apos;s Free
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
