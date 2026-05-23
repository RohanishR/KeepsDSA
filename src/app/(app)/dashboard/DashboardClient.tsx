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
    transition: { staggerChildren: 0.07, delayChildren: 0.05 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }
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

// Greeting based on time of day
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function DashboardClient({ initialData }: DashboardClientProps) {
  const { userName, totalSolved, revisionsDueCount, streak, upcomingProblem, heatmapData, difficultyData, topicData, activityFeed } = initialData;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card/95 border border-border/50 px-3 py-2 rounded-lg shadow-xl backdrop-blur-md">
          <p className="font-subheading text-[11px] uppercase tracking-wider text-muted-foreground mb-0.5">{payload[0].name || payload[0].payload.topic}</p>
          <p className="font-bold text-[14px] text-foreground">{payload[0].value} <span className="text-muted-foreground font-normal text-[12px]">problems</span></p>
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
      className="pb-16 max-w-[1400px] mx-auto"
    >
      {/* Welcome Header */}
      <motion.div variants={itemVariants} className="mb-10 flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <p className="font-subheading text-[13px] uppercase tracking-widest text-primary font-bold mb-1">{getGreeting()}</p>
          <h2 className="font-heading text-[28px] md:text-[36px] text-foreground tracking-tight font-bold leading-tight">
            Welcome back, {userName}.
          </h2>
          <p className="font-sans text-[15px] text-muted-foreground mt-1">Your logic is sharp today. Let&apos;s build.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/explore" className="group bg-card text-foreground hover:bg-accent px-5 py-2.5 rounded-xl font-medium shadow-sm border border-border/50 transition-all duration-200 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]">
            <span className="material-symbols-outlined text-[18px] text-primary transition-transform duration-200 group-hover:scale-110">search</span>
            Explore
          </Link>
          <Link href="/revision" className="group bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-200 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]">
            <span className="material-symbols-outlined text-[18px] transition-transform duration-200 group-hover:rotate-12">history_edu</span>
            Start Revision
          </Link>
        </div>
      </motion.div>
      
      {/* Top Stats Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Solved */}
        <motion.div 
          variants={cardVariants}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="bg-card rounded-2xl p-6 border border-border/40 flex flex-col justify-between min-h-[150px] relative overflow-hidden group cursor-default shadow-sm hover:shadow-md transition-shadow duration-300"
        >
          <div className="absolute -right-4 -top-4 text-primary/[0.04] group-hover:text-primary/[0.08] transition-all duration-500 group-hover:scale-110 pointer-events-none">
            <span className="material-symbols-outlined text-[100px]">task_alt</span>
          </div>
          <div className="flex items-center gap-2 relative z-10">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px] text-primary">check_circle</span>
            </div>
            <span className="font-subheading text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Total Solved</span>
          </div>
          <div className="mt-auto relative z-10 flex items-baseline gap-2">
            <span className="font-heading text-[42px] font-bold tracking-tight text-foreground leading-none">
              <AnimatedCounter value={totalSolved} />
            </span>
            <span className="text-[12px] text-primary font-semibold bg-primary/10 px-2 py-0.5 rounded-md">problems</span>
          </div>
        </motion.div>
        
        {/* Revisions Due */}
        <motion.div 
          variants={cardVariants}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="bg-card rounded-2xl p-6 border border-border/40 flex flex-col justify-between min-h-[150px] relative overflow-hidden group cursor-default shadow-sm hover:shadow-md transition-shadow duration-300"
        >
          <div className="absolute -right-4 -top-4 text-destructive/[0.04] group-hover:text-destructive/[0.08] transition-all duration-500 group-hover:scale-110 pointer-events-none">
            <span className="material-symbols-outlined text-[100px]">notification_important</span>
          </div>
          <div className="flex items-center gap-2 relative z-10">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${revisionsDueCount > 0 ? 'bg-destructive/10' : 'bg-chart-2/10'}`}>
              <span className={`material-symbols-outlined text-[18px] ${revisionsDueCount > 0 ? 'text-destructive' : 'text-chart-2'}`}>
                {revisionsDueCount > 0 ? 'warning' : 'check_circle'}
              </span>
            </div>
            <span className="font-subheading text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Revisions Due</span>
          </div>
          <div className="mt-auto relative z-10 flex items-baseline gap-2">
            <span className={`font-heading text-[42px] font-bold tracking-tight leading-none ${revisionsDueCount > 0 ? 'text-destructive' : 'text-foreground'}`}>
              <AnimatedCounter value={revisionsDueCount} />
            </span>
            <span className={`text-[12px] font-semibold px-2 py-0.5 rounded-md ${revisionsDueCount > 0 ? 'text-destructive bg-destructive/10' : 'text-chart-2 bg-chart-2/10'}`}>
              {revisionsDueCount > 0 ? 'needs review' : 'all caught up'}
            </span>
          </div>
        </motion.div>
        
        {/* Current Streak */}
        <motion.div 
          variants={cardVariants}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="bg-card rounded-2xl p-6 border border-border/40 flex flex-col justify-between min-h-[150px] relative overflow-hidden group cursor-default shadow-sm hover:shadow-md transition-shadow duration-300"
        >
          <div className="absolute -right-4 -top-4 text-chart-3/[0.06] group-hover:text-chart-3/[0.12] transition-all duration-500 group-hover:scale-110 pointer-events-none">
            <span className="material-symbols-outlined text-[100px]">local_fire_department</span>
          </div>
          <div className="flex items-center gap-2 relative z-10">
            <div className="w-8 h-8 rounded-lg bg-chart-3/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px] text-chart-3">local_fire_department</span>
            </div>
            <span className="font-subheading text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Current Streak</span>
          </div>
          <div className="mt-auto relative z-10 flex items-baseline gap-2">
            <span className="font-heading text-[42px] font-bold tracking-tight text-foreground leading-none">
              <AnimatedCounter value={streak} />
            </span>
            <span className="text-[12px] text-chart-3 font-semibold bg-chart-3/10 px-2 py-0.5 rounded-md">days</span>
          </div>
        </motion.div>
        
        {/* Upcoming Revision */}
        {upcomingProblem ? (
          <Link href="/revision" className="block">
            <motion.div 
              variants={cardVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-card rounded-2xl p-6 border border-border/40 border-l-4 border-l-primary flex flex-col justify-between min-h-[150px] relative overflow-hidden group cursor-pointer h-full shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-center gap-2 relative z-10">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px] text-primary">schedule</span>
                </div>
                <span className="font-subheading text-[11px] uppercase tracking-wider font-bold text-primary">Upcoming Revision</span>
              </div>
              <div className="mt-auto relative z-10">
                <h3 className="text-[16px] font-bold text-foreground leading-tight truncate group-hover:text-primary transition-colors duration-300" title={upcomingProblem.title}>{upcomingProblem.title}</h3>
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
            whileHover={{ y: -4 }}
            className="bg-card rounded-2xl p-6 border border-border/40 flex flex-col justify-center items-center min-h-[150px] shadow-sm"
          >
            <span className="material-symbols-outlined text-[28px] text-chart-2 mb-2">done_all</span>
            <span className="font-subheading text-[11px] uppercase tracking-wider text-muted-foreground text-center font-bold">No upcoming revisions</span>
          </motion.div>
        )}
      </motion.div>

      {/* Middle Row: Heatmap & Difficulty */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Heatmap */}
        <div className="lg:col-span-2 bg-card rounded-2xl p-6 border border-border/40 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px] text-primary">calendar_month</span>
              </div>
              <h3 className="font-bold text-[16px] text-foreground">Consistency Map</h3>
            </div>
            <span className="text-[11px] text-muted-foreground font-semibold bg-muted px-3 py-1 rounded-full uppercase tracking-wider">Last 365 Days</span>
          </div>
          <ActivityHeatmap data={heatmapData} />
        </div>

        {/* Difficulty Distribution */}
        <div className="bg-card rounded-2xl p-6 border border-border/40 flex flex-col shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-chart-3/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px] text-chart-3">donut_small</span>
            </div>
            <h3 className="font-bold text-[16px] text-foreground">Difficulty Split</h3>
          </div>
          <div className="flex-1 min-h-[200px] relative">
            {difficultyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={difficultyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={78}
                    paddingAngle={4}
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
                <span className="text-[28px] font-bold text-foreground leading-none"><AnimatedCounter value={totalSolved} duration={1.5} /></span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1 font-semibold">Total</span>
              </div>
            )}
          </div>
          
          <div className="flex justify-center gap-5 mt-4 pt-4 border-t border-border/30">
            {difficultyData.map(d => (
              <div key={d.name} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.fill }}></div>
                <span className="text-[11px] text-muted-foreground font-medium">{d.name}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Bottom Row: Topics & Recent Activity */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Topic Mastery */}
        <div className="bg-card rounded-2xl p-6 border border-border/40 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-chart-2/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px] text-chart-2">category</span>
            </div>
            <h3 className="font-bold text-[16px] text-foreground">Topic Mastery</h3>
            <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full ml-auto uppercase tracking-wider font-semibold">Top 6</span>
          </div>
          <div className="h-[250px]">
            {topicData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topicData} layout="vertical" margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" strokeOpacity={0.5} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="topic" type="category" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 12, fontWeight: 500 }} width={100} />
                  <RechartsTooltip cursor={{ fill: 'var(--accent)', opacity: 0.5 }} content={<CustomTooltip />} />
                  <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={22} animationDuration={1200} animationEasing="ease-out">
                    {topicData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(240, ${75 - (index * 8)}%, ${55 + (index * 5)}%)`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm flex-col gap-2">
                <span className="material-symbols-outlined text-[28px] opacity-40">category</span>
                <span>No topics explored yet.</span>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-card rounded-2xl p-6 border border-border/40 flex flex-col shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px] text-primary">history</span>
              </div>
              <h3 className="font-bold text-[16px] text-foreground">Recent Activity</h3>
            </div>
            <Link href="/explore" className="text-[12px] text-primary hover:text-primary/80 font-semibold transition-colors">View All →</Link>
          </div>
          
          <div className="flex-1 flex flex-col gap-1 overflow-y-auto pr-2 custom-scrollbar max-h-[250px]">
            {activityFeed.length > 0 ? (
              activityFeed.map((activity, index) => (
                <motion.div
                  key={activity._id}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.06, duration: 0.3 }}
                >
                  <Link href={`/problem/${activity.problem.slug}`} className="flex gap-3 group py-2.5 px-3 rounded-xl hover:bg-accent/50 transition-colors duration-200">
                    <div className="flex flex-col items-center pt-0.5">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-200">
                        <span className="material-symbols-outlined text-[16px]">code</span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-[13px] font-bold text-foreground group-hover:text-primary transition-colors truncate">{activity.problem.title}</h4>
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0">{formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}</span>
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
                          <span className="text-[10px] text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded">{activity.language}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            ) : (
              <div className="flex-1 flex items-center justify-center flex-col text-muted-foreground py-8">
                <span className="material-symbols-outlined text-[28px] mb-2 opacity-40">history</span>
                <span className="text-[13px]">No recent activity. Start solving!</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
