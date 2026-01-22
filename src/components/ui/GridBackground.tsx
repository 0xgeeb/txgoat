'use client';

import { cn } from '@/lib/utils';

export interface GridBackgroundProps {
  className?: string;
  children?: React.ReactNode;
}

export function GridBackground({ className, children }: GridBackgroundProps) {
  return (
    <div className={cn('relative min-h-screen bg-cream', className)}>
      {children}
    </div>
  );
}

GridBackground.displayName = 'GridBackground';
