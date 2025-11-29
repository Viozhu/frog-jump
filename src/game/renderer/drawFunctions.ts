// Drawing Functions for Game Entities
import { LANE_HEIGHT } from "../config/constants";
import { imageManager } from "../utils/imageManager";

export function drawFrog(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  isJumping: boolean = false
): void {
  // Adjust position if jumping
  const jumpOffsetY = isJumping ? -size * 0.15 : 0;

  // Load and draw the SVG
  const frogImage = imageManager.getFrogImage();
  if (!frogImage) {
    imageManager.loadFrogImage(() => {});
    return; // Wait for it to load
  }

  ctx.save();
  ctx.translate(x, y + jumpOffsetY);
  // Use natural image size to calculate correct scale
  const svgViewBoxSize = 357.334; // viewBox of SVG
  // Frog should occupy approximately 45% of lane height for better proportion
  const targetSize = LANE_HEIGHT * 0.45;
  const scale = targetSize / svgViewBoxSize;
  ctx.scale(scale, scale);
  ctx.drawImage(frogImage, 0, 0);
  ctx.restore();
}

export function drawCar1(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  color: string,
  direction: number
): void {
  const car1Image = imageManager.getCar1Image(color);
  if (!car1Image) {
    imageManager.loadCar1Image(color, () => {
      // Retry drawing after image loads
      drawCar1(ctx, x, y, width, height, color, direction);
    });
    return; // Wait for it to load
  }

  ctx.save();
  ctx.translate(x, y - 10);
  const scaleX = width / 1200;
  const scaleY = height / 800;
  if (direction < 0) {
    ctx.scale(-scaleX, scaleY);
    ctx.translate(-1024, 0);
  } else {
    ctx.scale(scaleX, scaleY);
  }
  ctx.drawImage(car1Image, 0, 0);
  ctx.restore();
}

export function drawCar2(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  primaryColor: string,
  secondaryColor: string,
  direction: number
): void {
  const car2Image = imageManager.getCar2Image(primaryColor);
  if (!car2Image) {
    imageManager.loadCar2Image(primaryColor, () => {
      // Retry drawing after image loads
      drawCar2(ctx, x, y, width, height, primaryColor, secondaryColor, direction);
    });
    return; // Wait for it to load
  }

  ctx.save();
  ctx.translate(x, y - 10);
  const scaleX = width / 1000;
  const scaleY = height / 512;
  if (direction < 0) {
    ctx.scale(-scaleX, scaleY);
    ctx.translate(-1524, 0);
  } else {
    ctx.scale(scaleX, scaleY);
  }
  ctx.drawImage(car2Image, 0, 0);
  ctx.restore();
}

export function drawCar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  color: string,
  direction: number,
  carType: number // 1 or 2 - use the car type from the lane
): void {
  // Select primary and secondary colors based on provided color
  const primaryColor = color;
  const secondaryColor = "#631536"; // Default secondary color

  if (carType === 1) {
    drawCar1(ctx, x, y, width, height, primaryColor, direction);
  } else {
    drawCar2(ctx, x, y, width, height, primaryColor, secondaryColor, direction);
  }
}

export function drawLog(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number
): void {
  const logImage = imageManager.getLogImage();
  if (!logImage) {
    imageManager.loadLogImage(() => {});
    return; // Wait for it to load
  }

  ctx.save();
  ctx.translate(x, y - 5); // Adjust for taller river
  // Make logs bigger - use more lane space
  const scaleX = (width * 1.5) / 1200; // 50% wider
  const scaleY = ((height + 10) * 2.0) / 600; // 100% taller to better fill lane
  ctx.scale(scaleX, scaleY);
  // Center vertically in expanded lane
  const offsetY = (600 - (height + 10) / scaleY) / 2;
  ctx.drawImage(logImage, 0, -offsetY);
  ctx.restore();
}

export function drawGrass(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number = 1
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale * 0.8, scale * 0.8);

  // Grass base - wavy top shape
  ctx.fillStyle = "#679A45";
  ctx.beginPath();
  // Base line
  ctx.moveTo(2.6, 7.4);
  ctx.lineTo(104.5, 7.4);
  // Right side - goes down
  ctx.lineTo(104.5, 1.5);
  // Wavy top shape
  ctx.bezierCurveTo(92.6, -1.2, 82.3, -5.6, 77.6, -2.1);
  ctx.bezierCurveTo(77.6, -2.1, 55.5, 1.9, 54.8, 1.6);
  ctx.bezierCurveTo(54.1, 1.3, 45.0, -5.6, 45.0, -5.6);
  ctx.lineTo(29.4, -2.4);
  ctx.lineTo(27.8, -2.7);
  ctx.lineTo(19.9, -5.6);
  ctx.lineTo(18.6, -2.1);
  ctx.lineTo(14.2, -3.0);
  ctx.lineTo(12.9, 0.5);
  ctx.lineTo(8.9, -1.9);
  ctx.lineTo(2.6, -0.5);
  ctx.lineTo(2.6, 7.4);
  ctx.closePath();
  ctx.fill();

  // Darker grass layers for depth
  ctx.fillStyle = "#35813F";

  // First left layer
  ctx.beginPath();
  ctx.moveTo(8.6, 7.1);
  ctx.lineTo(13.0, 0.8);
  ctx.lineTo(19.7, 7.2);
  ctx.closePath();
  ctx.fill();

  // Second central layer
  ctx.beginPath();
  ctx.moveTo(27.2, 7.1);
  ctx.lineTo(30.4, 3.3);
  ctx.lineTo(32.4, 3.3);
  ctx.lineTo(37.7, 0.6);
  ctx.lineTo(39.0, 4.1);
  ctx.lineTo(52.2, 3.0);
  ctx.lineTo(57.5, 7.1);
  ctx.closePath();
  ctx.fill();

  // Third right layer
  ctx.beginPath();
  ctx.moveTo(67.3, 7.7);
  ctx.lineTo(68.1, 5.6);
  ctx.lineTo(73.8, 4.7);
  ctx.lineTo(75.4, 2.6);
  ctx.lineTo(88.9, 7.1);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

export function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
): void {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

