import React from 'react';
import dbConnect from '@/lib/dbConnect';
import { User } from '@/models/User';
import { Problem } from '@/models/Problem';
import { Solution } from '@/models/Solution';
import { notFound } from 'next/navigation';
import { calculateBadges, UserStats } from '@/lib/badges';
import PublicProfileClient from './PublicProfileClient';

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  return {
    title: `${username}'s DSA Portfolio`,
  };
}

export default async function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  await dbConnect();
  
  const user = await User.findOne({ username: username.toLowerCase() }).lean();
  if (!user || !user.privacySettings?.isProfilePublic) {
    notFound(); // 404 if user doesn't exist or profile is private
  }

  const userId = user._id;

  // Calculate User Stats
  const distinctSolvedProblems = await Solution.distinct('problemId', { userId });
  const totalSolved = distinctSolvedProblems.length;

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

  const solvedProblemDocs = await Problem.find({ _id: { $in: distinctSolvedProblems } }).select('difficulty tags').lean();
  
  const difficultyCounts = { Easy: 0, Medium: 0, Hard: 0 };
  const topicCounts: Record<string, number> = {};

  solvedProblemDocs.forEach((p: any) => {
    if (p.difficulty === 'Easy' || p.difficulty === 'Medium' || p.difficulty === 'Hard') {
      difficultyCounts[p.difficulty as keyof typeof difficultyCounts]++;
    }
    p.tags?.forEach((tag: string) => {
      topicCounts[tag] = (topicCounts[tag] || 0) + 1;
    });
  });

  const stats: UserStats = {
    totalSolved,
    streak,
    topicCounts,
    difficultyCounts
  };

  const badges = calculateBadges(stats).filter(b => b.earned);

  const difficultyData = [
    { name: 'Easy', value: difficultyCounts.Easy, fill: '#4ade80' },
    { name: 'Medium', value: difficultyCounts.Medium, fill: '#facc15' },
    { name: 'Hard', value: difficultyCounts.Hard, fill: '#f87171' }
  ].filter(d => d.value > 0);

  const topicData = Object.entries(topicCounts)
    .map(([topic, count]) => ({ topic, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  let recentSolutionsData: any[] = [];
  if (user.privacySettings.showSolutions) {
    const recentSolutions = await Solution.find({ userId, type: 'Optimal' })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('problemId', 'title slug difficulty tags')
      .lean();

    recentSolutionsData = recentSolutions.map(s => ({
      _id: s._id.toString(),
      problem: s.problemId,
      createdAt: s.createdAt,
      language: s.language,
    }));
  }

  const publicData = {
    user: {
      name: user.name,
      username: user.username,
      image: user.image,
    },
    privacySettings: user.privacySettings,
    stats,
    badges,
    heatmapData,
    difficultyData,
    topicData,
    recentSolutionsData
  };

  return <PublicProfileClient data={JSON.parse(JSON.stringify(publicData))} />;
}
