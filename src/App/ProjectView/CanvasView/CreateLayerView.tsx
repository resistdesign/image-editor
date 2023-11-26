import { FC, useCallback } from "react";
import { Layer } from "../../../Types/Layer";
import styled from "styled-components";
import { loadImage } from "./Utils/File";

const Layout = styled.form`
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  gap: 1em;
`;
const Controls = styled.div`
  flex: 1 0 auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: stretch;
  gap: 1em;
`;
const ControlButton = styled.button`
  flex: 1 0 auto;
`;

export type CreateLayerViewProps = {
  createLayer: (layer: Layer) => void;
};

export const CreateLayerView: FC<CreateLayerViewProps> = ({ createLayer }) => {
  const onSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      // Load an image from a file.
      try {
        const {
          name: imageName,
          type: imageType,
          data: imageData,
        } = await loadImage();
        const newLayer: Layer = {
          label: `${imageName} (${imageType})`,
          data: imageData,
        };

        createLayer(newLayer);
      } catch (error) {
        // Ignore for now.
      }
    },
    [createLayer],
  );

  return (
    <Layout onSubmit={onSubmit}>
      <Controls>
        <ControlButton type="submit">New Layer</ControlButton>
      </Controls>
    </Layout>
  );
};
