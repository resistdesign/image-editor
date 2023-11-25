import { FC } from "react";
import { Project } from "../../../Types/Project";
import styled from "styled-components";

const Layout = styled.div`
  flex: 1 0 auto;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: center;
  gap: 1em;
  overflow: auto;
`;

export type ProjectItemProps = {
  project: Project;
};

export const ProjectItem: FC<ProjectItemProps> = ({ project }) => {
  const { label } = project;

  return <Layout>{label}</Layout>;
};
