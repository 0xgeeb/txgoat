'use client';

import dynamic from 'next/dynamic';

// Dynamically import Timeline3D with no SSR
const Timeline3DInner = dynamic(
  () => import('./Timeline3D').then(mod => mod.Timeline3D),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-48 border-2 border-charcoal bg-cream-dark flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="flex flex-col items-center gap-3 relative">
          <div className="w-6 h-6 border-2 border-charcoal border-t-transparent animate-spin" />
          <span className="text-text-muted text-[10px] uppercase tracking-widest font-mono">
            Loading Timeline
          </span>
        </div>
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
  compact?: boolean;
  onSelectionChange?: (range: TimeRange | null) => void;
}

export function Timeline3DWrapper(props: Timeline3DWrapperProps) {
  return <Timeline3DInner {...props} />;
}
