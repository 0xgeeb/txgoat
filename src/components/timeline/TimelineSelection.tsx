'use client';

import { cn } from '@/lib/utils';
import type { SelectionPosition } from '@/types/timeline';

export interface TimelineSelectionProps {
  selection: SelectionPosition;
  isSelecting?: boolean;
  isDragging?: boolean;
  className?: string;
  onMouseDown?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export function TimelineSelection({
  selection,
  isSelecting = false,
  isDragging = false,
  className,
  onMouseDown,
}: TimelineSelectionProps) {
  const { startPercent, endPercent } = selection;
  const left = Math.min(startPercent, endPercent);
  const width = Math.abs(endPercent - startPercent);

  // Don't render if selection is too small
  if (width < 0.1) {
    return null;
  }

  return (
    <div
      className={cn(
        // Positioning
        'absolute top-0 bottom-0 pointer-events-auto',
        // Allow cursor to pass through when not actively dragging
        !isDragging && 'cursor-grab',
        isDragging && 'cursor-grabbing',
        className
      )}
      style={{
        left: `${left}%`,
        width: `${width}%`,
      }}
      onMouseDown={onMouseDown}
    >
      {/* Main selection fill with animated gradient */}
      <div
        className={cn(
          'absolute inset-0 rounded-sm overflow-hidden',
          // Transition for smooth state changes
          'transition-all duration-150'
        )}
      >
        {/* Animated gradient background */}
        <div
          className={cn(
            'absolute inset-0',
            // Base gradient
            'bg-gradient-to-r from-neon-cyan/30 via-neon-purple/40 to-neon-magenta/30',
            // Selecting state: intensifying glow
            isSelecting && 'from-neon-cyan/40 via-neon-purple/50 to-neon-magenta/40',
            // Animation for the gradient
            !isSelecting && 'bg-gradient-neon-animated'
          )}
          style={{
            backgroundSize: '200% 100%',
            animation: isSelecting ? 'none' : 'gradient-shift 3s ease infinite',
          }}
        />

        {/* Inner glow effect */}
        <div
          className={cn(
            'absolute inset-0',
            'shadow-[inset_0_0_15px_rgba(0,255,255,0.3),inset_0_0_30px_rgba(191,0,255,0.2)]',
            isSelecting && 'shadow-[inset_0_0_20px_rgba(0,255,255,0.4),inset_0_0_40px_rgba(191,0,255,0.3)]'
          )}
        />

        {/* Scanline effect for cyberpunk aesthetic */}
        <div
          className={cn(
            'absolute inset-0 pointer-events-none opacity-20',
            'bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.3)_2px,rgba(0,0,0,0.3)_4px)]'
          )}
        />
      </div>

      {/* Left edge glow */}
      <div
        className={cn(
          'absolute left-0 top-0 bottom-0 w-px',
          'bg-neon-cyan',
          'shadow-[0_0_8px_rgba(0,255,255,0.8),0_0_16px_rgba(0,255,255,0.4)]',
          isSelecting && 'shadow-[0_0_12px_rgba(0,255,255,1),0_0_24px_rgba(0,255,255,0.6)]'
        )}
      />

      {/* Right edge glow */}
      <div
        className={cn(
          'absolute right-0 top-0 bottom-0 w-px',
          'bg-neon-magenta',
          'shadow-[0_0_8px_rgba(255,0,255,0.8),0_0_16px_rgba(255,0,255,0.4)]',
          isSelecting && 'shadow-[0_0_12px_rgba(255,0,255,1),0_0_24px_rgba(255,0,255,0.6)]'
        )}
      />

      {/* Top edge highlight */}
      <div
        className={cn(
          'absolute top-0 left-0 right-0 h-px',
          'bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-magenta',
          'opacity-60',
          isSelecting && 'opacity-80'
        )}
      />

      {/* Bottom edge highlight */}
      <div
        className={cn(
          'absolute bottom-0 left-0 right-0 h-px',
          'bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-magenta',
          'opacity-60',
          isSelecting && 'opacity-80'
        )}
      />
    </div>
  );
}

TimelineSelection.displayName = 'TimelineSelection';
