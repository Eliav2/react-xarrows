import React, { SVGProps, useEffect, useRef, useState } from 'react';
import { useElement } from '../hooks/useElement';
import { Contains, PlainObject, XElementType } from '../privateTypes';
import { Vector } from '../classes/classes';
import { refType } from '../types';
import { createFeature, XarrowFeature } from '../components/XarrowBuilder';
import PT from 'prop-types';

export interface CoreStateChange {
  startElem: XElementType;
  endElem: XElementType;
  rootElem: XElementType;
  rootDivRef: React.MutableRefObject<HTMLDivElement | null>;
  posSt: posStType;
  getPath: (posSt: posStType) => string;
}

export interface CoreProps {
  start: refType;
  end: refType;
  strokeWidth?: number;
  color?: string;
  lineColor?: string;

  SVGcanvasProps?: React.SVGProps<SVGSVGElement>;
  SVGcanvasStyle?: React.CSSProperties;
  divContainerProps?: React.HTMLProps<HTMLDivElement>;
  arrowBodyProps?: React.SVGProps<SVGPathElement>;
}

const pRefType = PT.oneOfType([PT.string, PT.exact({ current: PT.any })]);

const Core = createFeature<CoreProps, {}, CoreStateChange>({
  propTypes: {
    start: pRefType.isRequired,
    end: pRefType.isRequired,
    strokeWidth: PT.number,

    SVGcanvasStyle: PT.object,
    divContainerProps: PT.object,
    SVGcanvasProps: PT.object,
    arrowBodyProps: PT.object,
  },
  defaultProps: {
    divContainerProps: {},
    SVGcanvasProps: {},
    SVGcanvasStyle: {},
    arrowBodyProps: {},
    strokeWidth: 4,
    color: 'CornflowerBlue',
    lineColor: undefined,
  },
  state: ({ state, props }) => {
    const rootDivRef = useRef<HTMLDivElement>(null);

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
    const getPath = (pos) => `M ${pos.start.x} ${pos.start.y} L ${pos.end.x} ${pos.end.y}`;
    return { startElem, endElem, rootElem, rootDivRef, posSt, getPath };
  },
  jsx: ({ state, props, nextJsx }) => {
    const { posSt, rootElem } = state;

    const { strokeWidth, color, lineColor = color } = props;

    //off set all vectors relative to the origin of divContainer
    for (let vectKey in posSt) {
      posSt[vectKey] = posSt[vectKey].sub(rootElem.position);
    }

    return (
      <div ref={state.rootDivRef} style={{ position: 'absolute', pointerEvents: 'none' }} {...props.divContainerProps}>
        <svg
          style={{
            position: 'absolute',
            fill: 'transparent',
            overflow: 'visible',
            ...props.SVGcanvasStyle,
          }}>
          <path d={state.getPath(posSt)} strokeWidth={strokeWidth} stroke={lineColor} {...props.arrowBodyProps} />
          {nextJsx()}
        </svg>
      </div>
    );
  },
});

export type posStType = Contains<{ start: Vector; end: Vector }>;
const getPosition = (startElem: XElementType, endElem: XElementType, rootElem: XElementType) => {
  const { x: x1, y: y1 } = startElem.position;
  const { x: x2, y: y2 } = endElem.position;
  const posSt = { start: new Vector(x1, y1), end: new Vector(x2, y2) };
  return posSt;
};

export default Core;
