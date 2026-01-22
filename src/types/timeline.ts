export interface TimeRange {
  start: Date;
  end: Date;
}

export interface SelectionPosition {
  startPercent: number;
  endPercent: number;
}

export interface TimelineConfig {
  minDate: Date;
  maxDate: Date;
  minSelectionMs?: number;
}

export type DragTarget = 'start' | 'end' | 'selection' | null;

export interface TimelineState {
  selection: SelectionPosition | null;
  timeRange: TimeRange | null;
  isDragging: boolean;
  dragTarget: DragTarget;
  hoverPercent: number | null;
}

export interface TimelineHandlers {
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseUp: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave: (e: React.MouseEvent<HTMLDivElement>) => void;
  onTouchStart: (e: React.TouchEvent<HTMLDivElement>) => void;
  onTouchMove: (e: React.TouchEvent<HTMLDivElement>) => void;
  onTouchEnd: (e: React.TouchEvent<HTMLDivElement>) => void;
  onHandleDragStart: (target: 'start' | 'end') => void;
  onSelectionDragStart: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
}

export interface UseTimelineSelectionReturn {
  state: TimelineState;
  handlers: TimelineHandlers;
  trackRef: React.RefObject<HTMLDivElement | null>;
  clearSelection: () => void;
}
