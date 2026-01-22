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

const glowStyles: Record<GlowColor, Record<string, string>> = {
  cyan: {
    border: 'border-neon-cyan/30',
    shadow: 'shadow-[0_0_15px_rgba(0,255,255,0.2)]',
    shadowIntense: 'shadow-[0_0_25px_rgba(0,255,255,0.3),0_0_50px_rgba(0,255,255,0.15)]',
    shadowSubtle: 'shadow-[0_0_10px_rgba(0,255,255,0.1)]',
    hoverShadow: 'hover:shadow-[0_0_25px_rgba(0,255,255,0.3)]',
    gradient: 'from-neon-cyan/5 to-transparent',
  },
  magenta: {
    border: 'border-neon-magenta/30',
    shadow: 'shadow-[0_0_15px_rgba(255,0,255,0.2)]',
    shadowIntense: 'shadow-[0_0_25px_rgba(255,0,255,0.3),0_0_50px_rgba(255,0,255,0.15)]',
    shadowSubtle: 'shadow-[0_0_10px_rgba(255,0,255,0.1)]',
    hoverShadow: 'hover:shadow-[0_0_25px_rgba(255,0,255,0.3)]',
    gradient: 'from-neon-magenta/5 to-transparent',
  },
  purple: {
    border: 'border-neon-purple/30',
    shadow: 'shadow-[0_0_15px_rgba(168,85,247,0.2)]',
    shadowIntense: 'shadow-[0_0_25px_rgba(168,85,247,0.3),0_0_50px_rgba(168,85,247,0.15)]',
    shadowSubtle: 'shadow-[0_0_10px_rgba(168,85,247,0.1)]',
    hoverShadow: 'hover:shadow-[0_0_25px_rgba(168,85,247,0.3)]',
    gradient: 'from-neon-purple/5 to-transparent',
  },
};

export function GlowContainer({
  children,
  className,
  color = 'cyan',
  intensity = 'normal',
  animated = false,
}: GlowContainerProps) {
  const styles = glowStyles[color];

  const shadowClass = {
    subtle: styles.shadowSubtle,
    normal: styles.shadow,
    intense: styles.shadowIntense,
  }[intensity];

  return (
    <div
      className={cn(
        'relative rounded-lg bg-cyber-surface border transition-shadow duration-300',
        styles.border,
        shadowClass,
        styles.hoverShadow,
        animated && 'animate-glow-pulse',
        className
      )}
    >
      {/* Inner gradient glow effect */}
      <div
        className={cn(
          'absolute inset-0 rounded-lg pointer-events-none bg-gradient-to-b opacity-50',
          styles.gradient
        )}
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

GlowContainer.displayName = 'GlowContainer';
