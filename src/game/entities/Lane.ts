// Lane Entity
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  LANE_HEIGHT,
  LANE_TYPES,
  OBSTACLE_DIMENSIONS,
  OBSTACLE_SPEED_BASE,
  SPAWN_RATES,
  CAR_COLORS,
} from "../config/constants";
import type { Biome } from "../config/biomes";
import { Obstacle } from "./Obstacle";
import type { CameraController } from "../types";
import { drawGrass } from "../renderer/drawFunctions";

export class Lane {
  index: number;
  type: string;
  obstacles: Obstacle[];
  obstacleTimer: number;
  direction: number; // 1 = right, -1 = left
  carType: number; // 1 or 2 - determined once per road lane for consistency
  biome: Biome; // Current biome/scenario for colors

  private camera: CameraController;

  constructor(index: number, type: string, camera: CameraController, biome: Biome) {
    this.index = index;
    this.type = type;
    this.obstacles = [];
    this.obstacleTimer = 0;
    this.camera = camera;
    this.biome = biome;

    // Random direction for road and river lanes
    if (type === LANE_TYPES.ROAD || type === LANE_TYPES.RIVER) {
      this.direction = Math.random() > 0.5 ? 1 : -1;
    } else {
      this.direction = 0;
    }

    // Assign car type independently for each road lane (1 or 2)
    // Each road lane randomly chooses its own car type independently
    // Some roads will have car1, others will have car2 - completely random per road
    if (type === LANE_TYPES.ROAD) {
      // Each road gets its own independent random choice
      // Using index to ensure different roads get different random values
      const randomValue = Math.random() * 1000 + this.index;
      this.carType = Math.floor(randomValue) % 2 === 0 ? 1 : 2;
    } else {
      this.carType = 0; // Not used for non-road lanes
    }
  }

  update(): void {
    // Update existing obstacles
    this.obstacles.forEach((obstacle, idx) => {
      obstacle.update();
      if (obstacle.isOffScreen()) {
        this.obstacles.splice(idx, 1);
      }
    });

    // Generate new obstacles
    if (this.type === LANE_TYPES.ROAD || this.type === LANE_TYPES.RIVER) {
      this.obstacleTimer++;
      const spawnRate =
        this.type === LANE_TYPES.ROAD ? SPAWN_RATES.ROAD : SPAWN_RATES.RIVER;

      if (this.obstacleTimer >= spawnRate && this.obstacles.length < 3) {
        const width =
          this.type === LANE_TYPES.ROAD
            ? OBSTACLE_DIMENSIONS.CAR_WIDTH
            : OBSTACLE_DIMENSIONS.LOG_WIDTH;
        const speed =
          OBSTACLE_SPEED_BASE * this.direction * (0.8 + Math.random() * 0.4);
        const startX = this.direction > 0 ? -width : CANVAS_WIDTH;
        const y = this.index * LANE_HEIGHT;
        const color =
          this.type === LANE_TYPES.ROAD
            ? CAR_COLORS[Math.floor(Math.random() * CAR_COLORS.length)]
            : "#8B4513"; // Base color for logs (not used with new drawing)

        this.obstacles.push(
          new Obstacle(
            startX,
            y + 5,
            width,
            speed,
            this.type,
            color,
            this.direction,
            this.carType, // Pass the consistent car type for this road
            this.camera
          )
        );
        this.obstacleTimer = 0;
      }
    }
  }

  getCanvasY(): number {
    return this.index * LANE_HEIGHT - this.camera.getCameraY();
  }

  draw(ctx: CanvasRenderingContext2D): void {
    const y = this.getCanvasY();

    // Only draw if lane is visible on canvas
    if (y + LANE_HEIGHT < 0 || y > CANVAS_HEIGHT) {
      return;
    }

    // Draw lane background using biome colors
    switch (this.type) {
      case LANE_TYPES.GRASS:
        ctx.fillStyle = this.biome.grass;
        break;
      case LANE_TYPES.ROAD:
        ctx.fillStyle = this.biome.road;
        break;
      case LANE_TYPES.RIVER:
        ctx.fillStyle = this.biome.river;
        // Make river visually taller
        ctx.fillRect(0, y - 5, CANVAS_WIDTH, LANE_HEIGHT + 10);
        break;
    }

    if (this.type !== LANE_TYPES.RIVER) {
      ctx.fillRect(0, y, CANVAS_WIDTH, LANE_HEIGHT);
    }

    // Draw random grass if it's a grass lane
    if (this.type === LANE_TYPES.GRASS) {
      // Use lane index as seed for consistency
      const seed = this.index * 1234;
      // Generate random but deterministic grass positions
      const numGrassPatches = 8 + (seed % 5); // Between 8-12 patches
      for (let i = 0; i < numGrassPatches; i++) {
        const pseudoRandom = ((seed + i) * 9301 + 49297) % 233280;
        const grassX = (pseudoRandom / 233280) * (CANVAS_WIDTH - 80) + 40;
        const grassY = y + LANE_HEIGHT - 25;
        const scale = 0.15 + (pseudoRandom % 100) / 500; // Between 0.15 and 0.35
        drawGrass(ctx, grassX, grassY, scale);
      }
    }

    // Draw lane lines if it's a road
    if (this.type === LANE_TYPES.ROAD) {
      ctx.strokeStyle = "#FFFF00";
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 10]);
      ctx.beginPath();
      ctx.moveTo(0, y + LANE_HEIGHT / 2);
      ctx.lineTo(CANVAS_WIDTH, y + LANE_HEIGHT / 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw obstacles
    this.obstacles.forEach((obstacle) => obstacle.draw(ctx));
  }

  checkCollision(frogBounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  }): boolean {
    if (this.type === LANE_TYPES.GRASS) {
      return false; // Grass is safe
    }

    const laneY = this.getCanvasY();
    const laneCenterY = laneY + LANE_HEIGHT / 2;
    const frogCenterY = frogBounds.y + frogBounds.height / 2;

    // Check if frog is in this lane (with tolerance)
    if (frogCenterY < laneY || frogCenterY > laneY + LANE_HEIGHT) {
      return false;
    }

    if (this.type === LANE_TYPES.RIVER) {
      // In river, frog must be on a log
      let isOnLog = false;
      this.obstacles.forEach((obstacle) => {
        const bounds = obstacle.getBounds();
        if (
          frogBounds.x < bounds.x + bounds.width &&
          frogBounds.x + frogBounds.width > bounds.x
        ) {
          isOnLog = true;
        }
      });

      if (!isOnLog) {
        return true; // Collision (fell in water)
      }
    } else if (this.type === LANE_TYPES.ROAD) {
      // On road, any contact with a car is collision
      for (const obstacle of this.obstacles) {
        const bounds = obstacle.getBounds();
        if (
          frogBounds.x < bounds.x + bounds.width &&
          frogBounds.x + frogBounds.width > bounds.x &&
          frogBounds.y < bounds.y + bounds.height &&
          frogBounds.y + frogBounds.height > bounds.y
        ) {
          return true; // Collision
        }
      }
    }

    return false;
  }

  reset(): void {
    this.obstacles = [];
    this.obstacleTimer = 0;
  }
}

