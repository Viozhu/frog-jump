// Core Game Logic and State Management
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  LANE_HEIGHT,
  NUM_LANES,
  LANE_TYPES,
  SCORE_VALUES,
} from "../config/constants";
import { getBiome, type Biome } from "../config/biomes";
import { Frog, FrogDrawFunction, ScoreController } from "../entities/Frog";
import type { CameraController } from "../types";
import { Lane } from "../entities/Lane";
import { drawFrog } from "../renderer/drawFunctions";
import { imageManager } from "../utils/imageManager";
import { generateLanes } from "../utils/laneGenerator";

class SimpleCamera implements CameraController {
  private cameraY = 0;

  getCameraY(): number {
    return this.cameraY;
  }

  updateCamera(targetY: number): void {
    // Limit camera to not go beyond world
    const maxCameraY = NUM_LANES * LANE_HEIGHT - CANVAS_HEIGHT;
    const minCameraY = 0;
    this.cameraY = Math.max(minCameraY, Math.min(maxCameraY, targetY));
  }

  reset(): void {
    this.cameraY = 0;
  }
}

class SimpleScore implements ScoreController {
  private score = 0;
  private onScoreChange?: (score: number) => void;

  getScore(): number {
    return this.score;
  }

  addScore(points: number): void {
    this.score += points;
    if (this.onScoreChange) {
      this.onScoreChange(this.score);
    }
  }

  setOnScoreChange(callback: (score: number) => void): void {
    this.onScoreChange = callback;
  }

