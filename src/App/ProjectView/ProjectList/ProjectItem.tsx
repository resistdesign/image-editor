import { FC, useCallback } from "react";
import { Project } from "../../../Types/Project";
import styled from "styled-components";

const Layout = styled.div`
  flex: 0 0 auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 1em;
  overflow: auto;
  cursor: pointer;
`;
const Checkbox = styled.input`
  margin-bottom: -0.25em;
`;
const Label = styled.div`
  flex: 1 0 auto;
  cursor: pointer;
`;

export type ProjectItemProps = {
  selected?: boolean;
  onSelectedChange?: (id: string, selected: boolean) => void;
  project: Project;
  readProject?: (project: Project) => void;
};

export const ProjectItem: FC<ProjectItemProps> = ({
  selected = false,
  onSelectedChange,
  project,
  readProject,
}) => {
  const { id, label } = project;
  const onReadProjectInternal = useCallback(() => {
    if (readProject) {
      readProject(project);
    }
  }, [project, readProject]);
  const onSelectedChangeInternal = useCallback(() => {
    if (onSelectedChange) {
      onSelectedChange(id as string, !selected);
    }
  }, [selected, onSelectedChange, id]);

  return (
    <Layout>
      <Checkbox
        type="checkbox"
        checked={selected}
        onChange={onSelectedChangeInternal}
      />
      <Label onClick={onReadProjectInternal}>{label}</Label>
    </Layout>
  );
};
