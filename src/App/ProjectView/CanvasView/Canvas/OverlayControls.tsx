import {
  FC,
  MouseEvent as ReactMouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import { Coordinates, Point } from "./Types";

const Layout = styled.svg`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;
const Selection = styled.rect`
  cursor: move;
  fill: #00ffff33;
  stroke: cyan;
  stroke-width: 1px;
`;
const Handle = styled.rect`
  fill: #00ffff;
`;
const UpperLeftHandle = styled(Handle)`
  cursor: nw-resize;
`;
const UpperRightHandle = styled(Handle)`
  cursor: ne-resize;
`;
const LowerLeftHandle = styled(Handle)`
  cursor: sw-resize;
`;
const LowerRightHandle = styled(Handle)`
  cursor: se-resize;
`;

export type OverlayControlsProps = {
  handleSize?: number;
  coordinates?: Coordinates;
  onCoordinatesChange?: (coordinates: Coordinates) => void;
  onApplyCoordinatesChanges?: (coordinates: Coordinates) => void;
};

export const OverlayControls: FC<OverlayControlsProps> = ({
  handleSize = 10,
  coordinates,
  onCoordinatesChange,
  onApplyCoordinatesChanges,
}) => {
  const {
    x: coordX = 0,
    y: coordY = 0,
    width: coordWidth = 0,
    height: coordHeight = 0,
  } = coordinates || {};
  const updatedCoordinatesRef = useRef<Coordinates>({
    x: coordX,
    y: coordY,
    width: coordWidth,
    height: coordHeight,
  });
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState<"nw" | "ne" | "sw" | "se" | false>(
    false,
  );
  const [draggingFromOffset, setDraggingFromOffset] = useState<Point>({
    x: 0,
    y: 0,
  });
  const overlayRef = useRef<SVGSVGElement>(null);
  const selectionRef = useRef<SVGRectElement>(null);
  const upperLeftHandleRef = useRef<SVGRectElement>(null);
  const upperRightHandleRef = useRef<SVGRectElement>(null);
  const lowerLeftHandleRef = useRef<SVGRectElement>(null);
  const lowerRightHandleRef = useRef<SVGRectElement>(null);
  const onSetSelectionCoordinates = useCallback(
    (newSelectionCoordinates: Coordinates) => {
      const { x, y, width, height } = newSelectionCoordinates;

      if (selectionRef.current) {
        selectionRef.current.setAttribute("x", `${x}`);
        selectionRef.current.setAttribute("y", `${y}`);
        selectionRef.current.setAttribute("width", `${width}`);
        selectionRef.current.setAttribute("height", `${height}`);
      }

      if (upperLeftHandleRef.current) {
        upperLeftHandleRef.current.setAttribute("x", `${x}`);
        upperLeftHandleRef.current.setAttribute("y", `${y}`);
      }

      if (upperRightHandleRef.current) {
        upperRightHandleRef.current.setAttribute(
          "x",
          `${x + width - handleSize}`,
        );
        upperRightHandleRef.current.setAttribute("y", `${y}`);
      }

      if (lowerLeftHandleRef.current) {
        lowerLeftHandleRef.current.setAttribute("x", `${x}`);
        lowerLeftHandleRef.current.setAttribute(
          "y",
          `${y + height - handleSize}`,
        );
      }

      if (lowerRightHandleRef.current) {
        lowerRightHandleRef.current.setAttribute(
          "x",
          `${x + width - handleSize}`,
        );
        lowerRightHandleRef.current.setAttribute(
          "y",
          `${y + height - handleSize}`,
        );
      }

      updatedCoordinatesRef.current = newSelectionCoordinates;

      if (onCoordinatesChange) {
        onCoordinatesChange(newSelectionCoordinates);
      }
    },
    [onCoordinatesChange],
  );
  const onDragStart = useCallback(
    (event: ReactMouseEvent<SVGRectElement, MouseEvent>) => {
      if (overlayRef.current && selectionRef.current) {
        const { clientX, clientY } = event;
        const { left: selectionX, top: selectionY } =
          selectionRef.current.getBoundingClientRect();

        setDragging(true);
        setDraggingFromOffset({
          x: clientX - selectionX,
          y: clientY - selectionY,
        });
      }
    },
    [],
  );
  const onDragEnd = useCallback(() => {
    setDragging(false);
    setDraggingFromOffset({
      x: 0,
      y: 0,
    });

    if (onApplyCoordinatesChanges) {
      onApplyCoordinatesChanges(updatedCoordinatesRef.current);
    }
  }, [onApplyCoordinatesChanges]);
  const onMouseMove = useCallback(
    (event: ReactMouseEvent<SVGSVGElement, MouseEvent>) => {
      const { offsetX = 0, offsetY = 0 } = event.nativeEvent;
      const { x: draggingFromX = 0, y: draggingFromY = 0 } = draggingFromOffset;

      if (dragging) {
        const newCoords = {
          x: offsetX - draggingFromX,
          y: offsetY - draggingFromY,
          width: coordWidth,
          height: coordHeight,
        };

        onSetSelectionCoordinates(newCoords);
      } else if (resizing) {
        if (resizing === "nw") {
          const newCoords = {
            x: offsetX,
            y: offsetY,
            width: coordX + coordWidth - offsetX,
            height: coordY + coordHeight - offsetY,
          };

          onSetSelectionCoordinates(newCoords);
        } else if (resizing === "ne") {
          const newCoords = {
            x: coordX,
            y: offsetY,
            width: offsetX - coordX,
            height: coordY + coordHeight - offsetY,
          };

          onSetSelectionCoordinates(newCoords);
        } else if (resizing === "sw") {
          const newCoords = {
            x: offsetX,
            y: coordY,
            width: coordX + coordWidth - offsetX,
            height: offsetY - coordY,
          };

          onSetSelectionCoordinates(newCoords);
        } else if (resizing === "se") {
          const newCoords = {
            x: coordX,
            y: coordY,
            width: offsetX - coordX,
            height: offsetY - coordY,
          };

          onSetSelectionCoordinates(newCoords);
        }
      }
    },
    [
      dragging,
      resizing,
      draggingFromOffset,
      onSetSelectionCoordinates,
      coordWidth,
      coordHeight,
    ],
  );
  const onUpperLeftHandleMouseDown = useCallback(() => setResizing("nw"), []);
  const onUpperRightHandleMouseDown = useCallback(() => setResizing("ne"), []);
  const onLowerLeftHandleMouseDown = useCallback(() => setResizing("sw"), []);
  const onLowerRightHandleMouseDown = useCallback(() => setResizing("se"), []);
  const onResizeHandleMouseUp = useCallback(() => {
    setResizing(false);
    setDraggingFromOffset({
      x: 0,
      y: 0,
    });

    if (onApplyCoordinatesChanges) {
      onApplyCoordinatesChanges(updatedCoordinatesRef.current);
    }
  }, [onApplyCoordinatesChanges]);

  useEffect(() => {
    if (coordinates) {
      onSetSelectionCoordinates(coordinates);
    }
  }, [coordinates, onSetSelectionCoordinates]);

  return (
    <Layout
      ref={overlayRef}
      onMouseMove={dragging || resizing ? onMouseMove : undefined}
      onMouseUp={
        dragging ? onDragEnd : resizing ? onResizeHandleMouseUp : undefined
      }
    >
      {coordinates ? (
        <>
          <Selection
            ref={selectionRef}
            onMouseDown={onDragStart}
            onMouseUp={onDragEnd}
          />
          <UpperLeftHandle
            ref={upperLeftHandleRef}
            width={handleSize}
            height={handleSize}
            onMouseDown={onUpperLeftHandleMouseDown}
            onMouseUp={onResizeHandleMouseUp}
          />
          <UpperRightHandle
            ref={upperRightHandleRef}
            width={handleSize}
            height={handleSize}
            onMouseDown={onUpperRightHandleMouseDown}
            onMouseUp={onResizeHandleMouseUp}
          />
          <LowerLeftHandle
            ref={lowerLeftHandleRef}
            width={handleSize}
            height={handleSize}
            onMouseDown={onLowerLeftHandleMouseDown}
            onMouseUp={onResizeHandleMouseUp}
          />
          <LowerRightHandle
            ref={lowerRightHandleRef}
            width={handleSize}
            height={handleSize}
            onMouseDown={onLowerRightHandleMouseDown}
            onMouseUp={onResizeHandleMouseUp}
          />
        </>
      ) : undefined}
    </Layout>
  );
};
