'use client';

import { useMemo } from 'react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { TimelineConfig } from '@/types/timeline';
import { percentToDate } from '@/lib/timeUtils';

export interface TimelineMarkersProps {
  config: TimelineConfig;
  className?: string;
  markerCount?: number;
}

export function TimelineMarkers({
  config,
  className,
  markerCount = 5,
}: TimelineMarkersProps) {
  const markers = useMemo(() => {
    const result: Array<{ percent: number; date: Date; label: string }> = [];

    for (let i = 0; i <= markerCount; i++) {
      const percent = (i / markerCount) * 100;
      const date = percentToDate(percent, config);

      // Format based on the time span
      const totalMs = config.maxDate.getTime() - config.minDate.getTime();
      const totalDays = totalMs / (1000 * 60 * 60 * 24);

      let label: string;
      if (totalDays <= 1) {
        // Less than a day: show time
        label = format(date, 'HH:mm');
      } else if (totalDays <= 7) {
        // Less than a week: show day and time
        label = format(date, 'EEE HH:mm');
      } else if (totalDays <= 90) {
        // Less than 3 months: show month and day
        label = format(date, 'MMM d');
      } else {
        // Longer: show month and year
        label = format(date, 'MMM yyyy');
      }

      result.push({ percent, date, label });
    }

    return result;
  }, [config, markerCount]);

  return (
    <div
      className={cn(
        'relative w-full h-8 mt-1',
        className
      )}
      aria-hidden="true"
    >
      {markers.map((marker, index) => (
        <div
          key={index}
          className="absolute flex flex-col items-center"
          style={{
            left: `${marker.percent}%`,
            transform: 'translateX(-50%)',
          }}
        >
          {/* Tick mark */}
          <div
            className={cn(
              'w-px h-2',
              // First and last markers get cyan/magenta, others get purple
              index === 0
                ? 'bg-neon-cyan shadow-[0_0_4px_rgba(0,255,255,0.5)]'
                : index === markers.length - 1
                ? 'bg-neon-magenta shadow-[0_0_4px_rgba(255,0,255,0.5)]'
                : 'bg-neon-purple/50'
            )}
          />

          {/* Time label */}
          <span
            className={cn(
              'mt-1 text-xs font-mono whitespace-nowrap',
              // First and last labels get glow effect
              index === 0
                ? 'text-neon-cyan text-glow-cyan-sm'
                : index === markers.length - 1
                ? 'text-neon-magenta text-glow-magenta-sm'
                : 'text-gray-400'
            )}
          >
            {marker.label}
          </span>
        </div>
      ))}

      {/* Connecting line under the markers */}
      <div
        className={cn(
          'absolute top-0 left-0 right-0 h-px',
          'bg-gradient-to-r from-neon-cyan/30 via-neon-purple/20 to-neon-magenta/30'
        )}
      />
    </div>
  );
}

TimelineMarkers.displayName = 'TimelineMarkers';
