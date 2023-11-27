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

    flex: 0 0 auto;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: stretch;
    gap: 1em;
    box-sizing: border-box;
  }

  div {
    box-sizing: border-box;
  }
`;

export const App: FC = () => {
  const [appState, setAppState] = useState<AppState>({
    projects: undefined,
    openProject: undefined,
  });
  const { projects, openProject } = appState;
  const createProject = useCallback(
    async (project: Project) => {
      await PROJECT_SERVICE.createProject(project);

      setAppState({
        ...appState,
        projects: [...(projects || []), project],
      });
    },
    [appState],
  );
  const readProject = useCallback(
    async (project: Project) => {
      const { id } = project;
      const storedProject = await PROJECT_SERVICE.readProject(id as string);

      setAppState({
        ...appState,
        openProject: storedProject,
      });
    },
    [appState],
  );
  const updateProject = useCallback(
    async (project: Project) => {
      await PROJECT_SERVICE.updateProject(project);

      setAppState({
        ...appState,
        projects: (projects || []).map((storedProject) => {
          if (storedProject.id === project.id) {
            return project;
          }

          return storedProject;
        }),
        openProject: project.id === openProject?.id ? project : openProject,
      });
    },
    [appState],
  );
  const deleteProject = useCallback(
    async (id: string) => {
      await PROJECT_SERVICE.deleteProject(id);

      setAppState({
        ...appState,
        projects: (projects || []).filter(
          ({ id: existingId }) => existingId !== id,
        ),
        openProject: id === openProject?.id ? undefined : openProject,
      });
    },
    [appState],
  );
  const listProjects = useCallback(async () => {
    await PROJECT_SERVICE.initDB();
    const storedProjects = await PROJECT_SERVICE.listProjects();

    setAppState({
      ...appState,
      projects: storedProjects,
      openProject: openProject
        ? storedProjects.find(({ id }) => id === openProject.id)
        : undefined,
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
      <ProjectView
        projects={projects}
        openProject={openProject}
        createProject={createProject}
        readProject={readProject}
        updateProject={updateProject}
        deleteProject={deleteProject}
      />
    </>
  );
};
