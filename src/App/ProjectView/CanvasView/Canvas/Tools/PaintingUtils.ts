export const getCoordinates = (
  event: MouseEvent,
  canvas: HTMLCanvasElement,
): { x: number; y: number } => {
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
};

export const createOffscreenCanvas = (
  width: number,
  height: number,
): HTMLCanvasElement => {
  const offscreenCanvas = document.createElement("canvas");
  offscreenCanvas.width = width;
  offscreenCanvas.height = height;
  return offscreenCanvas;
};

export const drawStrokeToCtx = (
  ctx: CanvasRenderingContext2D,
  coordinates: { x: number; y: number },
  strokeWeight: number = 5,
  hue: number,
) => {
  ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
  ctx.lineWidth = strokeWeight;
  ctx.lineTo(coordinates.x, coordinates.y);
  ctx.stroke();
};

export const setupCanvas = (
  canvas: HTMLCanvasElement,
  onStrokeComplete: (dataUrl: string) => void,
): (() => void) => {
  const offscreenCanvas = createOffscreenCanvas(canvas.width, canvas.height);
  let isPainting = false;
  let hue = 0;

  const startPainting = (event: MouseEvent): void => {
    isPainting = true;
    const coordinates = getCoordinates(event, canvas);
    const ctx = offscreenCanvas.getContext("2d");
    ctx?.beginPath();
    ctx?.moveTo(coordinates.x, coordinates.y);
  };

  const paint = (event: MouseEvent): void => {
    if (isPainting) {
      const coordinates = getCoordinates(event, canvas);
      const ctx = offscreenCanvas.getContext("2d");
      const mainCtx = canvas.getContext("2d");
      const speed = Math.sqrt(
        Math.pow(event.movementX, 2) + Math.pow(event.movementY, 2),
      );
      const strokeWeight = Math.min(Math.max(speed, 1), 30);

      if (ctx) {
        drawStrokeToCtx(ctx, coordinates, strokeWeight, hue);
      }

      if (mainCtx) {
        drawStrokeToCtx(mainCtx, coordinates, strokeWeight, hue);
      }

      hue = (hue + 1) % 360;
    }
  };

  const stopPainting = (): void => {
    if (isPainting) {
      isPainting = false;
      onStrokeComplete(offscreenCanvas.toDataURL());
    }
  };

  canvas.addEventListener("mousedown", startPainting);
  canvas.addEventListener("mousemove", paint);
  canvas.addEventListener("mouseup", stopPainting);
  canvas.addEventListener("mouseleave", stopPainting);

  return () => {
    canvas.removeEventListener("mousedown", startPainting);
    canvas.removeEventListener("mousemove", paint);
    canvas.removeEventListener("mouseup", stopPainting);
    canvas.removeEventListener("mouseleave", stopPainting);
  };
};
