import { Layer } from "../../../../Types/Layer";
import { Project } from "../../../../Types/Project";

export type Point = {
  x: number;
  y: number;
};

export type Coordinates = Point & {
  width: number;
  height: number;
};

export type CanvasState = {
  canvas?: HTMLCanvasElement | null;
  openProject?: Project;
  selectedLayerIndex?: number;
};

export type CanvasTool = {
  id: string;
  label: string;
  icon: string;
  initializeCanvas?: (
    canvas: HTMLCanvasElement,
    canvasState: CanvasState,
    onCanvasStateChange: (canvasState: CanvasState) => void,
  ) => (() => void) | undefined;
  onCanvasStateChange?: (
    canvasState: CanvasState,
    overlayCoordinates?: Coordinates,
  ) => void;
  useOverlay?: boolean;
  getOverlayCoordinates?: (canvasState: CanvasState) => Coordinates | undefined;
  apply?: (
    canvasState: CanvasState,
    overlayCoordinates?: Coordinates,
  ) => Layer | undefined;
};
