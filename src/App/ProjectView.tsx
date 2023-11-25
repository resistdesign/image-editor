import {
  ChangeEvent as ReactChangeEvent,
  FC,
  useCallback,
  useState,
} from "react";
import styled from "styled-components";
import { Project } from "../Types/Project";
import { ProjectList } from "./ProjectView/ProjectList";

const Layout = styled.div`
  display: grid;
  grid-template-areas: "header header" "sidebar main";
  grid-template-rows: auto 1fr;
  grid-template-columns: auto 5fr;
  width: 100%;
  height: 100%;
  gap: 1em;
  overflow: hidden;
  padding: 1em;
`;
const Header = styled.div`
  flex: 1 0 auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 1em;
  overflow: hidden;
  grid-area: header;
`;
const Sidebar = styled.div`
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  gap: 1em;
  overflow: auto;
  grid-area: sidebar;
  min-width: 10em;
`;
const Main = styled.div`
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  gap: 1em;
  overflow: auto;
  grid-area: main;
`;

export type ProjectViewProps = {
  projects?: Project[];
  openProject?: Project;
  onCreateProject?: (project: Project) => void;
  onReadProject?: (project: Project) => void;
  onUpdateProject?: (project: Project) => void;
  onDeleteProject?: (project: Project) => void;
};

export const ProjectView: FC<ProjectViewProps> = ({
  projects = [],
  openProject,
  onCreateProject,
}) => {
  const [creatingNewProject, setCreatingNewProject] = useState(false);
  const [newProjectLabel, setNewProjectLabel] = useState("");
  const toggleCreatingNewProject = useCallback(() => {
    setCreatingNewProject(!creatingNewProject);
    setNewProjectLabel("");
  }, [creatingNewProject]);
  const onNewProjectLabelChange = useCallback(
    (event: ReactChangeEvent<HTMLInputElement>) => {
      setNewProjectLabel(event.target.value);
    },
    [],
  );
  const onCreateNewProject = useCallback(() => {
    if (onCreateProject && newProjectLabel) {
      const newProject: Project = {
        label: newProjectLabel,
        layers: [],
      };

      onCreateProject(newProject);
      toggleCreatingNewProject();
    }
  }, [onCreateProject, newProjectLabel, toggleCreatingNewProject]);

  return (
    <Layout>
      <Header>
        <h2>Image Editor</h2>
      </Header>
      <Sidebar>
        {creatingNewProject ? (
          <div>
            <input
              type="text"
              value={newProjectLabel}
              onChange={onNewProjectLabelChange}
              placeholder="New Project Label"
            />
            <button onClick={toggleCreatingNewProject}>Cancel</button>
            <button onClick={onCreateNewProject}>Create</button>
          </div>
        ) : (
          <button onClick={toggleCreatingNewProject}>New Project</button>
        )}
        <ProjectList projects={projects} />
      </Sidebar>
      <Main>Main</Main>
    </Layout>
  );
};
