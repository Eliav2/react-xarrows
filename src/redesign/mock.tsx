import { Contains } from "../privateTypes";
import React, { useEffect, useLayoutEffect, useRef } from "react";
import usePosition, { positionType } from "shared/hooks/usePosition";
import useRerender from "shared/hooks/useRerender";
import { pick } from "shared/utils";
// import { useElement } from "../hooks/useElement";

type Point = Contains<{ x: number; y: number }>;
type XElemRefType = React.MutableRefObject<any> | string | Point;

export interface XArrowProps {
  children: React.ReactNode;

  start: XElemRefType;
  end: XElemRefType;

  divWrapperProps?: React.HTMLProps<HTMLDivElement>;
  svgCanvasProps?: React.SVGProps<SVGSVGElement>;
}

export const XArrow = (props: XArrowProps) => {
  const render = useRerender();
  const rootDivRef = useRef<HTMLDivElement>(null);
  const svgCanvasRef = useRef<SVGSVGElement>(null);

  const rootElem = usePosition(rootDivRef.current);
  const startElem = usePosition(getElementByPropGiven(props.start));
  const endElem = usePosition(getElementByPropGiven(props.end));

  // let startPoint = { x: (startElem?.left ?? 0) - (rootElem?.left ?? 0) };
  let startPoint = { x: 0, y: 0 };
  let endPoint = { x: 0, y: 0 };
  if (rootElem) {
    if (startElem)
      startPoint = {
        x: startElem.left - rootElem.left + startElem.width / 2,
        y: startElem.top - rootElem.top + startElem.height / 2,
      };
    if (endElem)
      endPoint = {
        x: endElem.left - rootElem.left + endElem.width / 2,
        y: endElem.top - rootElem.top + endElem.height / 2,
      };
  }
  const contextValue = { startElem, endElem, startPoint, endPoint };

  const xWrapperContextVal = useXWrapperContext();
  useLayoutEffect(() => {
    xWrapperContextVal.update = render;
  }, [rootDivRef.current]);

  useEffect(() => {
    // set all props on first render
    const monitorDOMchanges = () => {
      window.addEventListener("resize", render);
      return () => {
        window.removeEventListener("resize", render);
      };
    };

    const cleanMonitorDOMchanges = monitorDOMchanges();
    return () => {
      cleanMonitorDOMchanges();
    };
  }, []);

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

const XArrowContext = React.createContext<{ startElem: positionType; endElem: positionType; startPoint: Point; endPoint: Point }>({
  startElem: null,
  endElem: null,
  startPoint: { x: 0, y: 0 },
  endPoint: { x: 0, y: 0 },
});
export const useXArrowContext = () => React.useContext(XArrowContext);

interface XWrapperProps {
  children: React.ReactNode;
}

const XWrapperContextDefault = {
  update: () => {},
};
export const XWrapper = (props: XWrapperProps) => {
  // value of the context will be mutated after mount of first XArrow
  return <XWrapperContext.Provider value={XWrapperContextDefault}>{props.children}</XWrapperContext.Provider>;
};
const XWrapperContext = React.createContext(XWrapperContextDefault);
const useXWrapperContext = () => React.useContext(XWrapperContext);
export const useUpdateXArrow = () => useXWrapperContext();

// interface XArrowElementProps {}

// export const XArrowElement = (props: XArrowElementProps) => {
//   const val = useXArrowContext();
//   console.log(val);
//   return (
//     <g style={{ transform: "translate(0)" }}>
//       <path d="M 10 10 H 90 V 90 H 10 Z" fill="transparent" stroke="black" />
//     </g>
//   );
// };

interface ProvideXContextProps {
  children: (context: ReturnType<typeof useXArrowContext>) => React.ReactNode;
}
export const ProvideXContext = (props: ProvideXContextProps) => {
  const val = useXArrowContext();
  return <>{props.children(val)}</>;
};

interface XLineProps extends React.SVGProps<SVGLineElement> {}

export const XLine = (props: XLineProps) => {
  const val = useXArrowContext();
  // console.log(val);
  // return <path d="M 10 10 H 90 V 90 H 10 Z" fill="transparent" stroke="black" />;
  return (
    <line
      x1={val.startPoint.x}
      y1={val.startPoint.y}
      x2={val.endPoint.x}
      y2={val.endPoint.y}
      {...props}
      fill="transparent"
      stroke="white"
      strokeWidth={3}
    />
  );
};

export const getElementByPropGiven = (ref: XElemRefType): HTMLElement => {
  let myRef;
  if (typeof ref === "string") {
    myRef = document.getElementById(ref);
  } else myRef = ref?.current;
  return myRef;
};
