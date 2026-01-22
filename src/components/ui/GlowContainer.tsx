'use client';

import { cn } from '@/lib/utils';

export type GlowColor = 'cyan' | 'magenta' | 'purple';

export interface GlowContainerProps {
  children: React.ReactNode;
  className?: string;
  color?: GlowColor;
  intensity?: 'subtle' | 'normal' | 'intense';
  animated?: boolean;
}

export function GlowContainer({
  children,
  className,
}: GlowContainerProps) {
  return (
    <div
      className={cn(
        'bg-white border border-border',
        className
      )}
    >
      {children}
    </div>
  );
}

GlowContainer.displayName = 'GlowContainer';
