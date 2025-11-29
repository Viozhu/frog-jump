// Frog Entity
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  FROG_SIZE,
  LANE_HEIGHT,
  NUM_LANES,
  SCORE_VALUES,
} from "../config/constants";
import type { CameraController } from "../types";

export interface FrogDrawFunction {
  (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, isJumping: boolean): void;
}


export interface ScoreController {
  addScore(points: number): void;
}

export class Frog {
  x: number;
  worldY: number;
  laneIndex: number;
  targetWorldY: number;
  isJumping: boolean;

  private drawFrog: FrogDrawFunction;
  private camera: CameraController;
  private score: ScoreController;
  private isPlaying: () => boolean;

  constructor(
    drawFrog: FrogDrawFunction,
    camera: CameraController,
    score: ScoreController,
    isPlaying: () => boolean
  ) {
    this.drawFrog = drawFrog;
    this.camera = camera;
    this.score = score;
    this.isPlaying = isPlaying;

    this.x = CANVAS_WIDTH / 2 - FROG_SIZE / 2;
    this.worldY =
      (NUM_LANES - 1) * LANE_HEIGHT + (LANE_HEIGHT - FROG_SIZE) / 2 - 10;
    this.laneIndex = NUM_LANES - 1;
    this.targetWorldY = this.worldY;
    this.isJumping = false;

    // Initialize camera to make frog visible
    const targetCanvasY = CANVAS_HEIGHT - LANE_HEIGHT * 1.5;
    camera.updateCamera(this.worldY - targetCanvasY);
  }

  jump(): void {
    if (!this.isPlaying() || this.isJumping) return;

    if (this.laneIndex > 0) {
      this.laneIndex--;
      this.targetWorldY =
        this.laneIndex * LANE_HEIGHT + (LANE_HEIGHT - FROG_SIZE) / 2 - 10;
      this.isJumping = true;
      this.score.addScore(SCORE_VALUES.JUMP);
    }
  }

  update(): void {
    if (this.isJumping) {
      const dy = (this.targetWorldY - this.worldY) * 0.2;
      this.worldY += dy;

      if (Math.abs(this.targetWorldY - this.worldY) < 1) {
        this.worldY = this.targetWorldY;
        this.isJumping = false;
      }
    }

    // Adjust camera to keep frog near bottom center of canvas
    const targetCameraY = this.worldY - (CANVAS_HEIGHT - LANE_HEIGHT * 1.5);
    const currentCameraY = this.camera.getCameraY();
    this.camera.updateCamera(currentCameraY + (targetCameraY - currentCameraY) * 0.1);
  }

  getCanvasY(): number {
    return this.worldY - this.camera.getCameraY();
  }

  draw(ctx: CanvasRenderingContext2D): void {
    const canvasY = this.getCanvasY();
    this.drawFrog(ctx, this.x, canvasY, FROG_SIZE, this.isJumping);
  }

  getBounds(): { x: number; y: number; width: number; height: number } {
    const canvasY = this.getCanvasY();
    return {
      x: this.x,
      y: canvasY,
      width: FROG_SIZE,
      height: FROG_SIZE,
    };
  }

  reset(): void {
    this.laneIndex = NUM_LANES - 1;
    this.worldY =
      (NUM_LANES - 1) * LANE_HEIGHT + (LANE_HEIGHT - FROG_SIZE) / 2;
    this.targetWorldY = this.worldY;
    this.isJumping = false;
    const targetCanvasY = CANVAS_HEIGHT - LANE_HEIGHT * 1.5;
    this.camera.updateCamera(this.worldY - targetCanvasY);
  }
}

