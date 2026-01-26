// Colors matching the cream/charcoal theme
export const COLORS = {
  cream: '#FAF7F2',
  creamDark: '#F0EDE6',
  border: '#E0DDD6',
  borderDark: '#C4C0B8',
  charcoal: '#333333',
  charcoalLight: '#555555',
  selection: '#E8E4DC',
  // 3D specific
  rodColor: '#B8B4AC',
  rodMetalness: 0.6,
  rodRoughness: 0.3,
  bladeIdle: '#D4D0C8',
  bladeSelected: '#2a2a2a',
  bladeHovered: '#666666',
  handleColor: '#1a1a1a',
  glowColor: '#ffffff',
  ambient: '#FFF8F0',
};

// Geometry constants
export const ROD_LENGTH = 8;
export const ROD_RADIUS = 0.06;

// Blade (time marker) constants
export const BLADE_WIDTH = 0.008;
export const BLADE_HEIGHT_IDLE = 0.18;
export const BLADE_HEIGHT_SELECTED = 0.7;
export const BLADE_DEPTH = 0.06;

// Handle constants
export const HANDLE_RADIUS = 0.1;

// Animation
export const SPRING_CONFIG = {
  stiffness: 300,
  damping: 30,
  mass: 0.5,
};

// Marker counts per zoom level - dense for dramatic effect
export const MARKER_COUNTS: Record<string, number> = {
  years: 60,
  months: 72,
  weeks: 56,
  days: 62,
  hours: 48,
};
