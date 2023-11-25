import { ProjectItem } from "./ProjectList/ProjectItem";
import { Project } from "../../Types/Project";
import { FC } from "react";
import styled from "styled-components";

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
};

export const ProjectList: FC<ProjectListProps> = ({ projects = [] }) => {
  return (
    <Layout>
      {projects.map((project, index) => {
        const { id } = project;

        return (
          <ProjectItem key={`ProjectItem:${id}:${index}`} project={project} />
        );
      })}
    </Layout>
  );
};
