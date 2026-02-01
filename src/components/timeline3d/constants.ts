// Colors matching the neo-editorial brutalist theme
export const COLORS = {
  cream: '#FAF7F2',
  creamDark: '#EBE6DB',
  creamAccent: '#E5DFD3',
  border: '#0a0a0a',
  borderLight: '#d4cfc4',
  charcoal: '#0a0a0a',
  charcoalLight: '#2a2a2a',
  // 3D specific - high contrast
  bladeIdle: '#c4bfb4',
  bladeSelected: '#0a0a0a',
  bladeHovered: '#6a6560',
  glowColor: '#0a0a0a',
  ambient: '#FAF7F2',
  // Rod material
  rodColor: '#b8b3a8',
  rodMetalness: 0.3,
  rodRoughness: 0.7,
  // Handle color
  handleColor: '#0a0a0a',
};

// Rod geometry
export const ROD_RADIUS = 0.02;

// Geometry constants
export const ROD_LENGTH = 8;

// Blade (time marker) constants
export const BLADE_HEIGHT_IDLE = 0.3;
export const BLADE_HEIGHT_SELECTED = 0.9;
export const BLADE_DEPTH = 0.015; // Slightly thicker for more presence

// Handle constants
export const HANDLE_RADIUS = 0.1;

// Animation
export const SPRING_CONFIG = {
  stiffness: 400,
  damping: 35,
  mass: 0.4,
};

// Marker counts per zoom level - dense for dramatic effect
export const MARKER_COUNTS: Record<string, number> = {
  years: 60,
  months: 72,
  weeks: 56,
  days: 62,
  hours: 48,
};
