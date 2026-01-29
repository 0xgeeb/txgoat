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
  bladeIdle: '#d0ccc4',
  bladeSelected: '#333333',
  bladeHovered: '#888888',
  glowColor: '#6699ff',
  ambient: '#FFF8F0',
};

// Geometry constants
export const ROD_LENGTH = 8;

// Blade (time marker) constants
export const BLADE_HEIGHT_IDLE = 0.3;
export const BLADE_HEIGHT_SELECTED = 0.8;
export const BLADE_DEPTH = 0.01; // Flat, no visible depth

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
