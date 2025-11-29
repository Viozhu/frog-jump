// Biome/Scenario Configurations
// Different visual themes that change when player completes a level

export interface Biome {
  name: string;
  grass: string;      // Grass lane color
  road: string;       // Road lane color
  river: string;      // River/water color
  grassPattern?: string; // Optional: different grass pattern color
}

export const BIOMES: Biome[] = [
  {
    name: "forest",
    grass: "#90EE90",      // Light green (default)
    road: "#555555",       // Dark gray
    river: "#4682B4",      // Steel blue
  },
  {
    name: "desert",
    grass: "#F4A460",      // Sandy brown
    road: "#8B7355",       // Brown road
    river: "#87CEEB",      // Sky blue (oasis)
  },
  {
    name: "snow",
    grass: "#F0F8FF",      // Snow white
    road: "#708090",       // Slate gray
    river: "#4682B4",      // Frozen blue
  },
  {
    name: "autumn",
    grass: "#D2691E",      // Autumn orange-brown
    road: "#696969",       // Dim gray
    river: "#4682B4",      // Blue water
  },
  {
    name: "jungle",
    grass: "#228B22",      // Forest green
    road: "#556B2F",       // Dark olive
    river: "#20B2AA",      // Light sea green
  },
  {
    name: "arctic",
    grass: "#E0E0E0",      // Light gray (ice)
    road: "#778899",       // Light slate gray
    river: "#B0E0E6",      // Powder blue
  },
];

export function getBiome(index: number): Biome {
  return BIOMES[index % BIOMES.length];
}

