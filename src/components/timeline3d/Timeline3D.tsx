'use client';

import { useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { cn } from '@/lib/utils';
import { Scene } from './Scene';
import { getZoomLevel, formatDateForZoom, dateToPosition, positionToPercent } from './utils';
import type { TimeRange, ViewState, Timeline3DConfig } from './types';
import { format } from 'date-fns';

export interface Timeline3DProps {
  config: Timeline3DConfig;
  className?: string;
  compact?: boolean;
  onSelectionChange?: (range: TimeRange | null) => void;
}

export function Timeline3D({
  config,
  className,
  compact,
  onSelectionChange,
}: Timeline3DProps) {
  // View state tracks the current zoom level and visible date range
  const [viewState, setViewState] = useState<ViewState>(() => ({
    zoomLevel: getZoomLevel(config.minDate, config.maxDate),
    viewStart: config.minDate,
    viewEnd: config.maxDate,
  }));

  // History of view states for back navigation
  const [viewHistory, setViewHistory] = useState<ViewState[]>([]);

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
      setViewHistory(h => [...h, viewState]);
      setViewState({
        zoomLevel: getZoomLevel(selectedRange.start, selectedRange.end),
        viewStart: selectedRange.start,
        viewEnd: selectedRange.end,
      });
      setSelectedRange(null);
      setClearTrigger(t => t + 1);
      onSelectionChange?.(null);
    }
  }, [selectedRange, onSelectionChange, viewState]);

  // Go back one zoom level
  const handleBack = useCallback(() => {
    if (viewHistory.length > 0) {
      const newHistory = [...viewHistory];
      const previousView = newHistory.pop()!;
      setViewHistory(newHistory);
      setViewState(previousView);
      setSelectedRange(null);
      setClearTrigger(t => t + 1);
      onSelectionChange?.(null);
    }
  }, [viewHistory, onSelectionChange]);

  // Reset to full range
  const handleReset = useCallback(() => {
    setViewHistory([]);
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
        <span className="text-xs font-mono text-text uppercase tracking-wider">
          {format(viewState.viewStart, 'MMM yyyy')} — {format(viewState.viewEnd, 'MMM yyyy')}
        </span>
        {isZoomed && (
          <div className="flex gap-2">
            {viewHistory.length > 0 && (
              <button
                onClick={handleBack}
                className="btn-secondary text-[10px] px-2 py-1"
              >
                Back
              </button>
            )}
            <button
              onClick={handleReset}
              className="btn-secondary text-[10px] px-2 py-1"
            >
              Reset
            </button>
          </div>
        )}
      </div>

      {/* 3D Canvas */}
      <div
        className={cn(
          'w-full h-[320px] border-2 border-charcoal overflow-hidden',
          'cursor-crosshair',
          'bg-cream-dark relative'
        )}
      >
        {/* Grid pattern background */}
        <div className="absolute inset-0 bg-grid opacity-50 pointer-events-none" />

        <Canvas
          key={compact ? 'compact' : 'full'}
          camera={{
            position: [0, 0.5, compact ? 10 : 4.2],
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
            initialSelection={selectedRange ? {
              startPercent: positionToPercent(dateToPosition(selectedRange.start, viewState.viewStart, viewState.viewEnd)),
              endPercent: positionToPercent(dateToPosition(selectedRange.end, viewState.viewStart, viewState.viewEnd)),
            } : null}
          />
        </Canvas>
      </div>

      {/* Date labels below canvas */}
      <div className="flex justify-between mt-3 px-1">
        <span className="text-xs font-mono text-text uppercase tracking-wider">
          {formatDateForZoom(viewState.viewStart, viewState.zoomLevel)}
        </span>
        <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest">
          Drag to Select
        </span>
        <span className="text-xs font-mono text-text uppercase tracking-wider">
          {formatDateForZoom(viewState.viewEnd, viewState.zoomLevel)}
        </span>
      </div>

      {/* Selected range display */}
      {selectedRange && (
        <div className="mt-3 p-3 border-2 border-charcoal bg-cream">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-text font-medium">
                {selectedRange.start.toLocaleDateString()}
              </span>
              <span className="text-text-muted">&rarr;</span>
              <span className="text-text font-medium">
                {selectedRange.end.toLocaleDateString()}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleZoomIn}
                className="btn text-[10px] px-2 py-1"
              >
                Zoom
              </button>
              <button
                onClick={() => {
                  setSelectedRange(null);
                  setClearTrigger(t => t + 1);
                  onSelectionChange?.(null);
                }}
                className="btn-secondary text-[10px] px-2 py-1"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

Timeline3D.displayName = 'Timeline3D';
