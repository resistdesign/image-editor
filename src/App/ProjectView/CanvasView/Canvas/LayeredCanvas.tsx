import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { Layer } from "../../../../Types/Layer";
import styled from "styled-components";
import { drawLayers } from "./Utils";

const Layout = styled.canvas`
  flex: 1 0 auto;
`;

export type LayeredCanvasProps = {
  layers?: Layer[];
};

export const LayeredCanvas = forwardRef<HTMLCanvasElement, LayeredCanvasProps>(
  ({ layers = [] }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const onSetupCanvas = useCallback(() => {
      if (canvasRef) {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");

        if (canvas && ctx) {
          drawLayers(canvas, ctx, layers);
        }
      }
    }, [layers]);

    useImperativeHandle(ref, () => canvasRef.current!);

    useEffect(() => {
      const resizeObserver = new ResizeObserver((entries) => {
        if (entries.length === 0 || !entries[0].target) return;
        const { width = 800, height = 600 } = entries[0].contentRect;

        if (canvasRef.current) {
          const canvas = canvasRef.current;

          canvas.width = width;
          canvas.height = height;
          onSetupCanvas();
        }
      });

      if (canvasRef.current?.parentElement) {
        resizeObserver.observe(canvasRef.current.parentElement);
      }

      onSetupCanvas();

      return () => {
        resizeObserver.disconnect();
      };
    }, [onSetupCanvas]);

    return <Layout ref={canvasRef} />;
  },
);
