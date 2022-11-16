import React, { useEffect, useRef, useState } from 'react';
import { useElement } from '../hooks/useElement';
import { Contains, XElementType } from '../privateTypes';
import { Vector } from '../classes/path';
import { refType } from '../types';
import { createFeature } from '../components/XarrowBuilder';
import PT from 'prop-types';

const pRefType = PT.oneOfType([PT.string, PT.exact({ current: PT.any })]);

export type posStType = Contains<{ start: Vector; end: Vector }>;
const getPosition = (startElem: XElementType, endElem: XElementType, rootElem: XElementType) => {
  const { x: x1, y: y1 } = startElem.position;
  const { x: x2, y: y2 } = endElem.position;
  const posSt = { start: new Vector(x1, y1), end: new Vector(x2, y2) };
  return posSt;
};

export interface CoreStateChange {
  // the source element
  startElem: XElementType;
  // the target element
  endElem: XElementType;
  // the element which Xarrow is being mounted
  rootElem: XElementType;
  // reference to the Xarrow div wrapper
  rootDivRef: React.MutableRefObject<HTMLDivElement | null>;
  svgCanvasRef: React.MutableRefObject<SVGSVGElement | null>;
  // holds state of all positions of the Xarrow. being offset relative to the root element on jsx stage
  posSt: posStType;

  getPath: (posSt: posStType) => string;
}

export interface CoreProps {
  start: refType;
  end: refType;
  strokeWidth?: number;
  color?: string;
  lineColor?: string;
  zIndex?: number;

  svgCanvasProps?: React.SVGProps<SVGSVGElement>;
  svgCanvasStyle?: React.CSSProperties;
  divContainerProps?: React.HTMLProps<HTMLDivElement>;
  arrowBodyProps?: React.SVGProps<SVGPathElement>;
}

const Core = createFeature<CoreProps, {}, CoreStateChange>({
  name: 'Core',
  propTypes: {
    start: pRefType.isRequired,
    end: pRefType.isRequired,
    strokeWidth: PT.number,
    color: PT.string,
    zIndex: PT.number,

    svgCanvasStyle: PT.object,
    divContainerProps: PT.object,
    svgCanvasProps: PT.object,
    arrowBodyProps: PT.object,
  },
  defaultProps: {
    divContainerProps: {},
    svgCanvasProps: {},
    svgCanvasStyle: {},
    arrowBodyProps: {},
    strokeWidth: 4,
    color: 'CornflowerBlue',
    lineColor: undefined,
    zIndex: undefined,
  },
  state: ({ state, props }) => {
    const rootDivRef = useRef<HTMLDivElement>(null);
    const svgCanvasRef = useRef<SVGSVGElement>(null);

    const startElem = useElement(props.start);
    const endElem = useElement(props.end);
    const rootElem = useElement(rootDivRef);

    // on mount
    const [, setRender] = useState({});
    const forceRerender = () => setRender({});
    useEffect(() => {
      // set all props on first render
      const monitorDOMchanges = () => {
        window.addEventListener('resize', forceRerender);
        return () => {
          window.removeEventListener('resize', forceRerender);
        };
      };

      const cleanMonitorDOMchanges = monitorDOMchanges();
      return () => {
        cleanMonitorDOMchanges();
      };
    }, []);

    const posSt = getPosition(startElem, endElem, rootElem);
    const getPath = (pos = posSt) => `M ${pos.start.x} ${pos.start.y} L ${pos.end.x} ${pos.end.y}`;
    return { startElem, endElem, rootElem, rootDivRef, posSt, getPath, svgCanvasRef };
  },
  jsx: ({ state, props, nextJsx }) => {
    const { posSt, rootElem } = state;

    const { strokeWidth, color, lineColor = color, zIndex } = props;

    //offset all vectors relative to the origin of divContainer
    for (let vectKey in posSt) {
      posSt[vectKey] = posSt[vectKey].sub(rootElem.position);
    }

    // in case user passed overriding props such ref or style strip them and handel them separately
    const { style: divStyle, ref: divRef = { current: null }, ...divContainerProps } = props.divContainerProps;
    (divRef as React.MutableRefObject<HTMLDivElement>).current = state.rootDivRef.current;
    const { style: svgStyle, ref: svgRef = { current: null }, ...svgCanvasProps } = props.svgCanvasProps;
    (svgRef as React.MutableRefObject<SVGSVGElement>).current = state.svgCanvasRef.current;

    return (
      <div
        ref={state.rootDivRef}
        style={{ position: 'absolute', pointerEvents: 'none', zIndex, ...divStyle }}
        {...divContainerProps}>
        <svg
          style={{
            position: 'absolute',
            fill: 'transparent',
            overflow: 'visible',
            ...props.svgCanvasStyle,
          }}
          ref={state.svgCanvasRef}
          {...props.svgCanvasProps}>
          <path d={state.getPath(posSt)} strokeWidth={strokeWidth} stroke={lineColor} {...props.arrowBodyProps} />
        </svg>
      </div>
    );
  },
});

export default Core;
