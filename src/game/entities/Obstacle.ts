// Obstacle Entity
import { CANVAS_WIDTH, LANE_HEIGHT, LANE_TYPES } from "../config/constants";
import { drawCar, drawLog } from "../renderer/drawFunctions";
import type { CameraController } from "../types";

export class Obstacle {
  x: number;
  y: number;
  width: number;
  speed: number;
  type: string;
  color: string;
  direction: number;
  carType: number; // 1 or 2 - car type for road obstacles

  private camera: CameraController;

  constructor(
    x: number,
    y: number,
    width: number,
    speed: number,
    type: string,
    color: string,
    direction: number,
    carType: number,
    camera: CameraController
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.speed = speed;
    this.type = type;
    this.color = color;
    this.direction = direction;
    this.carType = carType;
    this.camera = camera;
  }

  update(): void {
    this.x += this.speed;
  }

  getCanvasY(): number {
    return this.y - this.camera.getCameraY();
  }

  draw(ctx: CanvasRenderingContext2D): void {
    const laneCanvasY = this.getCanvasY();
    const height = LANE_HEIGHT - 10;

    if (this.type === LANE_TYPES.ROAD) {
      // Center the car vertically in the lane
      const carY = laneCanvasY + (LANE_HEIGHT - height) / 2;
      drawCar(ctx, this.x, carY, this.width, height, this.color, this.direction, this.carType);
    } else if (this.type === LANE_TYPES.RIVER) {
      // Center the log vertically in the lane
      const logY = laneCanvasY + (LANE_HEIGHT - height) / 2;
      drawLog(ctx, this.x, logY, this.width, height);
    } else {
      // Fallback: simple rectangle
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, laneCanvasY, this.width, height);
    }
  }

  getBounds(): { x: number; y: number; width: number; height: number } {
    const laneCanvasY = this.getCanvasY();
    const height = LANE_HEIGHT - 10;
    // Return bounds centered in the lane (for collision detection)
    const centeredY = laneCanvasY + (LANE_HEIGHT - height) / 2;
    return {
      x: this.x,
      y: centeredY,
      width: this.width,
      height: height,
    };
  }

  isOffScreen(): boolean {
    return (
      (this.speed > 0 && this.x > CANVAS_WIDTH) ||
      (this.speed < 0 && this.x + this.width < 0)
    );
  }
}