  reset(): void {
    this.score = 0;
    if (this.onScoreChange) {
      this.onScoreChange(this.score);
    }
  }
}

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private isPlaying = false;
  private animationId: number | null = null;

  private frog: Frog | null = null;
  private lanes: Lane[] = [];
  private camera: SimpleCamera;
  private score: SimpleScore;
  private currentBiomeIndex: number = 0; // Track current biome/scenario

  private onGameOver?: () => void;
  private onScoreChange?: (score: number) => void;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Could not get 2d context from canvas");
    }
    this.ctx = ctx;

    // Configure canvas size
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    // Initialize systems
    this.camera = new SimpleCamera();
    this.score = new SimpleScore();
    this.score.setOnScoreChange((score) => {
      if (this.onScoreChange) {
        this.onScoreChange(score);
      }
    });

    // Create lanes
    this.initializeLanes();
  }

  private initializeLanes(): void {
    this.lanes = [];
    // Generate dynamic lane pattern
    const laneConfigs = generateLanes();
    const currentBiome = getBiome(this.currentBiomeIndex);
    
    // Create Lane instances from configurations with current biome
    laneConfigs.forEach((config) => {
      this.lanes.push(new Lane(config.index, config.type, this.camera, currentBiome));
    });
  }

  getCurrentBiome(): Biome {
    return getBiome(this.currentBiomeIndex);
  }

  initialize(callback: () => void): void {
    // Preload all images before continuing
    imageManager.preloadAll(() => {
      // Responsive canvas sizing for mobile
      this.resizeCanvas();

      // Handle window resize
      if (typeof window !== "undefined") {
        window.addEventListener("resize", () => this.resizeCanvas());
        window.addEventListener("orientationchange", () => {
          // Delay resize to handle orientation change
          setTimeout(() => this.resizeCanvas(), 100);
        });
      }

      // Draw initial state
      this.draw();
      callback();
    });
  }

  private resizeCanvas(): void {
    const container = this.canvas.parentElement;
    if (!container) return;

    // Get actual container dimensions
    const containerWidth = container.clientWidth || window.innerWidth;
    const containerHeight = container.clientHeight || window.innerHeight;

    // Check if we're on mobile (small screen)
    const isMobile = containerWidth < 769;

    if (isMobile) {
      // On mobile: scale to fit height first (since phones are tall)
      // This prevents the game from looking too wide/stretched
      const scaleY = containerHeight / CANVAS_HEIGHT;
      const scaleX = containerWidth / CANVAS_WIDTH;
      
      // Use the smaller scale to fit entirely, but prefer height scaling on mobile
      // This makes the game fill the screen better without looking weird
      const scale = Math.min(scaleX, scaleY);
      
      const displayWidth = CANVAS_WIDTH * scale;
      const displayHeight = CANVAS_HEIGHT * scale;
      
      // Center the canvas if it doesn't fill the width
      this.canvas.style.width = `${displayWidth}px`;
      this.canvas.style.height = `${displayHeight}px`;
      this.canvas.style.maxWidth = "100%";
      this.canvas.style.maxHeight = "100%";
      this.canvas.style.margin = "0 auto"; // Center horizontally if smaller than container
    } else {
      // On desktop: maintain aspect ratio, fit in container
      const scaleX = containerWidth / CANVAS_WIDTH;
      const scaleY = containerHeight / CANVAS_HEIGHT;
      const scale = Math.min(scaleX, scaleY);

      const displayWidth = CANVAS_WIDTH * scale;
      const displayHeight = CANVAS_HEIGHT * scale;
      
      this.canvas.style.width = `${displayWidth}px`;
      this.canvas.style.height = `${displayHeight}px`;
      this.canvas.style.maxWidth = "100%";
      this.canvas.style.maxHeight = "100%";
      this.canvas.style.margin = "0";
    }

    // Keep internal resolution at CANVAS_WIDTH x CANVAS_HEIGHT
    // (already set in constructor, but ensure it stays)
    if (this.canvas.width !== CANVAS_WIDTH) {
      this.canvas.width = CANVAS_WIDTH;
    }
    if (this.canvas.height !== CANVAS_HEIGHT) {
      this.canvas.height = CANVAS_HEIGHT;
    }
  }

  start(): void {
    if (this.isPlaying) return;

    this.isPlaying = true;
    this.score.reset();
    this.camera.reset();
    this.currentBiomeIndex = 0; // Reset to first biome on new game

    // Regenerate lanes for variety on each game start
    this.initializeLanes();

    // Create frog with dependencies
    const drawFrogFn: FrogDrawFunction = (ctx, x, y, size, isJumping) => {
      drawFrog(ctx, x, y, size, isJumping);
    };

    this.frog = new Frog(
      drawFrogFn,
      this.camera,
      this.score,
      () => this.isPlaying
    );

    // Clear obstacles from all lanes (already done in initializeLanes, but ensure)
    this.lanes.forEach((lane) => lane.reset());

    this.gameLoop();
  }

  restart(): void {
    this.start();
  }

  stop(): void {
    this.isPlaying = false;
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  jump(): void {
    if (this.isPlaying && this.frog) {
      this.frog.jump();
    }
  }

  private gameLoop(): void {
    if (!this.isPlaying) return;

    this.update();
    this.draw();

    this.animationId = requestAnimationFrame(() => this.gameLoop());
  }

  private update(): void {
    if (!this.frog) return;

    // Update frog
    this.frog.update();

    // Update lanes and obstacles
    this.lanes.forEach((lane) => lane.update());

    // Check collisions
    const frogBounds = this.frog.getBounds();
    this.lanes.forEach((lane) => {
      if (lane.checkCollision(frogBounds)) {
        this.gameOver();
      }
    });

    // Victory: reach first lane
    if (this.frog.laneIndex === 0) {
      this.score.addScore(SCORE_VALUES.LEVEL_COMPLETE);
      // Change biome/scenario for next level
      this.currentBiomeIndex++;
      // Regenerate lanes with new biome
      this.initializeLanes();
      // Reset position to start
      this.frog.reset();
    }
  }

  private draw(): void {
    // Clear canvas
    this.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw lanes
    this.lanes.forEach((lane) => lane.draw(this.ctx));

    // Draw frog if exists
    if (this.frog && this.isPlaying) {
      this.frog.draw(this.ctx);
    }
  }

  private gameOver(): void {
    this.stop();
    if (this.onGameOver) {
      this.onGameOver();
    }
  }

  getScore(): number {
    return this.score.getScore();
  }

  setOnGameOver(callback: () => void): void {
    this.onGameOver = callback;
  }

  setOnScoreChange(callback: (score: number) => void): void {
    this.onScoreChange = callback;
    this.score.setOnScoreChange(callback);
  }
}

