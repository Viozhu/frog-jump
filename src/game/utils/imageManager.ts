// Image Manager - Handles loading and caching of SVG images
import { FROG_SVG, LOG_SVG, CAR1_SVG, CAR2_SVG } from "../assets/svgs";
import { loadSVGImage } from "./imageLoader";

interface ImageCache {
  image: HTMLImageElement | null;
  loading: boolean;
}

interface ColorImageCache {
  [color: string]: ImageCache;
}

class ImageManager {
  private frogCache: ImageCache = { image: null, loading: false };
  private logCache: ImageCache = { image: null, loading: false };
  // Cache car images by color - each color gets its own cached image
  private car1Cache: ColorImageCache = {};
  private car2Cache: ColorImageCache = {};

  loadFrogImage(callback: (img: HTMLImageElement) => void): void {
    loadSVGImage(FROG_SVG, this.frogCache, (img) => {
      this.frogCache.image = img;
      callback(img);
    });
  }

  loadLogImage(callback: (img: HTMLImageElement) => void): void {
    loadSVGImage(LOG_SVG, this.logCache, (img) => {
      this.logCache.image = img;
      callback(img);
    });
  }

  loadCar1Image(color: string, callback: (img: HTMLImageElement) => void): void {
    // Get or create cache for this color
    if (!this.car1Cache[color]) {
      this.car1Cache[color] = { image: null, loading: false };
    }
    
    const cache = this.car1Cache[color];
    loadSVGImage(CAR1_SVG(color), cache, (img) => {
      cache.image = img;
      callback(img);
    });
  }

  loadCar2Image(color: string, callback: (img: HTMLImageElement) => void): void {
    // Get or create cache for this color
    if (!this.car2Cache[color]) {
      this.car2Cache[color] = { image: null, loading: false };
    }
    
    const cache = this.car2Cache[color];
    loadSVGImage(CAR2_SVG(color), cache, (img) => {
      cache.image = img;
      callback(img);
    });
  }

  getFrogImage(): HTMLImageElement | null {
    return this.frogCache.image;
  }

  getLogImage(): HTMLImageElement | null {
    return this.logCache.image;
  }

  getCar1Image(color: string): HTMLImageElement | null {
    return this.car1Cache[color]?.image || null;
  }

  getCar2Image(color: string): HTMLImageElement | null {
    return this.car2Cache[color]?.image || null;
  }

  preloadAll(callback: () => void): void {
    let loaded = 0;
    const total = 2; // Only preload frog and log (cars load on-demand by color)

    const checkComplete = () => {
      loaded++;
      if (loaded >= total) {
        callback();
      }
    };

    this.loadFrogImage(() => checkComplete());
    this.loadLogImage(() => checkComplete());
  }
}

export const imageManager = new ImageManager();

