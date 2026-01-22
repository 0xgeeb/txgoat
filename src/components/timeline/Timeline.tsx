'use client';

import { useCallback, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { TimelineConfig, TimeRange } from '@/types/timeline';
import { useTimelineSelection } from '@/hooks/useTimelineSelection';
import { TimelineTrack } from './TimelineTrack';
import { TimelineSelection } from './TimelineSelection';
import { TimelineHandle } from './TimelineHandle';
import { TimelineMarkers } from './TimelineMarkers';
import { TimelineTooltip } from './TimelineTooltip';

export interface TimelineProps {
  config: TimelineConfig;
  className?: string;
  markerCount?: number;
  onSelectionChange?: (timeRange: TimeRange | null) => void;
}

export function Timeline({
  config,
  className,
  markerCount = 5,
  onSelectionChange,
}: TimelineProps) {
  const { state, handlers, trackRef, clearSelection } = useTimelineSelection(config);
  const { selection, timeRange, isDragging, dragTarget, hoverPercent } = state;

  // Store callback ref to avoid stale closures
  const onSelectionChangeRef = useRef(onSelectionChange);
  onSelectionChangeRef.current = onSelectionChange;

  // Notify parent when selection changes
  useEffect(() => {
    onSelectionChangeRef.current?.(timeRange);
  }, [timeRange]);

  // Determine if we're in the process of creating a new selection
  const isSelecting = isDragging && dragTarget === 'selection' && selection !== null;

  // Determine if handles should be shown (selection exists and not currently creating)
  const showHandles = selection !== null && !isSelecting;

  // Handle start/end handle drag
  const handleStartDragStart = useCallback(() => {
    handlers.onHandleDragStart('start');
  }, [handlers]);

  const handleEndDragStart = useCallback(() => {
    handlers.onHandleDragStart('end');
  }, [handlers]);

  return (
    <div className={cn('relative w-full', className)}>
      {/* Tooltip - positioned above the track */}
      <TimelineTooltip
        hoverPercent={hoverPercent}
        config={config}
      />

      {/* Main track with all interactive elements */}
      <TimelineTrack
        ref={trackRef as React.RefObject<HTMLDivElement>}
        isDragging={isDragging}
        hoverPercent={hoverPercent}
        onMouseDown={handlers.onMouseDown}
        onMouseMove={handlers.onMouseMove}
        onMouseUp={handlers.onMouseUp}
        onMouseLeave={handlers.onMouseLeave}
        onTouchStart={handlers.onTouchStart}
        onTouchMove={handlers.onTouchMove}
        onTouchEnd={handlers.onTouchEnd}
        onKeyDown={handlers.onKeyDown}
      >
        {/* Selection overlay */}
        {selection && (
          <TimelineSelection
            selection={selection}
            isSelecting={isSelecting}
            isDragging={isDragging && dragTarget === 'selection'}
            onMouseDown={handlers.onSelectionDragStart}
          />
        )}

        {/* Start handle */}
        {showHandles && selection && (
          <TimelineHandle
            position="start"
            percent={selection.startPercent}
            isActive={dragTarget === 'start'}
            isDragging={isDragging && dragTarget === 'start'}
            onDragStart={handleStartDragStart}
          />
        )}

        {/* End handle */}
        {showHandles && selection && (
          <TimelineHandle
            position="end"
            percent={selection.endPercent}
            isActive={dragTarget === 'end'}
            isDragging={isDragging && dragTarget === 'end'}
            onDragStart={handleEndDragStart}
          />
        )}
      </TimelineTrack>

      {/* Time markers below the track */}
      <TimelineMarkers
        config={config}
        markerCount={markerCount}
      />

      {/* Selected time range display */}
      {timeRange && (
        <div
          className={cn(
            'mt-4 flex items-center justify-center gap-2',
            'text-sm font-mono'
          )}
        >
          <span className="text-text">
            {timeRange.start.toLocaleString()}
          </span>
          <span className="text-text-muted">→</span>
          <span className="text-text">
            {timeRange.end.toLocaleString()}
          </span>
          <button
            onClick={clearSelection}
            className={cn(
              'ml-4 px-2 py-1 text-xs',
              'bg-cream-dark border border-border',
              'text-text-muted hover:text-text hover:border-border-dark',
              'transition-colors duration-150',
              'focus-ring'
            )}
            aria-label="Clear selection"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}

Timeline.displayName = 'Timeline';
