# Ethereum Transaction Viewer - Product Requirements Document

## Overview
Build a cyberpunk-themed web app with a horizontal timeline where users can click-and-drag to select a time period for viewing Ethereum transactions.

## Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS with custom cyberpunk theme
- **Visual Style:** Dark/cyberpunk (dark backgrounds, neon cyan/magenta/purple accents, glow effects)
- **Additional Libraries:** clsx, tailwind-merge, framer-motion, date-fns

## Project Structure
```
src/
├── app/
│   ├── layout.tsx          # Root layout with fonts
│   ├── page.tsx            # Main page with timeline
│   └── globals.css         # Global styles + neon utilities
├── components/
│   ├── timeline/
│   │   ├── Timeline.tsx        # Main container
│   │   ├── TimelineTrack.tsx   # Horizontal track bar
│   │   ├── TimelineSelection.tsx # Highlighted selection area
│   │   ├── TimelineHandle.tsx  # Draggable left/right handles
│   │   ├── TimelineMarkers.tsx # Time tick marks/labels
│   │   └── TimelineTooltip.tsx # Hover date tooltip
│   └── ui/
│       ├── GlowContainer.tsx   # Neon glow wrapper
│       └── GridBackground.tsx  # Circuit grid pattern
├── hooks/
│   └── useTimelineSelection.ts # Core drag/selection logic
├── lib/
│   ├── utils.ts            # cn() classname helper
│   └── timeUtils.ts        # Date/position calculations
└── types/
    └── timeline.ts         # TypeScript interfaces
```

## Implementation Tasks

```json
[
  {
    "id": 1,
    "phase": "Project Setup",
    "task": "Initialize Next.js project with TypeScript and Tailwind",
    "passes": false
  },
  {
    "id": 2,
    "phase": "Project Setup",
    "task": "Install dependencies (clsx, tailwind-merge, framer-motion, date-fns)",
    "passes": false
  },
  {
    "id": 3,
    "phase": "Project Setup",
    "task": "Configure tailwind.config.ts with cyberpunk theme (neon colors, dark backgrounds, glow box-shadows, custom animations)",
    "passes": false
  },
  {
    "id": 4,
    "phase": "Project Setup",
    "task": "Set up globals.css with Google Fonts (Orbitron, JetBrains Mono) and utility classes",
    "passes": false
  },
  {
    "id": 5,
    "phase": "Core Timeline Hook",
    "task": "Create useTimelineSelection hook with mouse/touch event handlers, selection state, position calculation, and handle drag logic",
    "passes": false
  },
  {
    "id": 6,
    "phase": "Timeline Components",
    "task": "Build TimelineTrack component - horizontal bar with gradient background and glow border",
    "passes": false
  },
  {
    "id": 7,
    "phase": "Timeline Components",
    "task": "Build TimelineSelection component - positioned overlay with animated gradient fill",
    "passes": false
  },
  {
    "id": 8,
    "phase": "Timeline Components",
    "task": "Build TimelineHandle component - draggable grips with pulse animation on active",
    "passes": false
  },
  {
    "id": 9,
    "phase": "Timeline Components",
    "task": "Build TimelineMarkers component - time labels below track",
    "passes": false
  },
  {
    "id": 10,
    "phase": "Timeline Components",
    "task": "Build TimelineTooltip component - shows date on hover",
    "passes": false
  },
  {
    "id": 11,
    "phase": "Assembly & Page",
    "task": "Compose Timeline component from all parts",
    "passes": false
  },
  {
    "id": 12,
    "phase": "Assembly & Page",
    "task": "Add framer-motion animations for smooth handle dragging",
    "passes": false
  },
  {
    "id": 13,
    "phase": "Assembly & Page",
    "task": "Build main page with header, Ethereum address input, timeline component, and grid background",
    "passes": false
  },
  {
    "id": 14,
    "phase": "Polish",
    "task": "Add responsive design for mobile (larger touch targets)",
    "passes": false
  },
  {
    "id": 15,
    "phase": "Polish",
    "task": "Implement keyboard accessibility (arrow keys for selection)",
    "passes": false
  },
  {
    "id": 16,
    "phase": "Polish",
    "task": "Test and refine animations",
    "passes": false
  }
]
```

## Key Component Details

### Timeline Selection Interaction
1. User clicks anywhere on track → sets selection start point
2. User drags → selection extends from click point to cursor
3. On release → handles appear at selection edges
4. Drag handles → fine-tune selection range

### Visual States
| State | Appearance |
|-------|------------|
| Idle | Dim track with subtle pulse |
| Hover | Glow follows cursor |
| Selecting | Growing highlight with intensifying glow |
| Selected | Full highlight + visible handles |
| Adjusting | Active handle pulses and scales up |

## Critical Files
1. `tailwind.config.ts` - Cyberpunk theme foundation
2. `src/hooks/useTimelineSelection.ts` - Core interaction logic
3. `src/components/timeline/Timeline.tsx` - Main orchestrator
4. `src/app/globals.css` - Neon effects and base styles
5. `src/components/timeline/TimelineHandle.tsx` - Drag interaction

## Verification
- Run `npm run dev` and verify the app loads
- Test timeline click-and-drag selection works smoothly
- Verify handles can adjust selection after initial creation
- Check responsive behavior on mobile viewport
- Confirm neon glow effects render correctly
