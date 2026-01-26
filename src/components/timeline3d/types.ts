export interface TimeRange {
  start: Date;
  end: Date;
}

export interface Timeline3DConfig {
  minDate: Date;
  maxDate: Date;
  minSelectionMs?: number;
}

export interface WasherData {
  id: string;
  position: number; // -1 to 1 along the rod
  date: Date;
  scale: number;
  isSelected: boolean;
  isHovered: boolean;
}

export interface SelectionState {
  startPercent: number;
  endPercent: number;
}

// Zoom level determines washer density and date granularity
export type ZoomLevel = 'years' | 'months' | 'weeks' | 'days' | 'hours';

export interface ViewState {
  zoomLevel: ZoomLevel;
  viewStart: Date;
  viewEnd: Date;
}
