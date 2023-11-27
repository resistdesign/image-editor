import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Project } from "../../../Types/Project";
import styled from "styled-components";
import { LayerList } from "./LayerList";
import { Layer } from "../../../Types/Layer";
import { CreateLayerView } from "./CreateLayerView";
import { LayeredCanvas } from "./Canvas/LayeredCanvas";
import { OverlayControls } from "./Canvas/OverlayControls";
import { CanvasState, CanvasTool, Coordinates } from "./Canvas/Types";
import { BasicTools } from "./Canvas/BasicTools";
import { ToolButton } from "./Canvas/ToolButton";

const Layout = styled.div`
  flex: 1 0 auto;
  display: grid;
  grid-template-rows: 1fr 0.125fr 10fr;
  overflow: hidden;
`;
const Header = styled.div`
  flex: 0 0 auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  font-size: 1.25em;
  gap: 1em;
`;
const Progress = styled.progress`
  flex: 0 0 auto;
  height: 0.125em;
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  border-radius: 0;
`;
const ProgressSpacer = styled.div`
  flex: 0 0 auto;
  height: 0.125em;
  box-sizing: border-box;
  padding: 0;
  margin: 0;
`;
const Body = styled.div`
  flex: 1 0 auto;
  display: grid;
  grid-template-columns: 1.75em 15fr 5fr;
  gap: 1em;
  overflow: hidden;
`;
const Tools = styled.div`
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  gap: 1em;
`;
const Main = styled.div`
  position: relative;
  flex: 1 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  overflow: hidden;
  background-color: white;
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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false);
  const { label = "", layers = [] } = openProject;
  const [selectedTool, setSelectedTool] = useState<CanvasTool | undefined>(
    BasicTools[0],
  );
  const selectedToolUsesOverlay = useMemo(() => {
    const { useOverlay = false } = selectedTool || {};

    return useOverlay;
  }, [selectedTool]);
  const [selectedLayerIndex, setSelectedLayerIndex] = useState<number>(-1);
  const selectedLayer = useMemo<Layer | undefined>(
    () => layers[selectedLayerIndex],
    [layers, selectedLayerIndex],
  );
  const canvasState = useMemo<CanvasState>(
    () => ({
      canvas: canvasRef.current,
      openProject,
      selectedLayerIndex,
    }),
    [selectedTool, selectedLayerIndex, openProject],
  );
  const overlayCoordinates = useMemo(() => {
    if (selectedTool) {
      const { useOverlay = false, getOverlayCoordinates } = selectedTool;

      if (useOverlay && getOverlayCoordinates) {
        return getOverlayCoordinates(canvasState);
      }
    }
  }, [selectedTool, canvasState]);
  const onSetSelectedLayer = useCallback(
    (newSelectedLayer?: Layer) => {
      if (newSelectedLayer) {
        const newSelectedLayerIndex = layers.indexOf(newSelectedLayer);

        setSelectedLayerIndex(newSelectedLayerIndex);
      }
    },
    [layers],
  );
  const onLayersChange = useCallback(
    (newLayers: Layer[]) => {
      clearTimeout(updateLayersTimerId.current);
      setUnsavedChanges(true);

      updateLayersTimerId.current = setTimeout(() => {
        onOpenProjectChange({
          ...openProject,
          layers: newLayers,
        });
        setUnsavedChanges(false);
      }, 800);
    },
    [openProject, onOpenProjectChange],
  );
  const updateLayersTimerId = useRef<any>(undefined);
  const onOverlayCoordinatesChange = useCallback(
    (newOverlayCoordinates: Coordinates) => {
      if (selectedTool) {
        const { useOverlay = false, onCanvasStateChange } = selectedTool;

        if (useOverlay && onCanvasStateChange) {
          onCanvasStateChange(canvasState, newOverlayCoordinates);
        }
      }
    },
    [selectedTool, selectedLayerIndex, canvasState, layers, onLayersChange],
  );
  const onApplyOverlayCoordinatesChanges = useCallback(
    (newOverlayCoordinates: Coordinates) => {
      if (selectedTool) {
        const { useOverlay = false, apply } = selectedTool;

        if (useOverlay && apply) {
          const newLayer = apply(canvasState, newOverlayCoordinates);

          if (newLayer) {
            const newLayerList = layers.map((layer, index) =>
              index === selectedLayerIndex ? newLayer : layer,
            );

            onLayersChange(newLayerList);
          }
        }
      }
    },
    [selectedTool, selectedLayerIndex, canvasState, layers, onLayersChange],
  );
  const onCreateLayer = useCallback(
    (newLayer: Layer) => {
      const newLayers = [...layers, newLayer];

      onLayersChange(newLayers);
    },
    [layers, onLayersChange],
  );

  useEffect(() => clearTimeout(updateLayersTimerId.current), []);

  return (
    <Layout className="Canvas">
      <Header className="CanvasHeader">{label}</Header>
      {unsavedChanges ? <Progress /> : <ProgressSpacer />}
      <Body className="CanvasBody">
        <Tools>
          {BasicTools.map((tool) => {
            const { id: toolId } = tool;

            return (
              <ToolButton
                key={`ToolButton:${toolId}`}
                selected={selectedTool === tool}
                tool={tool}
                onClick={setSelectedTool}
              />
            );
          })}
        </Tools>
        <Main>
          <LayeredCanvas ref={canvasRef} layers={layers} />
          {selectedToolUsesOverlay ? (
            <OverlayControls
              coordinates={overlayCoordinates}
              onCoordinatesChange={onOverlayCoordinatesChange}
              onApplyCoordinatesChanges={onApplyOverlayCoordinatesChanges}
            />
          ) : undefined}
        </Main>
        <Sidebar>
          <CreateLayerView createLayer={onCreateLayer} />
          <LayerList
            selectedLayer={selectedLayer}
            onSelectedLayerChange={onSetSelectedLayer}
            layers={layers}
          />
        </Sidebar>
      </Body>
    </Layout>
  );
};
