import { TimeRange, SelectionPosition, TimelineConfig } from '@/types/timeline';

export function percentToDate(percent: number, config: TimelineConfig): Date {
  const { minDate, maxDate } = config;
  const totalMs = maxDate.getTime() - minDate.getTime();
  const offsetMs = totalMs * (percent / 100);
  return new Date(minDate.getTime() + offsetMs);
}

export function dateToPercent(date: Date, config: TimelineConfig): number {
  const { minDate, maxDate } = config;
  const totalMs = maxDate.getTime() - minDate.getTime();
  const offsetMs = date.getTime() - minDate.getTime();
  return (offsetMs / totalMs) * 100;
}

export function selectionToTimeRange(
  selection: SelectionPosition,
  config: TimelineConfig
): TimeRange {
  return {
    start: percentToDate(selection.startPercent, config),
    end: percentToDate(selection.endPercent, config),
  };
}

export function timeRangeToSelection(
  timeRange: TimeRange,
  config: TimelineConfig
): SelectionPosition {
  return {
    startPercent: dateToPercent(timeRange.start, config),
    endPercent: dateToPercent(timeRange.end, config),
  };
}

export function clampPercent(percent: number): number {
  return Math.max(0, Math.min(100, percent));
}

export function getPositionPercent(
  clientX: number,
  trackRect: DOMRect
): number {
  const relativeX = clientX - trackRect.left;
  const percent = (relativeX / trackRect.width) * 100;
  return clampPercent(percent);
}

export function normalizeSelection(
  selection: SelectionPosition
): SelectionPosition {
  const { startPercent, endPercent } = selection;
  return {
    startPercent: Math.min(startPercent, endPercent),
    endPercent: Math.max(startPercent, endPercent),
  };
}

export function isValidSelection(
  selection: SelectionPosition,
  config: TimelineConfig
): boolean {
  const { minSelectionMs = 0 } = config;
  if (minSelectionMs === 0) return true;

  const timeRange = selectionToTimeRange(selection, config);
  const selectionMs = timeRange.end.getTime() - timeRange.start.getTime();
  return selectionMs >= minSelectionMs;
}
