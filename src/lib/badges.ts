export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // Material symbols icon name
  color: string; // Hex color for the badge
  earned: boolean;
  earnedAt?: Date;
}

export interface UserStats {
  totalSolved: number;
  streak: number;
  topicCounts: Record<string, number>;
  difficultyCounts: { Easy: number; Medium: number; Hard: number };
}

export function calculateBadges(stats: UserStats): Badge[] {
  const badges: Badge[] = [];

  // First Blood
  badges.push({
    id: 'first_blood',
    name: 'First Blood',
    description: 'Solved your very first problem.',
    icon: 'local_fire_department',
    color: '#f97316',
    earned: stats.totalSolved >= 1,
  });

  // Streaker
  badges.push({
    id: 'streaker_7',
    name: 'Consistent',
    description: 'Achieved a 7-day streak.',
    icon: 'bolt',
    color: '#eab308',
    earned: stats.streak >= 7,
  });

  badges.push({
    id: 'streaker_30',
    name: 'Unstoppable',
    description: 'Achieved a 30-day streak.',
    icon: 'whatshot',
    color: '#ef4444',
    earned: stats.streak >= 30,
  });

  // Milestones
  badges.push({
    id: 'milestone_50',
    name: 'Half Century',
    description: 'Solved 50 problems.',
    icon: 'military_tech',
    color: '#8b5cf6',
    earned: stats.totalSolved >= 50,
  });

  badges.push({
    id: 'milestone_100',
    name: 'Centurion',
    description: 'Solved 100 problems.',
    icon: 'diamond',
    color: '#3b82f6',
    earned: stats.totalSolved >= 100,
  });

  // Topics
  const hasGraphMaster = (stats.topicCounts['Graph'] || 0) >= 10;
  badges.push({
    id: 'graph_master',
    name: 'Graph Master',
    description: 'Solved 10 Graph problems.',
    icon: 'hub',
    color: '#10b981',
    earned: hasGraphMaster,
  });

  const hasDPMaster = (stats.topicCounts['Dynamic Programming'] || 0) >= 15;
  badges.push({
    id: 'dp_master',
    name: 'DP Master',
    description: 'Solved 15 Dynamic Programming problems.',
    icon: 'memory',
    color: '#ec4899',
    earned: hasDPMaster,
  });

  // Difficulties
  badges.push({
    id: 'hard_hitter',
    name: 'Heavy Hitter',
    description: 'Solved 10 Hard problems.',
    icon: 'fitness_center',
    color: '#dc2626',
    earned: stats.difficultyCounts.Hard >= 10,
  });

  return badges;
}
