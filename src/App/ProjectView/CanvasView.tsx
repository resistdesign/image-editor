import styled from "styled-components";
import { FC, useCallback } from "react";
import { Project } from "../../Types/Project";
import { Canvas } from "./CanvasView/Canvas";

const Layout = styled.div`
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: stretch;
  gap: 1em;
`;
const EmptyState = styled.div`
  flex: 1 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export type CanvasViewProps = {
  openProject?: Project;
  updateProject: (openProject: Project) => void;
};
export const CanvasView: FC<CanvasViewProps> = ({
  openProject,
  updateProject,
}) => {
  const { label } = openProject || ({ label: "No Project To View" } as Project);
  const onOpenProjectChange = useCallback(
    (project: Project) => {
      updateProject(project);
    },
    [updateProject],
  );

  return (
    <Layout>
      {openProject ? (
        <Canvas
          openProject={openProject}
          onOpenProjectChange={onOpenProjectChange}
        />
      ) : (
        <EmptyState>No Project To View</EmptyState>
      )}
    </Layout>
  );
};
