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
  readProject?: (project: Project) => void;
  selectedIdMap?: Record<string, boolean>;
  onSelectedIdMapChange?: (selectedIdMap: Record<string, boolean>) => void;
};

export const ProjectList: FC<ProjectListProps> = ({
  projects = [],
  readProject,
  selectedIdMap = {},
  onSelectedIdMapChange,
}) => {
  const onSelectedChange = (id: string, selected: boolean) => {
    if (onSelectedIdMapChange) {
      const newSelectedIdMap = {
        ...selectedIdMap,
        [id]: selected,
      };

      onSelectedIdMapChange(newSelectedIdMap);
    }
  };

  return (
    <Layout>
      {projects.map((project, index) => {
        const { id } = project;
        const { [id as string]: selected = false } = selectedIdMap;

        return (
          <ProjectItem
            key={`ProjectItem:${id}:${index}`}
            selected={selected}
            onSelectedChange={onSelectedChange}
            project={project}
            readProject={readProject}
          />
        );
      })}
    </Layout>
  );
};
