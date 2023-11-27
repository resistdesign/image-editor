import { FC, useCallback } from "react";
import { Layer } from "../../../../Types/Layer";
import styled, { css } from "styled-components";

const Layout = styled.div`
  flex: 0 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  gap: 1em;
`;
const Label = styled.div<{ selected?: boolean }>`
  flex: 0 0 auto;
  display: block;
  cursor: pointer;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding: 0.25em;
  border-radius: 0.25em;

  ${({selected}) =>
          selected
                  ? css`
                    color: var(--pico-primary-inverse);
                    background-color: var(--pico-primary-focus);
                  `
                  : ''}
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
  const { label } = layer;
  const onToggleSelected = useCallback(() => {
    if (onSelectedChange) {
      onSelectedChange(!selected);
    }
  }, [selected, onSelectedChange]);

  return (
    <Layout>
      <Label selected={selected} title={label} onClick={onToggleSelected}>
        {label}
      </Label>
    </Layout>
  );
};
