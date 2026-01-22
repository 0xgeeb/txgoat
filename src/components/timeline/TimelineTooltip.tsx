'use client';

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { TimelineConfig } from '@/types/timeline';
import { percentToDate } from '@/lib/timeUtils';

export interface TimelineTooltipProps {
  hoverPercent: number | null;
  config: TimelineConfig;
  className?: string;
}

export function TimelineTooltip({
  hoverPercent,
  config,
  className,
}: TimelineTooltipProps) {
  const tooltipContent = useMemo(() => {
    if (hoverPercent === null) return null;

    const date = percentToDate(hoverPercent, config);

    // Format based on the time span
    const totalMs = config.maxDate.getTime() - config.minDate.getTime();
    const totalDays = totalMs / (1000 * 60 * 60 * 24);

    let dateLabel: string;
    let timeLabel: string | null = null;

    if (totalDays <= 1) {
      // Less than a day: show full date and time
      dateLabel = format(date, 'MMM d, yyyy');
      timeLabel = format(date, 'HH:mm:ss');
    } else if (totalDays <= 7) {
      // Less than a week: show day, date, and time
      dateLabel = format(date, 'EEE, MMM d');
      timeLabel = format(date, 'HH:mm');
    } else if (totalDays <= 90) {
      // Less than 3 months: show full date with time
      dateLabel = format(date, 'MMM d, yyyy');
      timeLabel = format(date, 'HH:mm');
    } else {
      // Longer: show date only
      dateLabel = format(date, 'MMM d, yyyy');
    }

    return { dateLabel, timeLabel };
  }, [hoverPercent, config]);

  return (
    <AnimatePresence>
      {hoverPercent !== null && tooltipContent && (
        <motion.div
          className={cn(
            'absolute bottom-full mb-3 pointer-events-none z-20',
            'transform -translate-x-1/2',
            className
          )}
          style={{
            left: `${hoverPercent}%`,
          }}
          // Framer-motion animations for smooth position and entrance/exit
          initial={{ opacity: 0, scale: 0.95, y: 4 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
            left: `${hoverPercent}%`,
          }}
          exit={{ opacity: 0, scale: 0.95, y: 4 }}
          transition={{
            opacity: { duration: 0.15 },
            scale: { type: 'spring', stiffness: 400, damping: 25 },
            y: { type: 'spring', stiffness: 400, damping: 25 },
            left: { type: 'spring', stiffness: 300, damping: 30, mass: 0.5 },
          }}
          role="tooltip"
          aria-live="polite"
        >
          {/* Tooltip container */}
          <div
            className={cn(
              'relative px-3 py-2',
              'bg-white',
              'border border-border'
            )}
          >
            {/* Content */}
            <div className="relative flex flex-col items-center gap-0.5">
              {/* Date */}
              <span
                className={cn(
                  'text-sm font-mono font-medium whitespace-nowrap',
                  'text-text'
                )}
              >
                {tooltipContent.dateLabel}
              </span>

              {/* Time (if available) */}
              {tooltipContent.timeLabel && (
                <span
                  className={cn(
                    'text-xs font-mono whitespace-nowrap',
                    'text-text-muted'
                  )}
                >
                  {tooltipContent.timeLabel}
                </span>
              )}
            </div>

            {/* Arrow pointing down */}
            <div
              className={cn(
                'absolute left-1/2 -translate-x-1/2 -bottom-1.5',
                'w-0 h-0',
                'border-l-[6px] border-l-transparent',
                'border-r-[6px] border-r-transparent',
                'border-t-[6px] border-t-border'
              )}
            />
            {/* Arrow inner (for depth effect) */}
            <div
              className={cn(
                'absolute left-1/2 -translate-x-1/2 -bottom-1',
                'w-0 h-0',
                'border-l-[5px] border-l-transparent',
                'border-r-[5px] border-r-transparent',
                'border-t-[5px] border-t-white'
              )}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

TimelineTooltip.displayName = 'TimelineTooltip';
