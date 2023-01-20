import React, { useEffect, useRef } from "react";
import usePosition, { positionType } from "shared/hooks/usePosition";
import useRerender from "shared/hooks/useRerender";
import { useXWrapperRegister } from "./XWrapper";
import { getElementByPropGiven } from "./utils";
import { IPoint, isPoint, XElemRef } from "./types";
import { useEnsureContext } from "./internal/hooks";
import { Rectangle } from "./path";
import PositionProvider from "./PositionProvider";
import { usePassRef } from "shared/hooks/usePassChildrenRef";
import { HeadProvider } from "./XHead";

export interface XArrowProps {
  // children is a jsx elements of type svg like <circle .../> or <path .../>
  children: React.ReactNode;

  // a reference to the start element, can be a ref, an id or a (x,y) position
  start: XElemRef;
  // a reference to the end element, can be a ref, an id or a (x,y) position
  end: XElemRef;

  // props that will be passed to top level <div/> element wrapping the svg shape
  divWrapperProps?: React.HTMLProps<HTMLDivElement>;
  // props that will be passed to top level <svg/> element, containing all arrow parts
  svgCanvasProps?: React.SVGProps<SVGSVGElement>;
}

export const XArrow = React.forwardRef(function XArrow(props: XArrowProps, forwardedRef: React.ForwardedRef<SVGSVGElement>) {
  // console.log("XArrow");
  const render = useRerender();

  useXWrapperRegister(render, true);

  useEffect(() => {
    const monitorDOMChanges = () => {
      window.addEventListener("resize", render);
      return () => {
        window.removeEventListener("resize", render);
      };
    };

    const cleanMonitorDOMChanges = monitorDOMChanges();
    return () => {
      cleanMonitorDOMChanges();
    };
  }, []);

  const rootDivRef = usePassRef<HTMLDivElement>(forwardedRef);
  const svgCanvasRef = useRef<SVGSVGElement>(null);

  const rootPosition = usePosition(rootDivRef.current);
  const startLocation = getElementByPropGiven(props.start);
  const endLocation = getElementByPropGiven(props.end);
  let startPosition: positionType | null = usePosition(isPoint(startLocation) ? null : startLocation),
    endPosition: positionType | null = usePosition(isPoint(endLocation) ? null : endLocation);

  if (isPoint(startLocation))
    startPosition = {
      left: startLocation.x,
      top: startLocation.y,
      right: startLocation.x,
      bottom: startLocation.y,
      width: 0,
      height: 0,
    };
  if (isPoint(endLocation))
    endPosition = {
      left: endLocation.x,
      top: endLocation.y,
      right: endLocation.x,
      bottom: endLocation.y,
      width: 0,
      height: 0,
    };

  let startPoint = { x: 0, y: 0 };
  let endPoint = { x: 0, y: 0 };
  if (rootPosition) {
    if (startPosition) {
      // offset by the root div position
      startPosition.left -= rootPosition.left;
      startPosition.top -= rootPosition.top;
      startPosition.bottom -= rootPosition.bottom;
      startPosition.right -= rootPosition.right;

      // default connection is from the middle of the elements
      startPoint = {
        x: startPosition.left + startPosition.width / 2,
        y: startPosition.top + startPosition.height / 2,
      };
    }

    if (endPosition) {
      endPosition.left -= rootPosition.left;
      endPosition.top -= rootPosition.top;
      endPosition.bottom -= rootPosition.bottom;
      endPosition.right -= rootPosition.right;

      endPoint = {
        x: endPosition.left + endPosition.width / 2,
        y: endPosition.top + endPosition.height / 2,
      };
    }
  }

  const startRect = startPosition && new Rectangle(startPosition);
  const endRect = endPosition && new Rectangle(endPosition);

  return (
    <div
      ref={rootDivRef}
      style={{ position: "absolute", pointerEvents: "none", ...props.divWrapperProps?.style }}
      {...props.divWrapperProps}
    >
      <svg
        style={{
          position: "absolute",
          fill: "transparent",
          overflow: "visible",
          ...props.svgCanvasProps?.style,
        }}
        ref={svgCanvasRef}
        {...props.svgCanvasProps}
      >
        <XArrowContext.Provider value={{ startRect, endRect, __mounted: true }}>
          <PositionProvider value={{ startPoint, endPoint }}>
            <HeadProvider value={{ color: "cornflowerblue", rotate: 0, size: 30 }}>{props.children}</HeadProvider>
          </PositionProvider>
        </XArrowContext.Provider>
      </svg>
    </div>
  );
});
export default XArrow;

const XArrowContext = React.createContext<{
  startRect: Rectangle | null;
  endRect: Rectangle | null;
  // startPoint: IPoint;
  // endPoint: IPoint;
  __mounted: boolean;
}>({
  startRect: null,
  endRect: null,
  // startPoint: { x: 0, y: 0 },
  // endPoint: { x: 0, y: 0 },
  __mounted: false,
});
export const useXArrow = () => {
  const val = React.useContext(XArrowContext);
  useEnsureContext(val, "XArrow", "useXContext");
  return val;
};

interface ProvideXContextProps {
  children: (context: ReturnType<typeof useXArrow>) => React.ReactNode;
}

export const ProvideXArrow = (props: ProvideXContextProps) => {
  const val = useXArrow();
  return <>{props.children(val)}</>;
};
