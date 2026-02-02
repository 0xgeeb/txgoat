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
      style={{
        pointerEvents: 'none',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.2s ease-out',
        transform: 'translateX(-50%)',
      }}
    >
      <div
        className={cn(
          'px-4 py-2.5 bg-charcoal/95 backdrop-blur-sm',
          'rounded-sm shadow-lg shadow-black/20',
          'text-center whitespace-nowrap',
          'transform -translate-y-full -mt-3',
          'ring-1 ring-white/10'
        )}
      >
        <div className="text-sm font-mono font-medium text-cream tracking-wide">
          {dateLabel}
        </div>
        {secondaryLabel && (
          <div className="text-xs font-mono text-cream/60 mt-0.5">
            {secondaryLabel}
          </div>
        )}
        {/* Arrow */}
        <div
          className={cn(
            'absolute left-1/2 -translate-x-1/2 -bottom-2',
            'w-0 h-0',
            'border-l-[7px] border-l-transparent',
            'border-r-[7px] border-r-transparent',
            'border-t-[8px] border-t-charcoal/95'
          )}
        />
      </div>
    </Html>
  );
}

Tooltip3D.displayName = 'Tooltip3D';
