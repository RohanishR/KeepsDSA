'use client';

import React, { useEffect, useState } from 'react';
import { motion, Variants, useMotionValue, useTransform, animate } from 'framer-motion';
import Link from 'next/link';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import ActivityHeatmap from '@/components/dashboard/ActivityHeatmap';
import { formatDistanceToNow } from 'date-fns';

interface DashboardClientProps {
  initialData: {
    userName: string;
    totalSolved: number;
    revisionsDueCount: number;
    streak: number;
    upcomingProblem: any;
    heatmapData: { date: string; count: number }[];
    difficultyData: { name: string; value: number; fill: string }[];
    topicData: { topic: string; count: number }[];
    activityFeed: any[];
  }
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } }
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] } }
};

// Animated counter component
function AnimatedCounter({ value, duration = 1.2 }: { value: number; duration?: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(count, value, { duration, ease: 'easeOut' });
    const unsubscribe = rounded.on('change', (v) => setDisplayValue(v));
    return () => { controls.stop(); unsubscribe(); };
  }, [value, count, rounded, duration]);

  return <>{displayValue}</>;
}

export default function DashboardClient({ initialData }: DashboardClientProps) {
  const { userName, totalSolved, revisionsDueCount, streak, upcomingProblem, heatmapData, difficultyData, topicData, activityFeed } = initialData;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-muted/80 border border-border/30 p-3 rounded-lg shadow-xl backdrop-blur-md">
          <p className="font-subheading text-[12px] uppercase tracking-wider text-[12px] text-foreground mb-1">{payload[0].name || payload[0].payload.topic}</p>
          <p className="font-bold text-primary">{payload[0].value} problems</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div 
      variants={containerVariants} 
      initial="hidden" 
      animate="visible"
      className="pb-16"
    >
      {/* Welcome Header */}
      <motion.div variants={itemVariants} className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="font-heading-mobile md:font-heading text-headline-lg-mobile md:text-[32px] text-foreground mb-1 tracking-tight font-bold">
            Welcome back, {userName}.
          </h2>
          <p className="font-sans text-[16px] text-muted-foreground">Your logic is sharp today. Let&apos;s build.</p>
        </div>
        <div className="hidden md:flex gap-3">
          <Link href="/explore" className="group bg-muted/80 text-foreground hover:bg-background-bright px-4 py-2 rounded-lg font-medium shadow-sm border border-border/30 transition-all duration-200 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]">
            <span className="material-symbols-outlined text-[18px] transition-transform duration-200 group-hover:scale-110">search</span>
            Explore
          </Link>
          <Link href="/revision" className="group bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-200 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]">
            <span className="material-symbols-outlined text-[18px] transition-transform duration-200 group-hover:rotate-12">history_edu</span>
            Start Revision
          </Link>
        </div>
      </motion.div>
      
      {/* Top Stats Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-stack-gap-md mb-stack-gap-md">
        <motion.div 
          variants={cardVariants}
          whileHover={{ y: -5, boxShadow: '0 10px 30px -5px rgba(188,195,255,0.12)' }}
          className="glass-panel rounded-xl p-6 glow-accent flex flex-col justify-between min-h-[140px] relative overflow-hidden group cursor-default"
        >
          <div className="absolute -right-6 -top-6 text-primary/5 group-hover:text-primary/10 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 pointer-events-none">
            <span className="material-symbols-outlined text-[120px]">task_alt</span>
          </div>
          <div className="flex justify-between items-start text-muted-foreground relative z-10">
            <span className="font-subheading text-[12px] uppercase tracking-wider text-[12px] uppercase tracking-wider font-bold">Total Solved</span>
          </div>
          <div className="mt-4 relative z-10">
            <span className="font-heading text-[48px] font-bold tracking-tighter text-foreground leading-none">
              <AnimatedCounter value={totalSolved} />
            </span>
            <span className="font-subheading text-[12px] uppercase tracking-wider text-[12px] text-primary ml-2 bg-primary/10 px-2 py-0.5 rounded border border-primary/20">Problems</span>
          </div>
        </motion.div>
        
        <motion.div 
          variants={cardVariants}
          whileHover={{ y: -5, boxShadow: '0 10px 30px -5px rgba(239,68,68,0.12)' }}
          className="glass-panel rounded-xl p-6 glow-accent flex flex-col justify-between min-h-[140px] relative overflow-hidden group cursor-default"
        >
          <div className="absolute -right-6 -top-6 text-destructive/5 group-hover:text-destructive/10 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 pointer-events-none">
            <span className="material-symbols-outlined text-[120px]">warning</span>
          </div>
          <div className="flex justify-between items-start text-muted-foreground relative z-10">
            <span className="font-subheading text-[12px] uppercase tracking-wider text-[12px] uppercase tracking-wider font-bold">Revisions Due</span>
          </div>
          <div className="mt-4 relative z-10">
            <span className={`font-heading text-[48px] font-bold tracking-tighter text-foreground leading-none ${revisionsDueCount > 0 ? 'text-destructive' : ''}`}>
              <AnimatedCounter value={revisionsDueCount} />
            </span>
            <span className={`font-subheading text-[12px] uppercase tracking-wider text-[12px] ml-2 px-2 py-0.5 rounded border ${revisionsDueCount > 0 ? 'text-destructive bg-destructive/10 border-destructive/20' : 'text-muted-foreground bg-accent border-border/20'}`}>
              {revisionsDueCount > 0 ? 'Needs attention' : 'Caught up'}
            </span>
          </div>
        </motion.div>
        
        <motion.div 
          variants={cardVariants}
          whileHover={{ y: -5, boxShadow: '0 10px 30px -5px rgba(16,185,129,0.12)' }}
          className="glass-panel rounded-xl p-6 glow-accent flex flex-col justify-between min-h-[140px] relative overflow-hidden group cursor-default"
        >
          <div className="absolute -right-6 -top-6 text-secondary/5 group-hover:text-secondary/10 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 pointer-events-none">
            <span className="material-symbols-outlined text-[120px]">local_fire_department</span>
          </div>
          <div className="flex justify-between items-start text-muted-foreground relative z-10">
            <span className="font-subheading text-[12px] uppercase tracking-wider text-[12px] uppercase tracking-wider font-bold">Current Streak</span>
          </div>
          <div className="mt-4 relative z-10">
            <span className="font-heading text-[48px] font-bold tracking-tighter text-foreground leading-none">
              <AnimatedCounter value={streak} />
            </span>
            <span className="font-subheading text-[12px] uppercase tracking-wider text-[12px] text-secondary ml-2 bg-secondary/10 px-2 py-0.5 rounded border border-secondary/20">Days</span>
          </div>
        </motion.div>
        
        {upcomingProblem ? (
          <Link href="/revision" className="block">
            <motion.div 
              variants={cardVariants}
              whileHover={{ y: -5, boxShadow: '0 10px 30px -5px rgba(188,195,255,0.15)' }}
              className="glass-panel rounded-xl p-6 glow-accent flex flex-col justify-between min-h-[140px] border-l-4 border-l-primary relative overflow-hidden group cursor-pointer h-full"
            >
              <div className="relative z-10">
                <span className="font-subheading text-[12px] uppercase tracking-wider text-[12px] uppercase tracking-wider font-bold text-primary mb-2 block">Upcoming Revision</span>
                <h3 className="text-[18px] font-bold text-foreground leading-tight truncate group-hover:text-primary transition-colors duration-300" title={upcomingProblem.title}>{upcomingProblem.title}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border
                    ${upcomingProblem.difficulty === 'Easy' ? 'bg-[#132b1a] text-[#4ade80] border-[#4ade80]/20' : ''}
                    ${upcomingProblem.difficulty === 'Medium' ? 'bg-[#3b2d13] text-[#facc15] border-[#facc15]/20' : ''}
                    ${upcomingProblem.difficulty === 'Hard' ? 'bg-[#3b1313] text-[#f87171] border-[#f87171]/20' : ''}
                  `}>
                    {upcomingProblem.difficulty}
                  </span>
                  <span className="text-[12px] text-muted-foreground truncate">
                    {upcomingProblem.tags && upcomingProblem.tags.length > 0 ? upcomingProblem.tags[0] : 'General'}
                  </span>
                </div>
              </div>
            </motion.div>
          </Link>
        ) : (
          <motion.div 
            variants={cardVariants}
            whileHover={{ y: -5 }}
            className="glass-panel rounded-xl p-6 glow-accent flex flex-col justify-center items-center min-h-[140px] border-l-4 border-l-outline-variant"
          >
            <span className="material-symbols-outlined text-[32px] text-muted-foreground mb-2">done_all</span>
            <span className="font-subheading text-[12px] uppercase tracking-wider text-[12px] text-muted-foreground text-center">No upcoming revisions.</span>
          </motion.div>
        )}
      </motion.div>

      {/* Middle Row: Heatmap & Difficulty */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-stack-gap-md mb-stack-gap-md">
        {/* Heatmap */}
        <div className="lg:col-span-2 glass-panel rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-[18px] text-foreground">Consistency Map</h3>
            <span className="text-[12px] text-muted-foreground font-medium bg-accent px-3 py-1 rounded-full">Last 365 Days</span>
          </div>
          <ActivityHeatmap data={heatmapData} />
        </div>

        {/* Difficulty Distribution */}
        <div className="glass-panel rounded-xl p-6 flex flex-col">
          <h3 className="font-bold text-[18px] text-foreground mb-4">Difficulty Distribution</h3>
          <div className="flex-1 min-h-[200px] relative">
            {difficultyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={difficultyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                    animationBegin={200}
                    animationDuration={1000}
                    animationEasing="ease-out"
                  >
                    {difficultyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <RechartsTooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">No data available</div>
            )}
            {/* Center Label */}
            {difficultyData.length > 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[24px] font-bold text-foreground leading-none"><AnimatedCounter value={totalSolved} duration={1.5} /></span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Total</span>
              </div>
            )}
          </div>
          
          <div className="flex justify-center gap-4 mt-4">
            {difficultyData.map(d => (
              <div key={d.name} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.fill }}></div>
                <span className="text-[12px] text-muted-foreground font-medium">{d.name}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Bottom Row: Topics & Recent Activity */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-stack-gap-md">
        {/* Topic Mastery */}
        <div className="glass-panel rounded-xl p-6">
          <h3 className="font-bold text-[18px] text-foreground mb-6">Topic Mastery (Top 6)</h3>
          <div className="h-[250px]">
            {topicData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topicData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="topic" type="category" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} width={100} />
                  <RechartsTooltip cursor={{ fill: 'var(--muted)' }} contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '12px', fontSize: '13px', color: 'var(--foreground)' }} />
                  <Bar dataKey="count" fill="var(--primary)" radius={[0, 4, 4, 0]} barSize={20} animationDuration={1200} animationEasing="ease-out">
                    {topicData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(232, ${60 + (index * 5)}%, ${60 - (index * 5)}%)`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm">No topics explored yet.</div>
            )}
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="glass-panel rounded-xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-[18px] text-foreground">Recent Activity</h3>
            <Link href="/explore" className="text-[12px] text-primary hover:underline font-medium">View All</Link>
          </div>
          
          <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar max-h-[250px]">
            {activityFeed.length > 0 ? (
              activityFeed.map((activity, index) => (
                <motion.div
                  key={activity._id}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.08, duration: 0.35 }}
                >
                  <Link href={`/problem/${activity.problem.slug}`} className="flex gap-4 group">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-accent border border-border/30 flex items-center justify-center text-primary group-hover:bg-primary/20 group-hover:border-primary/50 transition-all duration-200">
                        <span className="material-symbols-outlined text-[16px]">code</span>
                      </div>
                      {index < activityFeed.length - 1 && <div className="w-[1px] flex-1 bg-outline-variant/20 my-1"></div>}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex justify-between items-start">
                        <h4 className="text-[14px] font-bold text-foreground group-hover:text-primary transition-colors">{activity.problem.title}</h4>
                        <span className="text-[11px] text-muted-foreground whitespace-nowrap">{formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase border
                          ${activity.problem.difficulty === 'Easy' ? 'bg-[#132b1a] text-[#4ade80] border-[#4ade80]/20' : ''}
                          ${activity.problem.difficulty === 'Medium' ? 'bg-[#3b2d13] text-[#facc15] border-[#facc15]/20' : ''}
                          ${activity.problem.difficulty === 'Hard' ? 'bg-[#3b1313] text-[#f87171] border-[#f87171]/20' : ''}
                        `}>
                          {activity.problem.difficulty}
                        </span>
                        {activity.language && (
                          <span className="text-[11px] text-muted-foreground font-mono bg-accent px-2 py-0.5 rounded border border-border/20">{activity.language}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            ) : (
              <div className="flex-1 flex items-center justify-center flex-col text-muted-foreground">
                <span className="material-symbols-outlined text-[32px] mb-2 opacity-50">history</span>
                <span className="text-[13px]">No recent activity. Start solving!</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
