import { CanvasTool } from "./Types";
import { drawLayers, getProjectLayerByIndex } from "./Utils";
import { Layer } from "../../../../Types/Layer";
import { setupCanvas } from "./Tools/PaintingUtils";

export type BasicToolIds = "MOVE_RESIZE" | "CROP" | "RAINBOW_PAINT";

export type BasicCanvasTool = CanvasTool & {
  id: BasicToolIds;
};

export const BasicTools: BasicCanvasTool[] = [
  {
    id: "MOVE_RESIZE",
    label: "Move/Resize",
    icon: "&#x2194;",
    onCanvasStateChange: (canvasState, overlayCoordinates) => {
      const { canvas, openProject, selectedLayerIndex } = canvasState;
      const selectedLayer = getProjectLayerByIndex(
        openProject,
        selectedLayerIndex,
      );

      if (canvas && openProject && selectedLayer) {
        const newSelectedLayer: Layer = {
          ...selectedLayer,
          ...overlayCoordinates,
        };
        const { layers = [] } = openProject;
        const newLayers = layers.map((layer) =>
          layer === selectedLayer ? newSelectedLayer : layer,
        );

        drawLayers(canvas, canvas.getContext("2d")!, newLayers);
      }
    },
    useOverlay: true,
    getOverlayCoordinates: (canvasState) => {
      const { canvas, openProject, selectedLayerIndex } = canvasState;
      const selectedLayer = getProjectLayerByIndex(
        openProject,
        selectedLayerIndex,
      );

      if (canvas && selectedLayer) {
        const { width: canvasWidth = 0, height: canvasHeight = 0 } = canvas;
        const { x = 0, y = 0 } = selectedLayer;
        const {
          width: layerWidth = canvasWidth - x,
          height: layerHeight = canvasHeight - y,
        } = selectedLayer;

        return {
          x,
          y,
          width: layerWidth,
          height: layerHeight,
        };
      } else {
        return undefined;
      }
    },
    apply: (canvasState, overlayCoordinates) => {
      const { selectedLayerIndex } = canvasState;
      const selectedLayer = getProjectLayerByIndex(
        canvasState.openProject,
        selectedLayerIndex,
      );

      if (selectedLayer && overlayCoordinates) {
        return {
          ...selectedLayer,
          ...overlayCoordinates,
        };
      } else {
        return undefined;
      }
    },
  },
  {
    id: "CROP",
    label: "Crop",
    icon: "&#x2B1A;",
    onCanvasStateChange: (canvasState, overlayCoordinates) => {
      const { canvas, openProject, selectedLayerIndex } = canvasState;
      const selectedLayer = getProjectLayerByIndex(
        openProject,
        selectedLayerIndex,
      );

      if (canvas && openProject && selectedLayer && overlayCoordinates) {
        const { x: imageX = 0, y: imageY = 0 } = selectedLayer;
        const {
          x: cropX = 0,
          y: cropY = 0,
          width: cropWidth = 0,
          height: cropHeight = 0,
        } = overlayCoordinates;
        const newSelectedLayer: Layer = {
          ...selectedLayer,
          crop: {
            x: cropX - imageX,
            y: cropY - imageY,
            width: cropWidth,
            height: cropHeight,
          },
        };
        const { layers = [] } = openProject;
        const newLayers = layers.map((layer) =>
          layer === selectedLayer ? newSelectedLayer : layer,
        );

        drawLayers(canvas, canvas.getContext("2d")!, newLayers);
      }
    },
    useOverlay: true,
    getOverlayCoordinates: (canvasState) => {
      const { selectedLayerIndex } = canvasState;
      const selectedLayer = getProjectLayerByIndex(
        canvasState.openProject,
        selectedLayerIndex,
      );

      if (selectedLayer) {
        const { x: imageX = 0, y: imageY = 0, crop } = selectedLayer;
        const { x, y, width, height } = crop || {
          x: 0,
          y: 0,
          width: canvasState.canvas?.width || 0,
          height: canvasState.canvas?.height || 0,
        };

        return {
          x: imageX + x,
          y: imageY + y,
          width,
          height,
        };
      }
    },
    apply: (canvasState, overlayCoordinates) => {
      const { selectedLayerIndex } = canvasState;
      const selectedLayer = getProjectLayerByIndex(
        canvasState.openProject,
        selectedLayerIndex,
      );

      if (selectedLayer && overlayCoordinates) {
        const { x: imageX = 0, y: imageY = 0 } = selectedLayer;
        const {
          x: cropX = 0,
          y: cropY = 0,
          width: cropWidth = 0,
          height: cropHeight = 0,
        } = overlayCoordinates;

        return {
          ...selectedLayer,
          crop: {
            x: cropX - imageX,
            y: cropY - imageY,
            width: cropWidth,
            height: cropHeight,
          },
        };
      } else {
        return undefined;
      }
    },
  },
  {
    id: "RAINBOW_PAINT",
    label: "Rainbow Paint",
    icon: "&#x1F308;",
    initializeCanvas: (canvas, canvasState, onCanvasStateChange) => {
      return setupCanvas(canvas, (dataUrl) => {
        const { openProject, selectedLayerIndex } = canvasState;

        if (canvas && openProject && selectedLayerIndex) {
          const { layers = ([] = []) } = openProject;
          const newLayer: Layer = {
            x: 0,
            y: 0,
            width: canvas.width,
            height: canvas.height,
            label: "Rainbow Paint",
            data: dataUrl,
            crop: undefined,
          };
          const newLayerList = [...layers, newLayer];
          const newCanvasState = {
            ...canvasState,
            selectedLayerIndex: newLayerList.length - 1,
            openProject: {
              ...openProject,
              layers: newLayerList,
            },
          };

          onCanvasStateChange(newCanvasState);
        }
      });
    },
    onCanvasStateChange: () => {},
  },
];
