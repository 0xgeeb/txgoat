'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import {
  TimelineState,
  TimelineConfig,
  SelectionPosition,
  UseTimelineSelectionReturn,
} from '@/types/timeline';
import {
  getPositionPercent,
  normalizeSelection,
  selectionToTimeRange,
  clampPercent,
} from '@/lib/timeUtils';

const MIN_SELECTION_PERCENT = 1;
const KEYBOARD_STEP_PERCENT = 1;

export function useTimelineSelection(
  config: TimelineConfig
): UseTimelineSelectionReturn {
  const trackRef = useRef<HTMLDivElement | null>(null);

  const [state, setState] = useState<TimelineState>({
    selection: null,
    timeRange: null,
    isDragging: false,
    dragTarget: null,
    hoverPercent: null,
  });

  const dragStartRef = useRef<{
    percent: number;
    initialSelection: SelectionPosition | null;
  } | null>(null);

  const getTrackRect = useCallback((): DOMRect | null => {
    return trackRef.current?.getBoundingClientRect() ?? null;
  }, []);

  const updateSelection = useCallback(
    (newSelection: SelectionPosition | null) => {
      const normalized = newSelection ? normalizeSelection(newSelection) : null;
      const timeRange = normalized
        ? selectionToTimeRange(normalized, config)
        : null;

      setState((prev) => ({
        ...prev,
        selection: normalized,
        timeRange,
      }));
    },
    [config]
  );

  const clearSelection = useCallback(() => {
    setState((prev) => ({
      ...prev,
      selection: null,
      timeRange: null,
      isDragging: false,
      dragTarget: null,
    }));
    dragStartRef.current = null;
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.button !== 0) return;
      const trackRect = getTrackRect();
      if (!trackRect) return;

      const percent = getPositionPercent(e.clientX, trackRect);

      dragStartRef.current = {
        percent,
        initialSelection: state.selection,
      };

      setState((prev) => ({
        ...prev,
        isDragging: true,
        dragTarget: 'selection',
        selection: {
          startPercent: percent,
          endPercent: percent,
        },
      }));
    },
    [getTrackRect, state.selection]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const trackRect = getTrackRect();
      if (!trackRect) return;

      const percent = getPositionPercent(e.clientX, trackRect);

      if (!state.isDragging) {
        setState((prev) => ({
          ...prev,
          hoverPercent: percent,
        }));
        return;
      }

      if (!dragStartRef.current) return;

      const { dragTarget } = state;

      if (dragTarget === 'selection' && !state.selection) {
        const startPercent = dragStartRef.current.percent;
        updateSelection({
          startPercent,
          endPercent: percent,
        });
      } else if (dragTarget === 'start' && state.selection) {
        const newStart = clampPercent(percent);
        if (state.selection.endPercent - newStart >= MIN_SELECTION_PERCENT) {
          updateSelection({
            startPercent: newStart,
            endPercent: state.selection.endPercent,
          });
        }
      } else if (dragTarget === 'end' && state.selection) {
        const newEnd = clampPercent(percent);
        if (newEnd - state.selection.startPercent >= MIN_SELECTION_PERCENT) {
          updateSelection({
            startPercent: state.selection.startPercent,
            endPercent: newEnd,
          });
        }
      } else if (dragTarget === 'selection' && state.selection) {
        const startPercent = dragStartRef.current.percent;
        updateSelection({
          startPercent,
          endPercent: percent,
        });
      }
    },
    [getTrackRect, state.isDragging, state.dragTarget, state.selection, updateSelection]
  );

  const handleMouseUp = useCallback(() => {
    if (state.isDragging && state.selection) {
      const width = Math.abs(
        state.selection.endPercent - state.selection.startPercent
      );
      if (width < MIN_SELECTION_PERCENT) {
        clearSelection();
      } else {
        updateSelection(state.selection);
      }
    }

    setState((prev) => ({
      ...prev,
      isDragging: false,
      dragTarget: null,
    }));
    dragStartRef.current = null;
  }, [state.isDragging, state.selection, clearSelection, updateSelection]);

  const handleMouseLeave = useCallback(() => {
    setState((prev) => ({
      ...prev,
      hoverPercent: null,
    }));

    if (state.isDragging) {
      handleMouseUp();
    }
  }, [state.isDragging, handleMouseUp]);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (e.touches.length !== 1) return;
      const touch = e.touches[0];
      const trackRect = getTrackRect();
      if (!trackRect) return;

      const percent = getPositionPercent(touch.clientX, trackRect);

      dragStartRef.current = {
        percent,
        initialSelection: state.selection,
      };

      setState((prev) => ({
        ...prev,
        isDragging: true,
        dragTarget: 'selection',
        selection: {
          startPercent: percent,
          endPercent: percent,
        },
      }));
    },
    [getTrackRect, state.selection]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (e.touches.length !== 1) return;
      const touch = e.touches[0];
      const trackRect = getTrackRect();
      if (!trackRect) return;

      const percent = getPositionPercent(touch.clientX, trackRect);

      if (!state.isDragging || !dragStartRef.current) return;

      const { dragTarget } = state;

      if (dragTarget === 'selection') {
        const startPercent = dragStartRef.current.percent;
        updateSelection({
          startPercent,
          endPercent: percent,
        });
      } else if (dragTarget === 'start' && state.selection) {
        const newStart = clampPercent(percent);
        if (state.selection.endPercent - newStart >= MIN_SELECTION_PERCENT) {
          updateSelection({
            startPercent: newStart,
            endPercent: state.selection.endPercent,
          });
        }
      } else if (dragTarget === 'end' && state.selection) {
        const newEnd = clampPercent(percent);
        if (newEnd - state.selection.startPercent >= MIN_SELECTION_PERCENT) {
          updateSelection({
            startPercent: state.selection.startPercent,
            endPercent: newEnd,
          });
        }
      }
    },
    [getTrackRect, state.isDragging, state.dragTarget, state.selection, updateSelection]
  );

  const handleTouchEnd = useCallback(() => {
    handleMouseUp();
  }, [handleMouseUp]);

  const handleHandleDragStart = useCallback(
    (target: 'start' | 'end') => {
      if (!state.selection) return;

      dragStartRef.current = {
        percent: target === 'start'
          ? state.selection.startPercent
          : state.selection.endPercent,
        initialSelection: state.selection,
      };

      setState((prev) => ({
        ...prev,
        isDragging: true,
        dragTarget: target,
      }));
    },
    [state.selection]
  );

  const handleSelectionDragStart = useCallback(() => {
    if (!state.selection) return;

    const centerPercent =
      (state.selection.startPercent + state.selection.endPercent) / 2;

    dragStartRef.current = {
      percent: centerPercent,
      initialSelection: state.selection,
    };

    setState((prev) => ({
      ...prev,
      isDragging: true,
      dragTarget: 'selection',
    }));
  }, [state.selection]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (!state.selection) return;

      const { startPercent, endPercent } = state.selection;
      let newSelection: SelectionPosition | null = null;

      switch (e.key) {
        case 'ArrowLeft':
          if (e.shiftKey) {
            newSelection = {
              startPercent: clampPercent(startPercent - KEYBOARD_STEP_PERCENT),
              endPercent,
            };
          } else {
            const shift = KEYBOARD_STEP_PERCENT;
            newSelection = {
              startPercent: clampPercent(startPercent - shift),
              endPercent: clampPercent(endPercent - shift),
            };
          }
          e.preventDefault();
          break;
        case 'ArrowRight':
          if (e.shiftKey) {
            newSelection = {
              startPercent,
              endPercent: clampPercent(endPercent + KEYBOARD_STEP_PERCENT),
            };
          } else {
            const shift = KEYBOARD_STEP_PERCENT;
            newSelection = {
              startPercent: clampPercent(startPercent + shift),
              endPercent: clampPercent(endPercent + shift),
            };
          }
          e.preventDefault();
          break;
        case 'Escape':
          clearSelection();
          e.preventDefault();
          break;
      }

      if (newSelection) {
        updateSelection(newSelection);
      }
    },
    [state.selection, clearSelection, updateSelection]
  );

  useEffect(() => {
    if (!state.isDragging) return;

    const handleGlobalMouseUp = () => {
      handleMouseUp();
    };

    const handleGlobalMouseMove = (e: MouseEvent) => {
      const trackRect = getTrackRect();
      if (!trackRect || !dragStartRef.current) return;

      const percent = getPositionPercent(e.clientX, trackRect);
      const { dragTarget } = state;

      if (dragTarget === 'selection') {
        const startPercent = dragStartRef.current.percent;
        updateSelection({
          startPercent,
          endPercent: percent,
        });
      } else if (dragTarget === 'start' && state.selection) {
        const newStart = clampPercent(percent);
        if (state.selection.endPercent - newStart >= MIN_SELECTION_PERCENT) {
          updateSelection({
            startPercent: newStart,
            endPercent: state.selection.endPercent,
          });
        }
      } else if (dragTarget === 'end' && state.selection) {
        const newEnd = clampPercent(percent);
        if (newEnd - state.selection.startPercent >= MIN_SELECTION_PERCENT) {
          updateSelection({
            startPercent: state.selection.startPercent,
            endPercent: newEnd,
          });
        }
      }
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);
    window.addEventListener('mousemove', handleGlobalMouseMove);

    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('mousemove', handleGlobalMouseMove);
    };
  }, [state.isDragging, state.dragTarget, state.selection, handleMouseUp, getTrackRect, updateSelection]);

  return {
    state,
    handlers: {
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseLeave,
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      onHandleDragStart: handleHandleDragStart,
      onSelectionDragStart: handleSelectionDragStart,
      onKeyDown: handleKeyDown,
    },
    trackRef,
    clearSelection,
  };
}
