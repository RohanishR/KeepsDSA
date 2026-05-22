import React from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import dbConnect from '@/lib/dbConnect';
import { Problem } from '@/models/Problem';
import { Solution } from '@/models/Solution';
import { Revision } from '@/models/Revision';
import Link from 'next/link';

export default async function Dashboard() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  await dbConnect();
  const userId = session.user.id;
  const now = new Date();

  // 1. Total Solved: Count of distinct problems where the user has at least one solution
  const distinctSolvedProblems = await Solution.distinct('problemId', { userId });
  const totalSolved = distinctSolvedProblems.length;

  // 2. Revisions Due: 
  // Get all user problems
  const problems = await Problem.find({ userId }).lean();
  const revisions = await Revision.find({ userId }).lean();
  
  const revisionMap = new Map();
  for (const rev of revisions) {
    revisionMap.set(rev.problemId.toString(), rev);
  }

  let revisionsDueCount = 0;
  for (const p of problems) {
    const rev = revisionMap.get(p._id.toString());
    if (!rev || !rev.nextRevisionDate || new Date(rev.nextRevisionDate) <= now) {
      revisionsDueCount++;
    }
  }

  // 3. Upcoming Revision (Future)
  const upcomingRevisionDoc = await Revision.findOne({ 
    userId, 
    nextRevisionDate: { $gt: now } 
  }).sort({ nextRevisionDate: 1 }).populate('problemId').lean();

  const upcomingProblem: any = upcomingRevisionDoc ? upcomingRevisionDoc.problemId : null;

  // 4. Current Streak Calculation
  // Get all unique dates (YYYY-MM-DD) the user submitted a solution
  const solutions = await Solution.find({ userId }, { createdAt: 1 }).sort({ createdAt: -1 }).lean();
  
  const uniqueDates = new Set();
  solutions.forEach((s: any) => {
    if (s.createdAt) {
      const d = new Date(s.createdAt);
      // Adjust to local date string roughly by just grabbing YYYY-MM-DD
      const dateStr = d.toISOString().split('T')[0];
      uniqueDates.add(dateStr);
    }
  });

  const sortedDates = Array.from(uniqueDates).sort().reverse() as string[];
  
  let streak = 0;
  let currentDate = new Date();
  
  // Check today first
  const todayStr = currentDate.toISOString().split('T')[0];
  let checkDate = new Date(currentDate);

  if (sortedDates.includes(todayStr)) {
    streak = 1;
    checkDate.setDate(checkDate.getDate() - 1);
  } else {
    // If they haven't solved today, check if they solved yesterday (streak still alive)
    checkDate.setDate(checkDate.getDate() - 1);
    const yesterdayStr = checkDate.toISOString().split('T')[0];
    if (sortedDates.includes(yesterdayStr)) {
      streak = 1;
      checkDate.setDate(checkDate.getDate() - 1);
    }
  }

  if (streak > 0) {
    // Count backwards for consecutive days
    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0];
      if (sortedDates.includes(dateStr)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
  }

  return (
    <>
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-1">Welcome back, {session.user.name || 'Engineer'}.</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">Your logic is sharp today. Let's build.</p>
        </div>
        <div className="hidden md:block">
          <span className={`font-label-sm text-label-sm px-3 py-1 rounded-full border ${revisionsDueCount > 0 ? 'text-error bg-error/10 border-error/20' : 'text-primary bg-primary/10 border-primary/20'}`}>
            Status: {revisionsDueCount > 0 ? 'Revisions Due' : 'Optimal'}
          </span>
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
            <span className="font-display-lg text-[48px] font-bold tracking-tighter text-on-surface leading-none">{totalSolved}</span>
            <span className="font-label-sm text-label-sm text-secondary ml-2">problems</span>
          </div>
        </div>
        
        <div className="glass-panel rounded-xl p-6 glow-accent flex flex-col justify-between min-h-[140px]">
          <div className="flex justify-between items-start text-on-surface-variant">
            <span className="font-label-sm text-label-sm">Revisions Due</span>
            <span className={`material-symbols-outlined text-[20px] ${revisionsDueCount > 0 ? 'text-error' : ''}`}>warning</span>
          </div>
          <div className="mt-4">
            <span className={`font-display-lg text-[48px] font-bold tracking-tighter text-on-surface leading-none ${revisionsDueCount > 0 ? 'text-error' : ''}`}>{revisionsDueCount}</span>
            <span className={`font-label-sm text-label-sm ml-2 ${revisionsDueCount > 0 ? 'text-error' : 'text-on-surface-variant'}`}>
              {revisionsDueCount > 0 ? 'Needs attention' : 'All caught up'}
            </span>
          </div>
        </div>
        
        <div className="glass-panel rounded-xl p-6 glow-accent flex flex-col justify-between min-h-[140px]">
          <div className="flex justify-between items-start text-on-surface-variant">
            <span className="font-label-sm text-label-sm">Current Streak</span>
            <span className={`material-symbols-outlined text-[20px] ${streak > 0 ? 'text-secondary' : ''}`}>local_fire_department</span>
          </div>
          <div className="mt-4">
            <span className="font-display-lg text-[48px] font-bold tracking-tighter text-on-surface leading-none">{streak}</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant ml-2">Days</span>
          </div>
        </div>
        
        {/* Upcoming Reminder Card */}
        {upcomingProblem ? (
          <div className="glass-panel rounded-xl p-6 glow-accent flex flex-col justify-between min-h-[140px] border-l-4 border-l-primary">
            <div>
              <span className="font-label-sm text-label-sm text-primary mb-2 block">Upcoming Revision</span>
              <h3 className="font-headline-md text-headline-md text-on-surface leading-tight truncate" title={upcomingProblem.title}>{upcomingProblem.title}</h3>
              <p className="font-label-sm text-label-sm text-on-surface-variant mt-1 truncate">
                {upcomingProblem.difficulty} {upcomingProblem.tags && upcomingProblem.tags.length > 0 ? `• ${upcomingProblem.tags.join(', ')}` : ''}
              </p>
            </div>
            <Link href={`/problem/${upcomingProblem.slug}`} className="mt-4 w-full bg-surface-container-high hover:bg-surface-bright text-on-surface font-label-sm text-label-sm py-2 rounded transition-colors border border-outline-variant/30 text-center block">
              View Problem
            </Link>
          </div>
        ) : (
          <div className="glass-panel rounded-xl p-6 glow-accent flex flex-col justify-center items-center min-h-[140px] border-l-4 border-l-outline-variant">
            <span className="material-symbols-outlined text-[32px] text-on-surface-variant mb-2">done_all</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant text-center">No upcoming revisions scheduled yet.</span>
          </div>
        )}
      </div>
    </>
  );
}
