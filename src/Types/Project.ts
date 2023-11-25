import { Layer } from "./Layer";

export type Project = {
  id?: string;
  label: string;
  layers: Layer[];
};
