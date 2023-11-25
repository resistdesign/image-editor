import { Project } from "./Project";

export type AppState = {
  projects?: Project[];
  openProject?: Project;
};
