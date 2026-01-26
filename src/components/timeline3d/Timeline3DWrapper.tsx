'use client';

import dynamic from 'next/dynamic';

// Dynamically import Timeline3D with no SSR
const Timeline3DInner = dynamic(
  () => import('./Timeline3D').then(mod => mod.Timeline3D),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-48 border border-border bg-cream-dark flex items-center justify-center">
        <span className="text-text-muted text-sm">Loading timeline...</span>
      </div>
    ),
  }
);

export interface TimeRange {
  start: Date;
  end: Date;
}

export interface Timeline3DWrapperProps {
  config: {
    minDate: Date;
    maxDate: Date;
    minSelectionMs?: number;
  };
  className?: string;
  onSelectionChange?: (range: TimeRange | null) => void;
}

export function Timeline3DWrapper(props: Timeline3DWrapperProps) {
  return <Timeline3DInner {...props} />;
}
