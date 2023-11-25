import { FC } from "react";
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
  createProject?: (project: Project) => void;
  readProject?: (project: Project) => void;
  updateProject?: (project: Project) => void;
  deleteProject?: (project: Project) => void;
};

export const ProjectView: FC<ProjectViewProps> = ({
  projects = [],
  openProject,
  createProject,
}) => {
  return (
    <Layout>
      <Header>
        <h2>Image Editor</h2>
      </Header>
      <Sidebar>
        <ProjectList projects={projects} createProject={createProject} />
      </Sidebar>
      <Main>Main</Main>
    </Layout>
  );
};
