import { ProjectItem } from "./ProjectList/ProjectItem";
import { Project } from "../../Types/Project";
import { FC } from "react";
import styled from "styled-components";
import { CreateProjectView } from "./ProjectList/CreateProjectView";

const Layout = styled.div`
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  gap: 1em;
  overflow: auto;
`;

export type ProjectListProps = {
  projects?: Project[];
  createProject?: (project: Project) => void;
};

export const ProjectList: FC<ProjectListProps> = ({
  projects = [],
  createProject,
}) => {
  return (
    <Layout>
      <CreateProjectView createProject={createProject} />
      {projects.map((project, index) => {
        const { id } = project;

        return (
          <ProjectItem key={`ProjectItem:${id}:${index}`} project={project} />
        );
      })}
    </Layout>
  );
};
