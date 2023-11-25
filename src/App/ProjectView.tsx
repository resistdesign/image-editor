import { FC, useState } from "react";
import styled from "styled-components";
import { Project } from "../Types/Project";
import { ProjectList } from "./ProjectView/ProjectList";
import { CanvasView } from "./ProjectView/CanvasView";
import { CreateProjectView } from "./ProjectView/CreateProjectView";
import { DeleteProjectView } from "./ProjectView/DeleteProjectView";

const Layout = styled.div`
  flex: 1 0 auto;
  display: grid;
  grid-template-areas: "header header" "sidebar main";
  grid-template-rows: auto 5fr;
  grid-template-columns: auto 5fr;
  gap: 1em;
  overflow: hidden;
  padding: 1em;
  width: 100vw;
  height: 100vh;
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
  display: grid;
  grid-template-rows: 1fr 1fr 10fr;
  gap: 1em;
  overflow: hidden;
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
  overflow: hidden;
  grid-area: main;
`;

export type ProjectViewProps = {
  projects?: Project[];
  openProject?: Project;
  createProject?: (project: Project) => void;
  readProject?: (project: Project) => void;
  updateProject?: (project: Project) => void;
  deleteProject?: (id: string) => void;
};

export const ProjectView: FC<ProjectViewProps> = ({
  projects = [],
  openProject,
  createProject,
  readProject,
  deleteProject,
}) => {
  const [selectedIdMap, onSelectedIdMapChange] = useState<
    Record<string, boolean>
  >({});

  return (
    <Layout>
      <Header>
        <h2>Image Editor</h2>
      </Header>
      <Sidebar>
        <CreateProjectView createProject={createProject} />
        <DeleteProjectView
          selectedIdMap={selectedIdMap}
          deleteProject={deleteProject}
        />
        <ProjectList
          projects={projects}
          readProject={readProject}
          selectedIdMap={selectedIdMap}
          onSelectedIdMapChange={onSelectedIdMapChange}
        />
      </Sidebar>
      <Main>
        <CanvasView openProject={openProject} />
      </Main>
    </Layout>
  );
};
