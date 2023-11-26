import { FC, useEffect, useRef, useState } from "react";
import { Layer } from "../../../../Types/Layer";
import styled from "styled-components";

const Layout = styled.canvas`
  flex: 1 0 auto;
`;

export type LayeredCanvasProps = {
  layers?: Layer[];
};

export const LayeredCanvas: FC<LayeredCanvasProps> = ({ layers = [] }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [
    { width: canvasWidth = 800, height: canvasHeight = 600 },
    setDimensions,
  ] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      if (entries.length === 0 || !entries[0].target) return;
      const { width = 800, height = 600 } = entries[0].contentRect;
      setDimensions({ width, height });
    });

    if (canvasRef.current?.parentElement) {
      resizeObserver.observe(canvasRef.current.parentElement);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const drawLayer = async (layer: Layer) => {
        const { x: imageX = 0, y: imageY = 0, data: imageData } = layer;

        return new Promise<void>((resolve) => {
          const img = new Image();
          const url = URL.createObjectURL(imageData);

          img.onload = () => {
            ctx!.drawImage(img, imageX, imageY);
            URL.revokeObjectURL(url);
            resolve();
          };

          img.src = url;
        });
      };

      const drawLayersInOrder = async () => {
        const layersReversed = [...layers].reverse();

        for (const layer of layersReversed) {
          await drawLayer(layer);
        }
      };

      drawLayersInOrder();
    }
  }, [layers]);

  return <Layout ref={canvasRef} width={canvasWidth} height={canvasHeight} />;
};
