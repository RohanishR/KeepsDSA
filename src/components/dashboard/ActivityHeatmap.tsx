'use client';

import React, { useMemo } from 'react';
import { subDays, format, parseISO } from 'date-fns';

interface HeatmapProps {
  data: { date: string; count: number }[];
}

export default function ActivityHeatmap({ data }: HeatmapProps) {
  // Convert data to a map for O(1) lookup
  const activityMap = useMemo(() => {
    const map = new Map<string, number>();
    data.forEach(d => map.set(d.date, d.count));
    return map;
  }, [data]);

  // Generate last 364 days + today = 365 days (52 weeks * 7 days + 1)
  const days = useMemo(() => {
    const today = new Date();
    const result = [];
    // Start from 364 days ago
    for (let i = 364; i >= 0; i--) {
      const date = subDays(today, i);
      const dateStr = format(date, 'yyyy-MM-dd');
      result.push({
        dateStr,
        count: activityMap.get(dateStr) || 0,
        month: format(date, 'MMM')
      });
    }
    return result;
  }, [activityMap]);

  // Group by weeks for the grid
  const weeks = useMemo(() => {
    const w = [];
    for (let i = 0; i < days.length; i += 7) {
      w.push(days.slice(i, i + 7));
    }
    return w;
  }, [days]);

  // Get color based on count
  const getColor = (count: number) => {
    if (count === 0) return 'bg-surface-container-highest border-outline-variant/10';
    if (count === 1) return 'bg-primary/30 border-primary/20';
    if (count === 2) return 'bg-primary/50 border-primary/40 text-primary-foreground';
    if (count >= 3) return 'bg-primary border-primary text-primary-foreground shadow-[0_0_8px_rgba(188,195,255,0.4)]';
    return 'bg-surface-container-highest border-outline-variant/10';
  };

  return (
    <div className="w-full overflow-x-auto custom-scrollbar pb-2">
      <div className="min-w-[800px] flex gap-1">
        {weeks.map((week, wIndex) => (
          <div key={wIndex} className="flex flex-col gap-1">
            {/* Show month label if it's the first week of a new month, or just sporadically */}
            {wIndex % 4 === 0 && week[0] ? (
              <span className="text-[10px] text-on-surface-variant h-4 mb-1">{week[0].month}</span>
            ) : (
              <span className="h-4 mb-1"></span>
            )}
            {week.map((day, dIndex) => (
              <div 
                key={day.dateStr}
                className={`w-3.5 h-3.5 rounded-[3px] border ${getColor(day.count)} transition-all hover:scale-125 hover:z-10 relative group cursor-pointer`}
                title={`${day.count} problems on ${day.dateStr}`}
              >
                {/* Custom Tooltip on Hover */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 bg-surface-container-highest text-on-surface text-[10px] font-medium rounded opacity-0 group-hover:opacity-100 pointer-events-none z-50 shadow-xl border border-outline-variant/30 transition-opacity">
                  {day.count} problems on {format(parseISO(day.dateStr), 'MMM d, yyyy')}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-surface-container-highest"></div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-end gap-2 mt-4 text-[11px] text-on-surface-variant font-medium">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-[2px] bg-surface-container-highest border border-outline-variant/10"></div>
          <div className="w-3 h-3 rounded-[2px] bg-primary/30 border border-primary/20"></div>
          <div className="w-3 h-3 rounded-[2px] bg-primary/50 border border-primary/40"></div>
          <div className="w-3 h-3 rounded-[2px] bg-primary border border-primary"></div>
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
