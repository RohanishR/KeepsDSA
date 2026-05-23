'use client';

import React, { useMemo, useState } from 'react';
import { subDays, subWeeks, subMonths, format, parseISO, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

interface HeatmapProps {
  data: { date: string; count: number }[];
}

type TimeFrame = '365days' | '30days' | '12weeks' | '12months';

export default function ActivityHeatmap({ data }: HeatmapProps) {
  const [timeframe, setTimeframe] = useState<TimeFrame>('365days');

  // Convert data to a map for O(1) lookup
  const activityMap = useMemo(() => {
    const map = new Map<string, number>();
    data.forEach(d => map.set(d.date, d.count));
    return map;
  }, [data]);

  // --- Data Generation based on Timeframe ---
  
  const generateData = () => {
    const today = new Date();
    
    if (timeframe === '365days') {
      const days = [];
      for (let i = 364; i >= 0; i--) {
        const date = subDays(today, i);
        const dateStr = format(date, 'yyyy-MM-dd');
        days.push({
          label: format(date, 'MMM d, yyyy'),
          count: activityMap.get(dateStr) || 0,
          monthLabel: format(date, 'MMM')
        });
      }
      
      const weeks = [];
      for (let i = 0; i < days.length; i += 7) {
        weeks.push(days.slice(i, i + 7));
      }
      return { type: 'grid', data: weeks };
    }
    
    if (timeframe === '30days') {
      const days = [];
      for (let i = 29; i >= 0; i--) {
        const date = subDays(today, i);
        const dateStr = format(date, 'yyyy-MM-dd');
        days.push({
          label: format(date, 'MMM d'),
          count: activityMap.get(dateStr) || 0,
        });
      }
      return { type: 'bars', data: days };
    }
    
    if (timeframe === '12weeks') {
      const weeks = [];
      for (let i = 11; i >= 0; i--) {
        const date = subWeeks(today, i);
        const start = startOfWeek(date);
        const end = endOfWeek(date);
        
        let count = 0;
        // Sum counts for the week
        for (let d = 0; d < 7; d++) {
          const dayStr = format(subDays(end, d), 'yyyy-MM-dd');
          count += activityMap.get(dayStr) || 0;
        }
        
        weeks.push({
          label: `${format(start, 'MMM d')} - ${format(end, 'MMM d')}`,
          count
        });
      }
      return { type: 'bars', data: weeks };
    }
    
    if (timeframe === '12months') {
      const months = [];
      for (let i = 11; i >= 0; i--) {
        const date = subMonths(today, i);
        const start = startOfMonth(date);
        const end = endOfMonth(date);
        
        let count = 0;
        // Sum counts for the month
        const daysInMonth = end.getDate();
        for (let d = 0; d < daysInMonth; d++) {
          const dayStr = format(subDays(end, d), 'yyyy-MM-dd');
          count += activityMap.get(dayStr) || 0;
        }
        
        months.push({
          label: format(date, 'MMM yyyy'),
          shortLabel: format(date, 'MMM'),
          count
        });
      }
      return { type: 'bars', data: months };
    }
    
    return { type: 'grid', data: [] };
  };

  const viewData = useMemo(() => generateData(), [timeframe, activityMap]);

  // Get color based on count
  const getColor = (count: number, isGrid = true) => {
    if (count === 0) return 'bg-accent border-border/10';
    if (count === 1 || (!isGrid && count <= 5)) return 'bg-primary/30 border-primary/20';
    if (count === 2 || (!isGrid && count <= 15)) return 'bg-primary/50 border-primary/40 text-primary-foreground';
    if (count >= 3) return 'bg-primary border-primary text-primary-foreground shadow-[0_0_8px_rgba(188,195,255,0.4)]';
    return 'bg-accent border-border/10';
  };

  return (
    <div className="w-full">
      {/* Header with Tabs inside the heatmap component to allow parent to stay clean */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h3 className="font-bold text-[18px] text-foreground">Consistency Map</h3>
        <div className="flex bg-muted/80 rounded-lg p-1 border border-border/10">
          {[
            { id: '365days', label: '1Y' },
            { id: '12months', label: '12M' },
            { id: '12weeks', label: '12W' },
            { id: '30days', label: '30D' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setTimeframe(tab.id as TimeFrame)}
              className={`px-3 py-1 text-[12px] font-medium rounded-md transition-all ${
                timeframe === tab.id 
                  ? 'bg-background text-foreground shadow-sm border border-border/20' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full overflow-x-auto custom-scrollbar pb-2 min-h-[140px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={timeframe}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            {viewData.type === 'grid' ? (
              <div className="min-w-[800px] flex gap-1">
                {(viewData.data as any[]).map((week, wIndex) => (
                  <div key={wIndex} className="flex flex-col gap-1">
                    {wIndex % 4 === 0 && week[0] ? (
                      <span className="text-[10px] text-muted-foreground h-4 mb-1">{week[0].monthLabel}</span>
                    ) : (
                      <span className="h-4 mb-1"></span>
                    )}
                    {week.map((day: any) => (
                      <div 
                        key={day.label}
                        className={`w-3.5 h-3.5 rounded-[3px] border ${getColor(day.count)} transition-all hover:scale-125 hover:z-10 relative group cursor-pointer`}
                      >
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 bg-accent text-foreground text-[10px] font-medium rounded opacity-0 group-hover:opacity-100 pointer-events-none z-50 shadow-xl border border-border/30 transition-opacity">
                          {day.count} problems on {day.label}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-surface-container-highest"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-end gap-2 h-[120px] pt-4">
                {(viewData.data as any[]).map((item, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                    <div className="absolute bottom-full mb-2 w-max px-2 py-1 bg-accent text-foreground text-[10px] font-medium rounded opacity-0 group-hover:opacity-100 pointer-events-none z-50 shadow-xl border border-border/30 transition-opacity">
                      {item.count} problems · {item.label}
                    </div>
                    <div 
                      className={`w-full rounded-t-sm transition-all duration-300 ${getColor(item.count, false)}`}
                      style={{ 
                        height: item.count > 0 ? `${Math.max(20, Math.min(100, (item.count / 15) * 100))}%` : '4px',
                        opacity: item.count === 0 ? 0.3 : 1
                      }}
                    ></div>
                    <span className="text-[10px] text-muted-foreground h-4 truncate w-full text-center">
                      {item.shortLabel || item.label.split(' ')[0]}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {viewData.type === 'grid' && (
        <div className="flex items-center justify-end gap-2 mt-4 text-[11px] text-muted-foreground font-medium">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-[2px] bg-accent border border-border/10"></div>
            <div className="w-3 h-3 rounded-[2px] bg-primary/30 border border-primary/20"></div>
            <div className="w-3 h-3 rounded-[2px] bg-primary/50 border border-primary/40"></div>
            <div className="w-3 h-3 rounded-[2px] bg-primary border border-primary"></div>
          </div>
          <span>More</span>
        </div>
      )}
    </div>
  );
}
