'use client';

import { Html } from '@react-three/drei';
import { cn } from '@/lib/utils';

interface Tooltip3DProps {
  position: [number, number, number];
  visible: boolean;
  dateLabel: string;
  secondaryLabel?: string;
}

export function Tooltip3D({ position, visible, dateLabel, secondaryLabel }: Tooltip3DProps) {
  if (!visible) return null;

  return (
    <Html
      position={position}
      center
      style={{
        pointerEvents: 'none',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.15s ease',
      }}
    >
      <div
        className={cn(
          'px-3 py-2 bg-white border border-border',
          'text-center whitespace-nowrap',
          'transform -translate-y-full -mt-2'
        )}
      >
        <div className="text-sm font-mono font-medium text-text">
          {dateLabel}
        </div>
        {secondaryLabel && (
          <div className="text-xs font-mono text-text-muted">
            {secondaryLabel}
          </div>
        )}
        {/* Arrow */}
        <div
          className={cn(
            'absolute left-1/2 -translate-x-1/2 -bottom-1.5',
            'w-0 h-0',
            'border-l-[6px] border-l-transparent',
            'border-r-[6px] border-r-transparent',
            'border-t-[6px] border-t-border'
          )}
        />
        <div
          className={cn(
            'absolute left-1/2 -translate-x-1/2 -bottom-1',
            'w-0 h-0',
            'border-l-[5px] border-l-transparent',
            'border-r-[5px] border-r-transparent',
            'border-t-[5px] border-t-white'
          )}
        />
      </div>
    </Html>
  );
}

Tooltip3D.displayName = 'Tooltip3D';
