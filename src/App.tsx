import { FC, useCallback, useEffect, useState } from "react";
import { ProjectView } from "./App/ProjectView";
import { createGlobalStyle } from "styled-components";
import { ProjectService } from "./App/Services/Project";
import { AppState } from "./Types/AppState";
import { Project } from "./Types/Project";

const PROJECT_SERVICE = new ProjectService();

const GlobalStyle = createGlobalStyle`
  html,
  body {
    margin: 0;
    padding: 0;
    overflow: hidden;
    width: 100vw;
    height: 100vh;

    flex: 1 0 auto;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: stretch;
    gap: 1em;
  }
`;

export const App: FC = () => {
  const [appState, setAppState] = useState<AppState>({
    projects: undefined,
    openProject: undefined,
  });
  const { projects, openProject } = appState;
  const clearProjects = useCallback(() => {
    setAppState({
      ...appState,
      projects: undefined,
    });
  }, [appState]);
  const createProject = useCallback(
    async (project: Project) => {
      const storedProject = await PROJECT_SERVICE.createProject(project);

      clearProjects();
    },
    [clearProjects],
  );
  const listProjects = useCallback(async () => {
    await PROJECT_SERVICE.initDB();
    const storedProjects = await PROJECT_SERVICE.listProjects();

    setAppState({
      ...appState,
      projects: storedProjects,
    });
  }, [appState]);

  useEffect(() => {
    if (!projects) {
      listProjects();
    }
  }, [projects, listProjects]);

  return (
    <>
      <GlobalStyle />
      <ProjectView projects={projects} onCreateProject={createProject} />
    </>
  );
};
