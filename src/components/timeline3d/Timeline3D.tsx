'use client';

import { useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { cn } from '@/lib/utils';
import { Scene } from './Scene';
import { getZoomLevel, formatDateForZoom } from './utils';
import type { TimeRange, ViewState, Timeline3DConfig } from './types';
import { format } from 'date-fns';

export interface Timeline3DProps {
  config: Timeline3DConfig;
  className?: string;
  onSelectionChange?: (range: TimeRange | null) => void;
}

export function Timeline3D({
  config,
  className,
  onSelectionChange,
}: Timeline3DProps) {
  // View state tracks the current zoom level and visible date range
  const [viewState, setViewState] = useState<ViewState>(() => ({
    zoomLevel: getZoomLevel(config.minDate, config.maxDate),
    viewStart: config.minDate,
    viewEnd: config.maxDate,
  }));

  // Track if we're zoomed in
  const isZoomed = viewState.viewStart.getTime() !== config.minDate.getTime() ||
    viewState.viewEnd.getTime() !== config.maxDate.getTime();

  // Selection state
  const [selectedRange, setSelectedRange] = useState<TimeRange | null>(null);

  // Clear trigger - increment to signal Scene to clear its selection
  const [clearTrigger, setClearTrigger] = useState(0);

  // Handle selection change
  const handleSelectionChange = useCallback((range: TimeRange | null) => {
    setSelectedRange(range);
    onSelectionChange?.(range);
  }, [onSelectionChange]);

  // Zoom into selection
  const handleZoomIn = useCallback(() => {
    if (selectedRange) {
      setViewState({
        zoomLevel: getZoomLevel(selectedRange.start, selectedRange.end),
        viewStart: selectedRange.start,
        viewEnd: selectedRange.end,
      });
      setSelectedRange(null);
      setClearTrigger(t => t + 1);
      onSelectionChange?.(null);
    }
  }, [selectedRange, onSelectionChange]);

  // Reset to full range
  const handleReset = useCallback(() => {
    setViewState({
      zoomLevel: getZoomLevel(config.minDate, config.maxDate),
      viewStart: config.minDate,
      viewEnd: config.maxDate,
    });
    setSelectedRange(null);
    setClearTrigger(t => t + 1);
    onSelectionChange?.(null);
  }, [config.minDate, config.maxDate, onSelectionChange]);

  return (
    <div className={cn('relative w-full', className)}>
      {/* Info bar */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-mono text-text">
          {format(viewState.viewStart, 'MMM yyyy')} — {format(viewState.viewEnd, 'MMM yyyy')}
        </span>
        {isZoomed && (
          <button
            onClick={handleReset}
            className={cn(
              'px-3 py-1 text-xs',
              'bg-cream-dark border border-border',
              'text-text-muted hover:text-text hover:border-border-dark',
              'transition-colors duration-150'
            )}
          >
            Reset
          </button>
        )}
      </div>

      {/* 3D Canvas */}
      <div
        className={cn(
          'w-full h-[400px] border border-border overflow-hidden',
          'cursor-crosshair',
          'bg-gradient-to-b from-cream to-cream-dark'
        )}
      >
        <Canvas
          camera={{
            position: [0, 0.5, 4.2],
            fov: 50,
            near: 0.1,
            far: 100,
          }}
          style={{ background: 'transparent' }}
          gl={{ antialias: true, alpha: true }}
        >
          <Scene
            viewState={viewState}
            onSelectionChange={handleSelectionChange}
            clearTrigger={clearTrigger}
          />
        </Canvas>
      </div>

      {/* Date labels below canvas */}
      <div className="flex justify-between mt-2 px-2">
        <span className="text-xs font-mono text-text">
          {formatDateForZoom(viewState.viewStart, viewState.zoomLevel)}
        </span>
        <span className="text-xs font-mono text-text-muted">
          Drag to select range
        </span>
        <span className="text-xs font-mono text-text">
          {formatDateForZoom(viewState.viewEnd, viewState.zoomLevel)}
        </span>
      </div>

      {/* Selected range display */}
      {selectedRange && (
        <div className="mt-4 flex items-center justify-center gap-2 text-sm font-mono">
          <span className="text-text">
            {selectedRange.start.toLocaleString()}
          </span>
          <span className="text-text-muted">→</span>
          <span className="text-text">
            {selectedRange.end.toLocaleString()}
          </span>
          <button
            onClick={handleZoomIn}
            className={cn(
              'ml-4 px-3 py-1 text-xs',
              'bg-charcoal border border-charcoal',
              'text-cream hover:bg-charcoal-light',
              'transition-colors duration-150'
            )}
          >
            Zoom In
          </button>
          <button
            onClick={() => {
              setSelectedRange(null);
              setClearTrigger(t => t + 1);
              onSelectionChange?.(null);
            }}
            className={cn(
              'px-2 py-1 text-xs',
              'bg-cream-dark border border-border',
              'text-text-muted hover:text-text hover:border-border-dark',
              'transition-colors duration-150'
            )}
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}

Timeline3D.displayName = 'Timeline3D';
