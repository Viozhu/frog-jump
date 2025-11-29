// Image Loading Utilities

interface ImageCache {
  image: HTMLImageElement | null;
  loading: boolean;
}

/**
 * Generic function to load SVG images
 */
export function loadSVGImage(
  svgString: string,
  cache: ImageCache,
  callback: (img: HTMLImageElement) => void
): void {
  if (cache.image) {
    callback(cache.image);
    return;
  }

  if (cache.loading) {
    const checkInterval = setInterval(() => {
      if (cache.image) {
        clearInterval(checkInterval);
        callback(cache.image);
      }
    }, 50);
    return;
  }

  cache.loading = true;
  const img = new Image();
  const svgBlob = new Blob([svgString], {
    type: "image/svg+xml;charset=utf-8",
  });
  const url = URL.createObjectURL(svgBlob);

  img.onload = () => {
    cache.image = img;
    cache.loading = false;
    callback(img);
    URL.revokeObjectURL(url);
  };

  img.onerror = () => {
    cache.loading = false;
    URL.revokeObjectURL(url);
    console.error("Error loading SVG");
  };

  img.src = url;
}

/**
 * Get a random color from the car colors array
 */
export function randomColor(colors: readonly string[]): string {
  const num = Math.floor(Math.random() * colors.length);
  return colors[num];
}

