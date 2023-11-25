import {FC, useCallback} from "react";
import { Layer } from "../../../../Types/Layer";
import styled from "styled-components";

const Layout = styled.li`
  flex: 0 0 auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 1em;
  overflow: auto;
  cursor: pointer;
`;
const Label = styled.div`
  flex: 1 0 auto;
  cursor: pointer;
`;

export type LayerItemProps = {
  selected?: boolean;
  onSelectedChange?: (selected: boolean) => void;
  layer: Layer;
};

export const LayerItem: FC<LayerItemProps> = ({
  selected = false,
  onSelectedChange,
  layer,
}) => {
  const onToggleSelected = useCallback(() => {
    if (onSelectedChange) {
      onSelectedChange(!selected);
    }
  }, [selected, onSelectedChange]);

  return (
    <Layout>
      <Label
        onClick={onToggleSelected}
      >Layer</Label>
    </Layout>
  );
};
