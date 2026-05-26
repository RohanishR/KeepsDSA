import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function ProfilePage() {
  return (
    <div className="flex-1 max-w-[1280px] mx-auto w-full flex flex-col gap-stack-gap-lg pt-8 pb-16">
      {/* Profile Header Section */}
      <section className="glass-panel border border-border/10 shadow-[inset_1px_1px_0px_rgba(255,255,255,0.05),0_0_20px_rgba(188,195,255,0.05)] rounded-xl p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-[-50%] right-[-10%] w-[300px] h-[300px] bg-primary/10 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="relative shrink-0">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-2 border-primary/30 overflow-hidden bg-muted/80 relative">
             <Image 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBpRVFb98fd4AY10vx6bKUeLjaUQF24O3DKv24lK8goG7uWBLRaSaEZhA0W6mVwGotvNB3xLX1fZnKMz5MSA3v5AeVmtQBchNIR2rGb-47J8cnYWgicMuso164bQhhRxkEesZAXqeS4LbX3eRTu29BKpoV4t2QXOCW0N_nMwpiGi7aBiDggo2Z9OTx9Wg__yH1gfmeBvgeFcH3UnLZFdo_Fs0CkyAyATA-okgFPQuzJOmNxB3TyQyF_4JB1aojpkK6OCACagWCvg"
                alt="User Avatar"
                fill
                className="object-cover"
             />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-linear-to-r from-primary to-secondary text-primary-foreground font-subheading text-[12px] uppercase tracking-wider font-bold px-3 py-1 rounded-full shadow-[0_0_10px_rgba(188,195,255,0.4)] flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">stars</span>
            PRO
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-4 z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="font-heading text-[24px] md:text-[32px] leading-[32px] md:leading-[40px] text-foreground font-bold">
                Alex Chen <span className="text-muted-foreground font-sans text-[18px] font-normal ml-2">@alexc_dev</span>
              </h2>
              <p className="text-[16px] leading-[24px] text-muted-foreground mt-1 max-w-2xl">
                Senior Systems Engineer & Algorithmic Enthusiast. Focusing on distributed systems and advanced graph theory. Ranked top 1% globally on AlgoMaster.
              </p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 rounded-lg border border-border/30 font-subheading text-[12px] uppercase tracking-wider font-medium tracking-[0.05em] text-foreground hover:bg-muted/80 transition-colors flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">person_add</span>
                Follow
              </button>
              <button className="px-4 py-2 rounded-lg bg-muted/80 font-subheading text-[12px] uppercase tracking-wider font-medium text-foreground hover:bg-accent transition-colors">
                <span className="material-symbols-outlined text-[18px]">more_horiz</span>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-2">
            <div className="flex items-center gap-2 text-muted-foreground font-subheading text-[12px] uppercase tracking-wider font-medium tracking-[0.05em]">
              <span className="material-symbols-outlined text-[16px]">location_on</span>
              San Francisco, CA
            </div>
            <div className="flex items-center gap-2 text-muted-foreground font-subheading text-[12px] uppercase tracking-wider font-medium tracking-[0.05em]">
              <span className="material-symbols-outlined text-[16px]">link</span>
              <a className="hover:text-primary transition-colors" href="#">github.com/alexc</a>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground font-subheading text-[12px] uppercase tracking-wider font-medium tracking-[0.05em]">
              <span className="material-symbols-outlined text-[16px]">calendar_today</span>
              Joined Sep 2021
            </div>
          </div>

          {/* Mini Stats Row */}
          <div className="flex gap-6 mt-4 p-4 rounded-lg bg-card/50/50 border border-border/10">
            <div className="flex flex-col">
              <span className="font-heading text-[24px] leading-[32px] text-primary font-bold">1,248</span>
              <span className="font-subheading text-[12px] uppercase tracking-wider font-medium tracking-[0.05em] text-muted-foreground">Problems Solved</span>
            </div>
            <div className="w-px bg-outline-variant/20"></div>
            <div className="flex flex-col">
              <span className="font-heading text-[24px] leading-[32px] text-secondary font-bold">89</span>
              <span className="font-subheading text-[12px] uppercase tracking-wider font-medium tracking-[0.05em] text-muted-foreground">Contest Rating</span>
            </div>
            <div className="w-px bg-outline-variant/20"></div>
            <div className="flex flex-col">
              <span className="font-heading text-[24px] leading-[32px] text-tertiary font-bold">4.2k</span>
              <span className="font-subheading text-[12px] uppercase tracking-wider font-medium tracking-[0.05em] text-muted-foreground">Reputation</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-stack-gap-lg">
        {/* Left Column: Content Tabs */}
        <div className="lg:col-span-2 flex flex-col gap-stack-gap-lg">
          
          {/* Content Tabs Area */}
          <section className="glass-panel border border-border/10 shadow-[inset_1px_1px_0px_rgba(255,255,255,0.05)] rounded-xl p-0 overflow-hidden flex flex-col">
            {/* Tab Header */}
            <div className="flex border-b border-border/20 px-4 overflow-x-auto custom-scrollbar">
              <button className="px-6 py-4 font-subheading text-[12px] uppercase tracking-wider font-bold tracking-[0.05em] text-primary border-b-2 border-primary bg-primary/5 whitespace-nowrap">Public Notes</button>
              <button className="px-6 py-4 font-subheading text-[12px] uppercase tracking-wider font-medium tracking-[0.05em] text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">Timeline</button>
              <button className="px-6 py-4 font-subheading text-[12px] uppercase tracking-wider font-medium tracking-[0.05em] text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">Achievements</button>
            </div>
            
            {/* Tab Content (Public Notes) */}
            <div className="p-6 flex flex-col gap-4">
              {/* Note Item 1 */}
              <div className="p-4 rounded-lg bg-card/50 border border-border/10 hover:border-primary/30 transition-all cursor-pointer group focus-within:shadow-[inset_0_0_10px_rgba(188,195,255,0.1)]">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-heading text-[18px] leading-[24px] font-medium text-foreground group-hover:text-primary transition-colors">Dynamic Programming: State Space Reduction</h4>
                  <span className="font-subheading text-[12px] uppercase tracking-wider font-medium tracking-[0.05em] text-muted-foreground bg-accent px-2 py-1 rounded">2 days ago</span>
                </div>
                <p className="text-[16px] leading-[24px] text-muted-foreground line-clamp-2 mb-3">Exploring techniques to reduce the state space in multi-dimensional DP problems, specifically focusing on bitmask optimization and rolling arrays.</p>
                <div className="flex gap-2">
                  <span className="font-mono text-[12px] text-secondary bg-secondary/10 px-2 py-0.5 rounded">#dynamic-programming</span>
                  <span className="font-mono text-[12px] text-tertiary bg-tertiary/10 px-2 py-0.5 rounded">#optimization</span>
                </div>
              </div>

              {/* Note Item 2 */}
              <div className="p-4 rounded-lg bg-card/50 border border-border/10 hover:border-primary/30 transition-all cursor-pointer group focus-within:shadow-[inset_0_0_10px_rgba(188,195,255,0.1)]">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-heading text-[18px] leading-[24px] font-medium text-foreground group-hover:text-primary transition-colors">Graph Theory: Tarjan's SCC Algorithm Explained</h4>
                  <span className="font-subheading text-[12px] uppercase tracking-wider font-medium tracking-[0.05em] text-muted-foreground bg-accent px-2 py-1 rounded">1 week ago</span>
                </div>
                <p className="text-[16px] leading-[24px] text-muted-foreground line-clamp-2 mb-3">A visual guide and implementation details for finding Strongly Connected Components using Tarjan's algorithm with low-link values.</p>
                <div className="flex gap-2">
                  <span className="font-mono text-[12px] text-secondary bg-secondary/10 px-2 py-0.5 rounded">#graphs</span>
                  <span className="font-mono text-[12px] text-tertiary bg-tertiary/10 px-2 py-0.5 rounded">#algorithms</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Sidebar Stats */}
        <div className="flex flex-col gap-stack-gap-lg">
          {/* Topic Mastery */}
          <section className="glass-panel border border-border/10 shadow-[inset_1px_1px_0px_rgba(255,255,255,0.05)] rounded-xl p-6">
            <h3 className="font-heading text-[24px] leading-[32px] font-medium text-foreground mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">radar</span>
              Topic Mastery
            </h3>
            
            <div className="space-y-3 mt-6">
              <div className="flex justify-between items-center">
                <span className="font-subheading text-[12px] uppercase tracking-wider font-medium tracking-[0.05em] text-foreground">Dynamic Programming</span>
                <span className="font-mono text-[12px] text-primary">Lvl 9</span>
              </div>
              <div className="w-full bg-accent rounded-full h-1.5">
                <div className="bg-primary h-1.5 rounded-full" style={{ width: '90%' }}></div>
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <span className="font-subheading text-[12px] uppercase tracking-wider font-medium tracking-[0.05em] text-foreground">Graphs & BFS/DFS</span>
                <span className="font-mono text-[12px] text-secondary">Lvl 8</span>
              </div>
              <div className="w-full bg-accent rounded-full h-1.5">
                <div className="bg-secondary h-1.5 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>
          </section>

          {/* Top Solved Tags */}
          <section className="glass-panel border border-border/10 shadow-[inset_1px_1px_0px_rgba(255,255,255,0.05)] rounded-xl p-6">
            <h3 className="font-heading text-[24px] leading-[32px] font-medium text-foreground mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-tertiary">tag</span>
              Top Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-muted/80 border border-border/30 rounded-full font-mono text-[12px] text-foreground flex items-center gap-1 hover:bg-background-bright transition-colors cursor-pointer">
                Array <span className="text-muted-foreground ml-1">342</span>
              </span>
              <span className="px-3 py-1 bg-muted/80 border border-border/30 rounded-full font-mono text-[12px] text-foreground flex items-center gap-1 hover:bg-background-bright transition-colors cursor-pointer">
                Hash Table <span className="text-muted-foreground ml-1">215</span>
              </span>
              <span className="px-3 py-1 bg-muted/80 border border-border/30 rounded-full font-mono text-[12px] text-foreground flex items-center gap-1 hover:bg-background-bright transition-colors cursor-pointer">
                String <span className="text-muted-foreground ml-1">189</span>
              </span>
              <span className="px-3 py-1 bg-muted/80 border border-border/30 rounded-full font-mono text-[12px] text-foreground flex items-center gap-1 hover:bg-background-bright transition-colors cursor-pointer">
                Two Pointers <span className="text-muted-foreground ml-1">112</span>
              </span>
            </div>
          </section>

          {/* Recent Badges Mini */}
          <section className="glass-panel border border-border/10 shadow-[inset_1px_1px_0px_rgba(255,255,255,0.05)] rounded-xl p-6">
            <h3 className="font-heading text-[24px] leading-[32px] font-medium text-foreground mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ffd700]">military_tech</span>
              Recent Badges
            </h3>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-accent border border-[#ffd700]/30 flex items-center justify-center text-[#ffd700] hover:scale-110 transition-transform cursor-pointer shadow-[0_0_10px_rgba(255,215,0,0.1)]" title="100 Days Streak">
                <span className="material-symbols-outlined">local_fire_department</span>
              </div>
              <div className="w-12 h-12 rounded-full bg-accent border border-primary/30 flex items-center justify-center text-primary hover:scale-110 transition-transform cursor-pointer" title="DP Master">
                <span className="material-symbols-outlined">grid_on</span>
              </div>
              <div className="w-12 h-12 rounded-full bg-accent border border-secondary/30 flex items-center justify-center text-secondary hover:scale-110 transition-transform cursor-pointer" title="Contest Top 10%">
                <span className="material-symbols-outlined">emoji_events</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
