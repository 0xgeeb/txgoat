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
      {/* Handle background */}
      <div
        className={cn(
          'absolute inset-0 rounded-sm',
          // Background
          'bg-white',
          // Border
          'border-2 border-charcoal',
          // Transition for smooth state changes
          'transition-all duration-150',
          // Active/dragging state
          (isActive || isDragging) && 'bg-charcoal'
        )}
      >
        {/* Grip lines */}
        <div className="absolute inset-x-1 top-1/2 -translate-y-1/2 flex flex-col gap-[3px]">
          <div
            className={cn(
              'h-px w-full',
              (isActive || isDragging) ? 'bg-white/70' : 'bg-charcoal/50'
            )}
          />
          <div
            className={cn(
              'h-px w-full',
              (isActive || isDragging) ? 'bg-white/70' : 'bg-charcoal/50'
            )}
          />
          <div
            className={cn(
              'h-px w-full',
              (isActive || isDragging) ? 'bg-white/70' : 'bg-charcoal/50'
            )}
          />
        </div>
      </div>

      {/* Vertical line extending from handle */}
      <div
        className={cn(
          'absolute left-1/2 -translate-x-1/2 top-full w-px h-3',
          'bg-charcoal/30',
          (isActive || isDragging) && 'bg-charcoal/60'
        )}
      />
      <div
        className={cn(
          'absolute left-1/2 -translate-x-1/2 bottom-full w-px h-3',
          'bg-charcoal/30',
          (isActive || isDragging) && 'bg-charcoal/60'
        )}
      />
    </motion.div>
  );
}

TimelineHandle.displayName = 'TimelineHandle';
