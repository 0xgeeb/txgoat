# TxGoat

Ethereum token transfer explorer with an interactive 3D timeline for date range selection.

## Tech Stack
- Next.js 14 (App Router), TypeScript
- Three.js + React Three Fiber (3D timeline)
- Viem (Ethereum client)
- Tailwind CSS
- Etherscan API + Mainnet RPC

## Key Files

### Core
- `src/app/page.tsx` - Main UI: form inputs, search, results display. Two modes: full-width form → sidebar after search.
- `src/hooks/useChainData.ts` - Blockchain scanning hook. Queries Transfer events, filters by wallet, returns transfers incrementally.
- `src/hooks/useTimelineSelection.ts` - Timeline drag/selection state management.

### 3D Timeline (`src/components/timeline3d/`)
- `Timeline3D.tsx` - Canvas wrapper, zoom controls
- `Scene.tsx` - Three.js scene, raycasting, pointer events
- `Blade.tsx` - Time marker geometry with animations
- `utils.ts` - Date ↔ 3D position conversions
- `constants.ts` - Colors, dimensions, marker counts

### Utilities
- `src/lib/timeUtils.ts` - Date/percent conversions for timeline

## Data Flow
1. User enters wallet + token addresses
2. User drags on 3D timeline to select date range
3. Search triggers `useChainData.getBlock()`
4. Hook fetches block numbers from Etherscan API for date range
5. Iterates blocks in steps of 2000, queries Transfer event logs
6. Filters transfers involving wallet, updates UI progressively

## Environment Variables
- `NEXT_PUBLIC_ETHERSCAN_API_KEY`
- `NEXT_PUBLIC_MAINNET_RPC`
