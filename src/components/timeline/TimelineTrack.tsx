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
          'relative h-12 w-full overflow-hidden',
          // Background
          'bg-cream-dark',
          // Border
          'border border-border',
          // Interaction states
          'cursor-crosshair select-none',
          isDragging && 'cursor-grabbing',
          // Focus styles for accessibility
          'focus-ring',
          // Transition for smooth state changes
          'transition-colors duration-200',
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
        {/* Track line in center */}
        <div
          className={cn(
            'absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5',
            'bg-border-dark'
          )}
        />

        {/* Hover indicator */}
        {hoverPercent !== null && hoverPercent !== undefined && !isDragging && (
          <div
            className="absolute top-0 bottom-0 w-px bg-charcoal/50 pointer-events-none transition-opacity duration-150"
            style={{
              left: `${hoverPercent}%`,
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
