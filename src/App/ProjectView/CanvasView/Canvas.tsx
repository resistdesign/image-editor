import { FC, useCallback, useState } from "react";
import { Project } from "../../../Types/Project";
import styled from "styled-components";
import { LayerList } from "./LayerList";
import { Layer } from "../../../Types/Layer";

const Layout = styled.div``;
const Header = styled.div``;
const Body = styled.div`
  flex: 1 0 auto;
  display: grid;
  grid-template-columns: 1fr auto 3fr;
  gap: 1em;
`;
const Tools = styled.div``;
const Main = styled.div``;
const Sidebar = styled.div``;

export type CanvasProps = {
  openProject: Project;
  onOpenProjectChange: (openProject: Project) => void;
};

export const Canvas: FC<CanvasProps> = ({
  openProject,
  onOpenProjectChange,
}) => {
  const { label, layers } = openProject;
  const [selectedLayer, setSelectedLayer] = useState<Layer>();
  const onLayersChange = useCallback(
    (layers: Layer[]) => {
      onOpenProjectChange({
        ...openProject,
        layers,
      });
    },
    [openProject, onOpenProjectChange],
  );
  // TODO: Debounce changes.

  return (
    <Layout>
      <Header>{label}</Header>
      <Body>
        <Tools>Tools</Tools>
        <Main>Main</Main>
        <Sidebar>
          <LayerList
            selectedLayer={selectedLayer}
            onSelectedLayerChange={setSelectedLayer}
            layers={layers}
            onLayersChange={onLayersChange}
          />
        </Sidebar>
      </Body>
    </Layout>
  );
};
