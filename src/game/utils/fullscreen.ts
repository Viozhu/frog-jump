// Fullscreen API Utility for Mobile

export function requestFullscreen(element: HTMLElement): Promise<void> {
  return new Promise((resolve, reject) => {
    if (element.requestFullscreen) {
      element.requestFullscreen().then(resolve).catch(reject);
    } else if ((element as any).webkitRequestFullscreen) {
      // Safari
      (element as any).webkitRequestFullscreen();
      resolve();
    } else if ((element as any).webkitEnterFullscreen) {
      // iOS Safari
      (element as any).webkitEnterFullscreen();
      resolve();
    } else if ((element as any).mozRequestFullScreen) {
      // Firefox
      (element as any).mozRequestFullScreen().then(resolve).catch(reject);
    } else if ((element as any).msRequestFullscreen) {
      // IE/Edge
      (element as any).msRequestFullscreen().then(resolve).catch(reject);
    } else {
      reject(new Error("Fullscreen API not supported"));
    }
  });
}

export function exitFullscreen(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.exitFullscreen) {
      document.exitFullscreen().then(resolve).catch(reject);
    } else if ((document as any).webkitExitFullscreen) {
      (document as any).webkitExitFullscreen();
      resolve();
    } else if ((document as any).mozCancelFullScreen) {
      (document as any).mozCancelFullScreen().then(resolve).catch(reject);
    } else if ((document as any).msExitFullscreen) {
      (document as any).msExitFullscreen().then(resolve).catch(reject);
    } else {
      reject(new Error("Fullscreen API not supported"));
    }
  });
}

export function isFullscreen(): boolean {
  return !!(
    document.fullscreenElement ||
    (document as any).webkitFullscreenElement ||
    (document as any).mozFullScreenElement ||
    (document as any).msFullscreenElement
  );
}

export function toggleFullscreen(element: HTMLElement): Promise<void> {
  if (isFullscreen()) {
    return exitFullscreen();
  } else {
    return requestFullscreen(element);
  }
}

export function onFullscreenChange(callback: () => void): () => void {
  const events = [
    "fullscreenchange",
    "webkitfullscreenchange",
    "mozfullscreenchange",
    "MSFullscreenChange",
  ];

  events.forEach((event) => {
    document.addEventListener(event, callback);
  });

  // Return cleanup function
  return () => {
    events.forEach((event) => {
      document.removeEventListener(event, callback);
    });
  };
}

