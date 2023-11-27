import { Layer } from "../../../../Types/Layer";
import { Project } from "../../../../Types/Project";

const IMG_CACHE: Map<string, HTMLImageElement> = new Map<
  string,
  HTMLImageElement
>();

export const drawLayers = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  layers: Layer[] = [],
) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const drawLayer = (layer: Layer) => {
    const {
      x: imageX = 0,
      y: imageY = 0,
      width: imageWidth = 0,
      height: imageHeight = 0,
      crop,
      crop: {
        x: cropX = 0,
        y: cropY = 0,
        width: cropWidth = 0,
        height: cropHeight = 0,
      } = {},
      data: imageData,
    } = layer;

    if (imageData) {
      const cachedImg = IMG_CACHE.get(imageData);
      const drawImage = (img: HTMLImageElement) => {
        const widthRatio = img.width / imageWidth;
        const heightRatio = img.height / imageHeight;

        if (crop) {
          ctx.drawImage(
            img,
            cropX * widthRatio,
            cropY * heightRatio,
            cropWidth * widthRatio,
            cropHeight * heightRatio,
            imageX + cropX,
            imageY + cropY,
            cropWidth,
            cropHeight,
          );
        } else {
          ctx.drawImage(img, imageX, imageY, imageWidth, imageHeight);
        }
      };

      if (cachedImg) {
        drawImage(cachedImg);
      } else {
        const img = new Image();

        IMG_CACHE.set(imageData, img);

        img.onload = () => drawImage(img);
        img.src = imageData;
      }
    }
  };

  for (const layer of layers) {
    drawLayer(layer);
  }
};

export const getProjectLayerByIndex = (
  project: Project = {
    label: "",
    layers: [],
  },
  index: number = -1,
): Layer | undefined => {
  const { layers = [] } = project;

  return layers[index];
};
