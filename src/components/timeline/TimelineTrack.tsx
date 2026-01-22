'use client';

import { forwardRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface TimelineTrackProps {
  children?: ReactNode;
  className?: string;
  isDragging?: boolean;
  hoverPercent?: number | null;
  onMouseDown?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseMove?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseUp?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onTouchStart?: (e: React.TouchEvent<HTMLDivElement>) => void;
  onTouchMove?: (e: React.TouchEvent<HTMLDivElement>) => void;
  onTouchEnd?: (e: React.TouchEvent<HTMLDivElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
}

export const TimelineTrack = forwardRef<HTMLDivElement, TimelineTrackProps>(
  (
    {
      children,
      className,
      isDragging = false,
      hoverPercent,
      onMouseDown,
      onMouseMove,
      onMouseUp,
      onMouseLeave,
      onTouchStart,
      onTouchMove,
      onTouchEnd,
      onKeyDown,
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        role="group"
        tabIndex={0}
        aria-label="Timeline selection track"
        className={cn(
          // Base layout
          'relative h-12 w-full rounded-lg overflow-hidden',
          // Background gradient - dark base with subtle neon undertone
          'bg-gradient-to-r from-cyber-darker via-cyber-surface to-cyber-darker',
          // Border with glow
          'border border-cyber-border',
          // Idle state: subtle pulse animation
          !isDragging && 'animate-glow-pulse',
          // Interaction states
          'cursor-crosshair select-none',
          isDragging && 'cursor-grabbing',
          // Focus styles for accessibility
          'focus-ring-neon',
          // Transition for smooth state changes
          'transition-shadow duration-200',
          className
        )}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onKeyDown={onKeyDown}
      >
        {/* Inner glow border effect */}
        <div
          className={cn(
            'absolute inset-0 rounded-lg pointer-events-none',
            'border border-neon-cyan/20',
            'shadow-[inset_0_0_20px_rgba(0,255,255,0.05)]',
            isDragging && 'border-neon-cyan/40 shadow-[inset_0_0_30px_rgba(0,255,255,0.1)]'
          )}
        />

        {/* Gradient track line in center */}
        <div
          className={cn(
            'absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1',
            'bg-gradient-to-r from-neon-cyan/30 via-neon-purple/30 to-neon-magenta/30',
            'rounded-full'
          )}
        />

        {/* Hover glow indicator */}
        {hoverPercent !== null && hoverPercent !== undefined && !isDragging && (
          <div
            className="absolute top-0 bottom-0 w-px bg-neon-cyan/50 pointer-events-none transition-opacity duration-150"
            style={{
              left: `${hoverPercent}%`,
              boxShadow: '0 0 10px rgba(0, 255, 255, 0.5), 0 0 20px rgba(0, 255, 255, 0.3)',
            }}
          />
        )}

        {/* Content slot for selection overlay, handles, etc. */}
        {children}
      </div>
    );
  }
);

TimelineTrack.displayName = 'TimelineTrack';
