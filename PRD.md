# Ethereum Transaction Viewer - Product Requirements Document

## Overview
Build a modern minimal web app with a horizontal timeline where users can click-and-drag to select a time period for viewing Ethereum transactions.

## Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS with cream/minimal theme
- **Visual Style:** Cream background (#FAF7F2), charcoal accents (#333333), sharp borders, no glow effects
- **Additional Libraries:** clsx, tailwind-merge, framer-motion, date-fns

## Project Structure
```
src/
├── app/
│   ├── layout.tsx          # Root layout with fonts
│   ├── page.tsx            # Main page with timeline
│   └── globals.css         # Global styles + minimal utilities
├── components/
│   ├── timeline/
│   │   ├── Timeline.tsx        # Main container
│   │   ├── TimelineTrack.tsx   # Horizontal track bar
│   │   ├── TimelineSelection.tsx # Highlighted selection area
│   │   ├── TimelineHandle.tsx  # Draggable left/right handles
│   │   ├── TimelineMarkers.tsx # Time tick marks/labels
│   │   └── TimelineTooltip.tsx # Hover date tooltip
│   └── ui/
│       ├── Container.tsx       # Bordered container wrapper
│       └── Background.tsx      # Clean background
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
    "task": "Configure tailwind.config.ts with minimal theme (cream background, charcoal accents, sharp borders)",
    "passes": false
  },
  {
    "id": 4,
    "phase": "Project Setup",
    "task": "Set up globals.css with Google Fonts (Inter) and utility classes",
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
    "task": "Build TimelineTrack component - horizontal bar with sharp border",
    "passes": false
  },
  {
    "id": 7,
    "phase": "Timeline Components",
    "task": "Build TimelineSelection component - positioned overlay with solid fill",
    "passes": false
  },
  {
    "id": 8,
    "phase": "Timeline Components",
    "task": "Build TimelineHandle component - draggable grips with smooth animation",
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
    "phase": "Redesign",
    "task": "Redesign app with cream background, modern minimal style, sharp borders, and txgoat logo",
    "passes": false
  },
  {
    "id": 15,
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
| Idle | Track with subtle border |
| Hover | Cursor indicator visible |
| Selecting | Growing highlight with solid fill |
| Selected | Full highlight + visible handles |
| Adjusting | Active handle darkens and scales up |

## Critical Files
1. `tailwind.config.ts` - Minimal theme foundation
2. `src/hooks/useTimelineSelection.ts` - Core interaction logic
3. `src/components/timeline/Timeline.tsx` - Main orchestrator
4. `src/app/globals.css` - Base styles
5. `src/components/timeline/TimelineHandle.tsx` - Drag interaction

## Verification
- Run `npm run dev` and verify the app loads with cream background
- Confirm logo displays in header
- Test timeline click-and-drag selection works smoothly
- Verify handles can adjust selection after initial creation
- Confirm minimal style with no glow effects
