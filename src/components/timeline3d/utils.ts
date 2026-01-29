import { format } from 'date-fns';
import type { ZoomLevel, ViewState, WasherData } from './types';
import { MARKER_COUNTS, ROD_LENGTH } from './constants';

// Convert a date to a position on the rod (-ROD_LENGTH/2 to ROD_LENGTH/2)
export function dateToPosition(date: Date, viewStart: Date, viewEnd: Date): number {
  const totalMs = viewEnd.getTime() - viewStart.getTime();
  const dateMs = date.getTime() - viewStart.getTime();
  const percent = dateMs / totalMs;
  return (percent - 0.5) * ROD_LENGTH;
}

// Convert a position on the rod to a date
export function positionToDate(position: number, viewStart: Date, viewEnd: Date): Date {
  const percent = (position / ROD_LENGTH) + 0.5;
  const totalMs = viewEnd.getTime() - viewStart.getTime();
  const dateMs = percent * totalMs;
  return new Date(viewStart.getTime() + dateMs);
}

// Convert X position in 3D space to percent (0-100)
export function positionToPercent(position: number): number {
  return ((position / ROD_LENGTH) + 0.5) * 100;
}

// Convert percent to position
export function percentToPosition(percent: number): number {
  return ((percent / 100) - 0.5) * ROD_LENGTH;
}

// Determine zoom level based on time span
export function getZoomLevel(startDate: Date, endDate: Date): ZoomLevel {
  const diffMs = endDate.getTime() - startDate.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffDays > 365 * 2) return 'years';
  if (diffDays > 90) return 'months';
  if (diffDays > 14) return 'weeks';
  if (diffDays > 1) return 'days';
  return 'hours';
}

// Generate marker data for the current view
export function generateMarkers(
  viewState: ViewState,
  selection: { startPercent: number; endPercent: number } | null,
  hoveredIndex: number | null
): WasherData[] {
  const { zoomLevel, viewStart, viewEnd } = viewState;
  const count = MARKER_COUNTS[zoomLevel];
  const markers: WasherData[] = [];

  const totalMs = viewEnd.getTime() - viewStart.getTime();
  const stepMs = totalMs / (count - 1);

  for (let i = 0; i < count; i++) {
    const date = new Date(viewStart.getTime() + (stepMs * i));
    const position = dateToPosition(date, viewStart, viewEnd);
    const percent = positionToPercent(position);

    // Check if this washer is within selection
    let isSelected = false;
    if (selection) {
      const minPercent = Math.min(selection.startPercent, selection.endPercent);
      const maxPercent = Math.max(selection.startPercent, selection.endPercent);
      isSelected = percent >= minPercent && percent <= maxPercent;
    }

    markers.push({
      id: `marker-${i}`,
      position,
      date,
      scale: isSelected ? 1.8 : 1,
      isSelected,
      isHovered: hoveredIndex === i,
    });
  }

  return markers;
}

// Format date for tooltip based on zoom level
export function formatDateForZoom(date: Date, zoomLevel: ZoomLevel): string {
  switch (zoomLevel) {
    case 'years':
      return format(date, 'MMM yyyy');
    case 'months':
      return format(date, 'MMM yyyy');
    case 'weeks':
      return format(date, 'MMM d, yyyy');
    case 'days':
      return format(date, 'MMM d, yyyy');
    case 'hours':
      return format(date, 'MMM d, HH:mm');
    default:
      return format(date, 'MMM d, yyyy');
  }
}

// Get label for zoom level
export function getZoomLabel(zoomLevel: ZoomLevel): string {
  switch (zoomLevel) {
    case 'years': return 'Years';
    case 'months': return 'Months';
    case 'weeks': return 'Weeks';
    case 'days': return 'Days';
    case 'hours': return 'Hours';
    default: return '';
  }
}
