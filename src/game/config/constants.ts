// Game Configuration Constants
export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 600;
export const LANE_HEIGHT = 60;
export const NUM_LANES = 20;
export const FROG_SIZE = 30;
export const OBSTACLE_SPEED_BASE = 2;

// Lane Types
export const LANE_TYPES = {
  GRASS: "grass",
  ROAD: "road",
  RIVER: "river",
} as const;

// Car Colors
export const CAR_COLORS = [
  "#E8447A", // Rosa
  "#0071CE", // Azul
  "#FF5733", // Rojo
  "#4CAF50", // Verde
  "#FFC300", // Amarillo
  "#9C27B0", // Morado
  "#00BCD4", // Cian
  "#FF9800", // Naranja
  "#795548", // Marrón
  "#2196F3", // Azul claro
  "#E91E63", // Rosa oscuro
  "#00E676", // Verde brillante
] as const;

// Spawn Rates
export const SPAWN_RATES = {
  ROAD: 90,
  RIVER: 120,
} as const;

// Obstacle Dimensions
// Note: These are input values used by drawing functions. Actual rendered sizes:
// - Car1: ~85px wide (when CAR_WIDTH=100)
// - Car2: ~102px wide (when CAR_WIDTH=100) 
// - Log: ~115px wide (when LOG_WIDTH=180)
// Current values produce: Car2 at ~102px, Car1 at ~85px, Log at ~115px
export const OBSTACLE_DIMENSIONS = {
  CAR_WIDTH: 100, // Input value - Car2 renders at ~102px, Car1 at ~85px
  LOG_WIDTH: 180, // Input value - Log renders at ~115px (with 1.5x scaling)
} as const;

// Scoring
export const SCORE_VALUES = {
  JUMP: 10,
  LEVEL_COMPLETE: 100,
} as const;

// Lane Generation Configuration
export const LANE_GENERATION = {
  // Probability of a lane being dangerous (road or river) vs safe (grass)
  DANGEROUS_LANE_PROBABILITY: 0.6, // 60% chance of dangerous lane
  // Minimum safe lanes between dangerous sections
  MIN_SAFE_LANES_BETWEEN: 1,
  // Maximum consecutive dangerous lanes
  MAX_CONSECUTIVE_DANGEROUS: 3,
  // Probability split between road and river when generating dangerous lane
  ROAD_VS_RIVER_RATIO: 0.5, // 50% road, 50% river
} as const;

