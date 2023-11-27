export type Layer = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  crop?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  label: string;
  data?: string;
};
