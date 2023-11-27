import styled, { css } from "styled-components";
import { CanvasTool } from "./Types";
import { FC, useCallback } from "react";

const Layout = styled.button<{
  selected?: boolean;
}>`
  flex: 0 1 auto;
  padding: 0.125em;
  width: 1.75em;
  height: 1.75em;

  ${({ selected }) =>
    selected
      ? css`
          background-color: var(--pico-primary-focus);
        `
      : ""}
`;

export type ToolButtonProps = {
  selected?: boolean;
  tool: CanvasTool;
  onClick?: (tool: CanvasTool) => void;
};

export const ToolButton: FC<ToolButtonProps> = ({
  selected = false,
  tool,
  onClick,
}) => {
  const { id, label, icon } = tool;
  const onClickInternal = useCallback(() => {
    if (onClick) {
      onClick(tool);
    }
  }, [onClick, tool]);

  return (
    <Layout
      selected={selected}
      id={id}
      title={label}
      onClick={onClickInternal}
      dangerouslySetInnerHTML={{ __html: icon }}
    />
  );
};
