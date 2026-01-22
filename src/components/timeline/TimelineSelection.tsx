'use client';

import { motion } from 'framer-motion';
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
    <motion.div
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
      // Framer-motion animations for smooth position/size changes
      animate={{
        left: `${left}%`,
        width: `${width}%`,
      }}
      initial={false}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
        mass: 0.5,
      }}
      onMouseDown={onMouseDown}
    >
      {/* Main selection fill */}
      <div
        className={cn(
          'absolute inset-0 overflow-hidden',
          'bg-selection',
          // Transition for smooth state changes
          'transition-all duration-150',
          isSelecting && 'bg-border'
        )}
      />

      {/* Left edge */}
      <div
        className={cn(
          'absolute left-0 top-0 bottom-0 w-px',
          'bg-charcoal'
        )}
      />

      {/* Right edge */}
      <div
        className={cn(
          'absolute right-0 top-0 bottom-0 w-px',
          'bg-charcoal'
        )}
      />

      {/* Top edge */}
      <div
        className={cn(
          'absolute top-0 left-0 right-0 h-px',
          'bg-charcoal'
        )}
      />

      {/* Bottom edge */}
      <div
        className={cn(
          'absolute bottom-0 left-0 right-0 h-px',
          'bg-charcoal'
        )}
      />
    </motion.div>
  );
}

TimelineSelection.displayName = 'TimelineSelection';
