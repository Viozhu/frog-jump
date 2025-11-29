// Lane Generation Utility - Creates dynamic, varied lane patterns
import { NUM_LANES, LANE_TYPES, LANE_GENERATION } from "../config/constants";

export interface LaneConfig {
  index: number;
  type: string;
}

/**
 * Generates a dynamic lane pattern with varied road and river distribution
 * Ensures good gameplay balance with safe zones and varied challenges
 */
export function generateLanes(): LaneConfig[] {
  const lanes: LaneConfig[] = [];
  let consecutiveDangerous = 0;
  let lastDangerousIndex = -LANE_GENERATION.MIN_SAFE_LANES_BETWEEN - 1;

  for (let i = 0; i < NUM_LANES; i++) {
    // First and last lanes are always safe (grass)
    if (i === 0 || i === NUM_LANES - 1) {
      lanes.push({ index: i, type: LANE_TYPES.GRASS });
      consecutiveDangerous = 0;
      continue;
    }

    // Check if we need a safe lane (too many consecutive dangerous)
    const needsSafeLane =
      consecutiveDangerous >= LANE_GENERATION.MAX_CONSECUTIVE_DANGEROUS ||
      i - lastDangerousIndex < LANE_GENERATION.MIN_SAFE_LANES_BETWEEN;

    let type: string;

    if (needsSafeLane) {
      // Force a safe lane
      type = LANE_TYPES.GRASS;
      consecutiveDangerous = 0;
    } else {
      // Randomly decide: dangerous or safe
      const shouldBeDangerous =
        Math.random() < LANE_GENERATION.DANGEROUS_LANE_PROBABILITY;

      if (shouldBeDangerous) {
        // Randomly choose between road and river
        type =
          Math.random() < LANE_GENERATION.ROAD_VS_RIVER_RATIO
            ? LANE_TYPES.ROAD
            : LANE_TYPES.RIVER;
        consecutiveDangerous++;
        lastDangerousIndex = i;
      } else {
        type = LANE_TYPES.GRASS;
        consecutiveDangerous = 0;
      }
    }

    lanes.push({ index: i, type });
  }

  // Ensure we have a good mix - if too many safe lanes, convert some
  const dangerousCount = lanes.filter(
    (lane) =>
      lane.type === LANE_TYPES.ROAD || lane.type === LANE_TYPES.RIVER
  ).length;
  const minDangerousLanes = Math.floor(NUM_LANES * 0.4); // At least 40% dangerous

  if (dangerousCount < minDangerousLanes) {
    // Convert some safe lanes to dangerous ones
    const safeLanes = lanes.filter(
      (lane) =>
        lane.type === LANE_TYPES.GRASS &&
        lane.index !== 0 &&
        lane.index !== NUM_LANES - 1
    );

    // Shuffle and convert some
    const shuffled = [...safeLanes].sort(() => Math.random() - 0.5);
    const toConvert = minDangerousLanes - dangerousCount;

    for (let i = 0; i < Math.min(toConvert, shuffled.length); i++) {
      const lane = shuffled[i];
      const laneIndex = lanes.findIndex((l) => l.index === lane.index);
      if (laneIndex !== -1) {
        lanes[laneIndex].type =
          Math.random() < LANE_GENERATION.ROAD_VS_RIVER_RATIO
            ? LANE_TYPES.ROAD
            : LANE_TYPES.RIVER;
      }
    }
  }

  return lanes;
}

/**
 * Alternative: Pattern-based generation with more control
 * Creates interesting patterns while maintaining randomness
 */
export function generateLanesWithPatterns(): LaneConfig[] {
  const lanes: LaneConfig[] = [];
  const patterns = [
    "road", // Road section
    "river", // River section
    "mixed", // Mixed road and river
    "safe", // Safe grass section
  ];

  // Create a pattern sequence
  const patternSequence: string[] = [];
  for (let i = 0; i < NUM_LANES - 2; i++) {
    // Exclude first and last (always grass)
    patternSequence.push(patterns[Math.floor(Math.random() * patterns.length)]);
  }

  // First lane is always grass
  lanes.push({ index: 0, type: LANE_TYPES.GRASS });

  let patternIndex = 0;
  for (let i = 1; i < NUM_LANES - 1; i++) {
    const pattern = patternSequence[patternIndex];
    let type: string;

    switch (pattern) {
      case "road":
        type = LANE_TYPES.ROAD;
        break;
      case "river":
        type = LANE_TYPES.RIVER;
        break;
      case "mixed":
        // Alternate between road and river
        type = i % 2 === 0 ? LANE_TYPES.ROAD : LANE_TYPES.RIVER;
        break;
      case "safe":
        type = LANE_TYPES.GRASS;
        break;
      default:
        type = LANE_TYPES.GRASS;
    }

    // Add some randomness - 20% chance to override pattern
    if (Math.random() < 0.2) {
      const override = Math.random();
      if (override < 0.33) {
        type = LANE_TYPES.ROAD;
      } else if (override < 0.66) {
        type = LANE_TYPES.RIVER;
      } else {
        type = LANE_TYPES.GRASS;
      }
    }

    lanes.push({ index: i, type });
    patternIndex++;
  }

  // Last lane is always grass
  lanes.push({ index: NUM_LANES - 1, type: LANE_TYPES.GRASS });

  return lanes;
}

