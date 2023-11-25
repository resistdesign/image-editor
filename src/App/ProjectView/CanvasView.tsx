import styled from "styled-components";
import { FC } from "react";
import { Project } from "../../Types/Project";

const Layout = styled.div``;

export type CanvasViewProps = {
  openProject?: Project;
};
export const CanvasView: FC<CanvasViewProps> = ({ openProject }) => {
  const { label } = openProject || ({ label: "No Project To View" } as Project);

  return <Layout>{label}</Layout>;
};
