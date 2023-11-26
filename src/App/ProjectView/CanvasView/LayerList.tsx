import { FC } from "react";
import { Layer } from "../../../Types/Layer";
import styled from "styled-components";
import { LayerItem } from "./LayerList/LayerItem";

const Layout = styled.div`
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  gap: 1em;
  overflow: auto;
`;

export type LayerListProps = {
  selectedLayer?: Layer;
  onSelectedLayerChange: (layer?: Layer) => void;
  layers: Layer[];
  onLayersChange: (layers: Layer[]) => void;
};

export const LayerList: FC<LayerListProps> = ({
  selectedLayer,
  onSelectedLayerChange,
  layers = [],
  onLayersChange,
}) => {
  return (
    <Layout>
      {layers.map((layer, index) => {
        const selected = selectedLayer === layer;
        const onSelectedChange = (selected: boolean) => {
          if (selected) {
            onSelectedLayerChange(layer);
          } else {
            onSelectedLayerChange(undefined);
          }
        };

        return (
          <LayerItem
            key={`LayerItem:${index}`}
            selected={selected}
            onSelectedChange={onSelectedChange}
            layer={layer}
          />
        );
      })}
    </Layout>
  );
};
