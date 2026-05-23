'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import ActivityHeatmap from '@/components/dashboard/ActivityHeatmap';
import Link from 'next/link';

interface PublicProfileClientProps {
  data: {
    user: { name: string; username: string; image?: string };
    privacySettings: { showStats: boolean; showSolutions: boolean; showNotes: boolean };
    stats: { totalSolved: number; streak: number };
    badges: any[];
    heatmapData: any[];
    difficultyData: any[];
    topicData: any[];
    recentSolutionsData: any[];
  };
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 }
  }
};

export default function PublicProfileClient({ data }: PublicProfileClientProps) {
  const { user, privacySettings, stats, badges, heatmapData, difficultyData, topicData, recentSolutionsData } = data;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <motion.div 
        variants={containerVariants} 
        initial="hidden" 
        animate="visible"
        className="space-y-8"
      >
        {/* Header Profile Card */}
        <motion.div variants={itemVariants} className="glass-panel p-8 rounded-2xl flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none"></div>
          
          <div className="relative">
            {user.image ? (
              <img src={user.image} alt={user.name} className="w-32 h-32 rounded-full border-4 border-surface shadow-2xl" />
            ) : (
              <div className="w-32 h-32 rounded-full bg-accent flex items-center justify-center border-4 border-surface shadow-2xl">
                <span className="material-symbols-outlined text-[64px] text-primary">person</span>
              </div>
            )}
            {badges.length > 0 && (
              <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-background flex items-center justify-center shadow-lg border-2 border-surface-container" title={badges[0].name}>
                <span className="material-symbols-outlined text-[24px]" style={{ color: badges[0].color }}>{badges[0].icon}</span>
              </div>
            )}
          </div>
          
          <div className="flex-1 text-center md:text-left z-10">
            <h1 className="text-4xl font-display-sm font-bold text-foreground mb-2">{user.name}</h1>
            <p className="text-muted-foreground font-mono mb-6">keepsdsa.com/u/{user.username}</p>
            
            {privacySettings.showStats && (
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="bg-card/50 px-4 py-3 rounded-xl border border-border/10 shadow-sm flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-[28px]">task_alt</span>
                  <div className="text-left">
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Solved</p>
                    <p className="text-xl font-bold text-foreground">{stats.totalSolved}</p>
                  </div>
                </div>
                <div className="bg-card/50 px-4 py-3 rounded-xl border border-border/10 shadow-sm flex items-center gap-3">
                  <span className="material-symbols-outlined text-destructive text-[28px]">local_fire_department</span>
                  <div className="text-left">
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Streak</p>
                    <p className="text-xl font-bold text-foreground">{stats.streak} Days</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Badges Section */}
        {badges.length > 0 && (
          <motion.div variants={itemVariants}>
            <h2 className="text-lg font-bold text-foreground mb-4">Achievements</h2>
            <div className="flex flex-wrap gap-4">
              {badges.map(badge => (
                <div key={badge.id} className="glass-panel px-4 py-3 rounded-xl flex items-center gap-3 border border-border/10 shadow-md">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-accent" style={{ color: badge.color }}>
                    <span className="material-symbols-outlined">{badge.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-foreground">{badge.name}</h3>
                    <p className="text-xs text-muted-foreground">{badge.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {privacySettings.showStats ? (
          <>
            {/* Heatmap Row */}
            <motion.div variants={itemVariants} className="glass-panel p-6 rounded-xl overflow-x-auto custom-scrollbar">
              <h2 className="text-lg font-bold text-foreground mb-4">Activity</h2>
              <div className="min-w-[700px]">
                <ActivityHeatmap data={heatmapData} />
              </div>
            </motion.div>

            {/* Charts Row */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass-panel p-6 rounded-xl">
                <h3 className="font-bold text-lg text-foreground mb-6">Difficulty</h3>
                <div className="h-[250px] flex items-center justify-center relative">
                  {difficultyData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={difficultyData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                          {difficultyData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <RechartsTooltip contentStyle={{ backgroundColor: '#1a1b26', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-muted-foreground text-sm">No data available.</p>
                  )}
                  {difficultyData.length > 0 && (
                    <div className="absolute flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-3xl font-bold text-foreground">{stats.totalSolved}</span>
                      <span className="text-xs text-muted-foreground uppercase tracking-wider">Total</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="glass-panel p-6 rounded-xl">
                <h3 className="font-bold text-lg text-foreground mb-6">Top Topics</h3>
                <div className="h-[250px]">
                  {topicData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={topicData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
                        <XAxis type="number" hide />
                        <YAxis dataKey="topic" type="category" axisLine={false} tickLine={false} tick={{ fill: '#c5c5d8', fontSize: 12 }} width={100} />
                        <RechartsTooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#1a1b26', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                        <Bar dataKey="count" fill="#314ae6" radius={[0, 4, 4, 0]} barSize={20}>
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
            </motion.div>
          </>
        ) : (
           <motion.div variants={itemVariants} className="glass-panel p-8 rounded-xl text-center">
            <span className="material-symbols-outlined text-[48px] text-muted-foreground mb-4 opacity-50">visibility_off</span>
            <h2 className="text-lg font-bold text-foreground">Stats are private</h2>
            <p className="text-muted-foreground text-sm mt-2">This user has chosen to keep their stats private.</p>
          </motion.div>
        )}

        {/* Public Solutions Row */}
        {privacySettings.showSolutions && recentSolutionsData.length > 0 && (
          <motion.div variants={itemVariants} className="glass-panel p-6 rounded-xl">
            <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">public</span>
              Public Solutions
            </h2>
            <div className="space-y-4">
              {recentSolutionsData.map(solution => (
                <Link key={solution._id} href={`/u/${user.username}/problem/${solution.problem?.slug}`}>
                  <div className="flex items-center justify-between p-4 bg-card/50 hover:bg-muted border border-border/10 rounded-xl transition-colors cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-primary border border-border/20 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-[20px]">code</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-sm">{solution.problem?.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border
                            ${solution.problem?.difficulty === 'Easy' ? 'bg-[#132b1a] text-[#4ade80] border-[#4ade80]/20' : ''}
                            ${solution.problem?.difficulty === 'Medium' ? 'bg-[#3b2d13] text-[#facc15] border-[#facc15]/20' : ''}
                            ${solution.problem?.difficulty === 'Hard' ? 'bg-[#3b1313] text-[#f87171] border-[#f87171]/20' : ''}
                          `}>
                            {solution.problem?.difficulty}
                          </span>
                          <span className="text-xs text-muted-foreground bg-accent px-2 py-0.5 rounded">
                            {solution.language}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}

      </motion.div>
    </div>
  );
}
