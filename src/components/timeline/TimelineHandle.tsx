'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export type HandlePosition = 'start' | 'end';

export interface TimelineHandleProps {
  position: HandlePosition;
  percent: number;
  isActive?: boolean;
  isDragging?: boolean;
  onDragStart: (position: HandlePosition) => void;
  className?: string;
}

export function TimelineHandle({
  position,
  percent,
  isActive = false,
  isDragging = false,
  onDragStart,
  className,
}: TimelineHandleProps) {
  const isStart = position === 'start';

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDragStart(position);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    onDragStart(position);
  };

  return (
    <motion.div
      className={cn(
        // Positioning - centered on the edge
        'absolute top-1/2 -translate-y-1/2 z-10',
        // Size and shape
        'w-4 h-10',
        // Cursor
        'cursor-ew-resize',
        // Touch target: larger invisible hit area
        'before:absolute before:inset-[-8px] before:content-[""]',
        className
      )}
      style={{
        left: `calc(${percent}% - 8px)`,
      }}
      // Framer-motion animations for smooth position changes
      animate={{
        left: `calc(${percent}% - 8px)`,
        scale: isActive || isDragging ? 1.1 : 1,
      }}
      initial={false}
      transition={{
        left: {
          type: 'spring',
          stiffness: 300,
          damping: 30,
          mass: 0.5,
        },
        scale: {
          type: 'spring',
          stiffness: 400,
          damping: 25,
        },
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      role="slider"
      aria-label={isStart ? 'Selection start handle' : 'Selection end handle'}
      aria-valuenow={Math.round(percent)}
      aria-valuemin={0}
      aria-valuemax={100}
      tabIndex={0}
    >
      {/* Handle background with glow */}
      <div
        className={cn(
          'absolute inset-0 rounded-full',
          // Background
          'bg-cyber-surface',
          // Border
          'border-2',
          isStart ? 'border-neon-cyan' : 'border-neon-magenta',
          // Shadow/glow
          isStart
            ? 'shadow-[0_0_8px_rgba(0,255,255,0.6),inset_0_0_4px_rgba(0,255,255,0.3)]'
            : 'shadow-[0_0_8px_rgba(255,0,255,0.6),inset_0_0_4px_rgba(255,0,255,0.3)]',
          // Transition for smooth state changes
          'transition-all duration-150',
          // Active/dragging state - intensify glow (scale handled by framer-motion)
          (isActive || isDragging) && [
            isStart
              ? 'shadow-[0_0_12px_rgba(0,255,255,0.9),0_0_24px_rgba(0,255,255,0.5),inset_0_0_6px_rgba(0,255,255,0.4)]'
              : 'shadow-[0_0_12px_rgba(255,0,255,0.9),0_0_24px_rgba(255,0,255,0.5),inset_0_0_6px_rgba(255,0,255,0.4)]',
          ],
          // Pulse animation when active
          (isActive || isDragging) && 'animate-pulse-neon'
        )}
      >
        {/* Grip lines */}
        <div className="absolute inset-x-1 top-1/2 -translate-y-1/2 flex flex-col gap-[3px]">
          <div
            className={cn(
              'h-px w-full rounded-full',
              isStart ? 'bg-neon-cyan/70' : 'bg-neon-magenta/70'
            )}
          />
          <div
            className={cn(
              'h-px w-full rounded-full',
              isStart ? 'bg-neon-cyan/70' : 'bg-neon-magenta/70'
            )}
          />
          <div
            className={cn(
              'h-px w-full rounded-full',
              isStart ? 'bg-neon-cyan/70' : 'bg-neon-magenta/70'
            )}
          />
        </div>

        {/* Center dot indicator */}
        <div
          className={cn(
            'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
            'w-1.5 h-1.5 rounded-full',
            isStart ? 'bg-neon-cyan' : 'bg-neon-magenta',
            isStart
              ? 'shadow-[0_0_4px_rgba(0,255,255,0.8)]'
              : 'shadow-[0_0_4px_rgba(255,0,255,0.8)]',
            // Pulse the dot when active
            (isActive || isDragging) && 'animate-glow-pulse'
          )}
        />
      </div>

      {/* Vertical line extending from handle */}
      <div
        className={cn(
          'absolute left-1/2 -translate-x-1/2 top-full w-px h-3',
          isStart ? 'bg-neon-cyan/50' : 'bg-neon-magenta/50',
          (isActive || isDragging) && [
            isStart ? 'bg-neon-cyan/80' : 'bg-neon-magenta/80',
          ]
        )}
      />
      <div
        className={cn(
          'absolute left-1/2 -translate-x-1/2 bottom-full w-px h-3',
          isStart ? 'bg-neon-cyan/50' : 'bg-neon-magenta/50',
          (isActive || isDragging) && [
            isStart ? 'bg-neon-cyan/80' : 'bg-neon-magenta/80',
          ]
        )}
      />
    </motion.div>
  );
}

TimelineHandle.displayName = 'TimelineHandle';
