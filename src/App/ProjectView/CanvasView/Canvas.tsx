import { FC, useCallback, useEffect, useRef, useState } from "react";
import { Project } from "../../../Types/Project";
import styled from "styled-components";
import { LayerList } from "./LayerList";
import { Layer } from "../../../Types/Layer";
import { CreateLayerView } from "./CreateLayerView";
import { LayeredCanvas } from "./Canvas/LayeredCanvas";

const Layout = styled.div`
  flex: 1 0 auto;
  display: grid;
  grid-template-rows: 1fr 10fr;
  overflow: hidden;
`;
const Header = styled.div`
  flex: 0 0 auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  font-size: 1.25em;
`;
const Body = styled.div`
  flex: 1 0 auto;
  display: grid;
  grid-template-columns: 1fr 10fr 3fr;
  gap: 1em;
  overflow: hidden;
`;
const Tools = styled.div``;
const Main = styled.div`
  flex: 1 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  overflow: hidden;
`;
const Sidebar = styled.div`
  flex: 1 0 auto;
  display: grid;
  grid-template-rows: 1fr 10fr;
  overflow: hidden;
`;

export type CanvasProps = {
  openProject: Project;
  onOpenProjectChange: (openProject: Project) => void;
};

export const Canvas: FC<CanvasProps> = ({
  openProject,
  onOpenProjectChange,
}) => {
  const debounceLayersChangeTimerId = useRef<any>(); // TRICKY: Don't do this any other way, you think you know what you're doing, but you don't.
  const { label, layers: originalLayers = [] } = openProject;
  const [layers, setLayers] = useState<Layer[]>(originalLayers);
  const [selectedLayer, setSelectedLayer] = useState<Layer>();
  const onLayersChange = useCallback(
    (newLayers: Layer[]) => {
      // IMPORTANT: Debounce changes.
      clearTimeout(debounceLayersChangeTimerId.current);

      debounceLayersChangeTimerId.current = setTimeout(() => {
        onOpenProjectChange({
          ...openProject,
          layers: newLayers,
        });

        setLayers(newLayers);
      }, 800);
    },
    [openProject, onOpenProjectChange],
  );
  const onCreateLayer = useCallback(
    (layer: Layer) => {
      onLayersChange([layer, ...layers]);
    },
    [layers, onLayersChange],
  );

  useEffect(() => () => clearTimeout(debounceLayersChangeTimerId.current), []);

  useEffect(() => {
    const { layers: newOriginalLayers = [] } = openProject;

    setLayers(newOriginalLayers);
  }, [openProject]);

  return (
    <Layout className="Canvas">
      <Header className="CanvasHeader">{label}</Header>
      <Body className="CanvasBody">
        <Tools>Tools</Tools>
        <Main>
          <LayeredCanvas layers={layers} />
        </Main>
        <Sidebar>
          <CreateLayerView createLayer={onCreateLayer} />
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
