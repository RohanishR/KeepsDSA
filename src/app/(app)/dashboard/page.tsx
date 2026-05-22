import React from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import dbConnect from '@/lib/dbConnect';
import { Problem } from '@/models/Problem';
import { Solution } from '@/models/Solution';
import { Revision } from '@/models/Revision';
import DashboardClient from './DashboardClient';

export default async function Dashboard() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  await dbConnect();
  const userId = session.user.id;
  const now = new Date();

  // 1. Total Solved
  const distinctSolvedProblems = await Solution.distinct('problemId', { userId });
  const totalSolved = distinctSolvedProblems.length;

  // 2. Revisions Due & Upcoming
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

  const upcomingRevisionDoc = await Revision.findOne({ 
    userId, 
    nextRevisionDate: { $gt: now } 
  }).sort({ nextRevisionDate: 1 }).populate('problemId').lean();

  const upcomingProblem: any = upcomingRevisionDoc ? upcomingRevisionDoc.problemId : null;

  // 3. Current Streak & Heatmap Data
  const solutions = await Solution.find({ userId }, { createdAt: 1 }).sort({ createdAt: -1 }).lean();
  
  const heatmapMap = new Map<string, number>();
  const uniqueDates = new Set<string>();

  solutions.forEach((s: any) => {
    if (s.createdAt) {
      const d = new Date(s.createdAt);
      const dateStr = d.toISOString().split('T')[0];
      uniqueDates.add(dateStr);
      heatmapMap.set(dateStr, (heatmapMap.get(dateStr) || 0) + 1);
    }
  });

  const heatmapData = Array.from(heatmapMap.entries()).map(([date, count]) => ({ date, count }));
  const sortedDates = Array.from(uniqueDates).sort().reverse() as string[];
  
  let streak = 0;
  let currentDate = new Date();
  
  const todayStr = currentDate.toISOString().split('T')[0];
  let checkDate = new Date(currentDate);

  if (sortedDates.includes(todayStr)) {
    streak = 1;
    checkDate.setDate(checkDate.getDate() - 1);
  } else {
    checkDate.setDate(checkDate.getDate() - 1);
    const yesterdayStr = checkDate.toISOString().split('T')[0];
    if (sortedDates.includes(yesterdayStr)) {
      streak = 1;
      checkDate.setDate(checkDate.getDate() - 1);
    }
  }

  if (streak > 0) {
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

  // 4. Difficulty Distribution
  const solvedProblemDocs = await Problem.find({ _id: { $in: distinctSolvedProblems } }).select('difficulty tags').lean();
  
  const difficultyCounts = { Easy: 0, Medium: 0, Hard: 0 };
  const topicCounts: Record<string, number> = {};

  solvedProblemDocs.forEach(p => {
    if (p.difficulty === 'Easy' || p.difficulty === 'Medium' || p.difficulty === 'Hard') {
      difficultyCounts[p.difficulty]++;
    }
    p.tags?.forEach((tag: string) => {
      topicCounts[tag] = (topicCounts[tag] || 0) + 1;
    });
  });

  const difficultyData = [
    { name: 'Easy', value: difficultyCounts.Easy, fill: '#4ade80' },
    { name: 'Medium', value: difficultyCounts.Medium, fill: '#facc15' },
    { name: 'Hard', value: difficultyCounts.Hard, fill: '#f87171' }
  ].filter(d => d.value > 0);

  // Top 6 topics
  const topicData = Object.entries(topicCounts)
    .map(([topic, count]) => ({ topic, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  // 5. Recent Activity
  const recentSolutions = await Solution.find({ userId })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('problemId', 'title slug difficulty tags')
    .lean();

  const activityFeed = recentSolutions.map(s => ({
    _id: s._id.toString(),
    problem: s.problemId,
    createdAt: s.createdAt,
    language: s.language,
  }));

  const initialData = {
    userName: session.user.name || 'Engineer',
    totalSolved,
    revisionsDueCount,
    streak,
    upcomingProblem: upcomingProblem ? {
      title: upcomingProblem.title,
      slug: upcomingProblem.slug,
      difficulty: upcomingProblem.difficulty,
      tags: upcomingProblem.tags
    } : null,
    heatmapData,
    difficultyData,
    topicData,
    activityFeed
  };

  return <DashboardClient initialData={JSON.parse(JSON.stringify(initialData))} />;
}
