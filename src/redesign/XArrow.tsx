import React, { useEffect, useRef } from "react";
import usePosition, { positionType } from "shared/hooks/usePosition";
import useRerender from "shared/hooks/useRerender";
import { useXWrapperRegister } from "./XWrapper";
import { getElementByPropGiven } from "./utils";
import { isPoint, Point, XElemRef } from "./types";
import { useOneTimeWarn } from "shared/hooks/useOneTimeWarn";

export interface XArrowProps {
  children: React.ReactNode;

  start: XElemRef;
  end: XElemRef;

  divWrapperProps?: React.HTMLProps<HTMLDivElement>;
  svgCanvasProps?: React.SVGProps<SVGSVGElement>;
}

export const XArrow = (props: XArrowProps) => {
  // console.log("XArrow");
  const render = useRerender();
  useXWrapperRegister(render);

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

  const rootDivRef = useRef<HTMLDivElement>(null);
  const svgCanvasRef = useRef<SVGSVGElement>(null);

  const rootElem = usePosition(rootDivRef.current);
  let startElem: positionType | null, endElem: positionType | null;
  const startLocation = getElementByPropGiven(props.start);
  const endLocation = getElementByPropGiven(props.end);
  if (!isPoint(startLocation)) startElem = usePosition(startLocation);
  else {
    startElem = { left: startLocation.x, top: startLocation.y, width: 0, height: 0, right: startLocation.x, bottom: startLocation.y };
  }
  if (!isPoint(endLocation)) endElem = usePosition(endLocation);
  else {
    endElem = { left: endLocation.x, top: endLocation.y, width: 0, height: 0, right: endLocation.x, bottom: endLocation.y };
  }

  let startPoint = { x: 0, y: 0 };
  let endPoint = { x: 0, y: 0 };
  if (rootElem) {
    if (startElem) {
      // offset by the root div position
      startElem.left -= rootElem.left;
      startElem.top -= rootElem.top;
      startElem.bottom -= rootElem.bottom;
      startElem.right -= rootElem.right;

      // default connection is from the middle of the elements
      startPoint = {
        x: startElem.left + startElem.width / 2,
        y: startElem.top + startElem.height / 2,
      };
    }

    if (endElem) {
      endElem.left -= rootElem.left;
      endElem.top -= rootElem.top;
      endElem.bottom -= rootElem.bottom;
      endElem.right -= rootElem.right;

      endPoint = {
        x: endElem.left + endElem.width / 2,
        y: endElem.top + endElem.height / 2,
      };
    }
  }
  const contextValue = { startElem, endElem, startPoint, endPoint, __mounted: true };

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
        <XArrowContext.Provider value={contextValue}>{props.children}</XArrowContext.Provider>
      </svg>
    </div>
  );
};
export default XArrow;

const XArrowContext = React.createContext<{
  startElem: positionType | null;
  endElem: positionType | null;
  startPoint: Point;
  endPoint: Point;
  __mounted: boolean;
}>({
  startElem: null,
  endElem: null,
  startPoint: { x: 0, y: 0 },
  endPoint: { x: 0, y: 0 },
  __mounted: false,
});
export const useXContext = () => {
  const val = React.useContext(XArrowContext);
  const warn = useOneTimeWarn("react-xarrows: ");
  if (!val.__mounted) {
    warn(
      "useXArrowContext is only available inside XArrow, wrap your component with XArrow to use it.\n" +
        `Check ${new Error().stack?.split("at ")[2].trim()}\n\n`
    );
  }
  return val;
};

interface ProvideXContextProps {
  children: (context: ReturnType<typeof useXContext>) => React.ReactNode;
}

export const ProvideXContext = (props: ProvideXContextProps) => {
  const val = useXContext();
  return <>{props.children(val)}</>;
};
