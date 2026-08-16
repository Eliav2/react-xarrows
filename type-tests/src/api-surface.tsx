import React, { useRef } from 'react';
import Xarrow, { Xwrapper, useXarrow } from 'react-xarrows';
import type {
  anchorType,
  labelsType,
  labelType,
  pathType,
  refType,
  svgCustomEdgeType,
  svgElemPropsType,
  xarrowPropsType,
} from 'react-xarrows';

/**
 * Compiled against the built lib/index.d.ts, once per supported @types/react
 * major. This is a type test: it never runs, and every line exists because
 * getting it wrong would ship broken declarations to consumers.
 *
 * The declarations used to reference the global JSX namespace, which React 19
 * removed, so nothing here compiled at all on 19 while every runtime code path
 * worked fine.
 */

// --- refs accepted as start/end -------------------------------------------
// refType replaced a MutableRefObject<any>, which accepted every one of these.
export const refShapes = () => {
  const withNull = useRef<HTMLDivElement>(null);
  const explicitlyUndefined = useRef<HTMLDivElement | undefined>(undefined);
  const svgElement = useRef<SVGRectElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- the point of the case
  const anyRef = useRef<any>(null);
  const wideElement = useRef<Element | null>(null);
  const byId = 'some-element-id';

  const accepted: refType[] = [withNull, explicitlyUndefined, svgElement, anyRef, wideElement, byId];
  return accepted;
};

// --- the prop type, spread over every prop --------------------------------
export const everyProp: xarrowPropsType = {
  start: 'a',
  end: 'b',
  startAnchor: 'auto',
  endAnchor: ['left', { position: 'top', offset: { x: 1, y: 2 } }],
  labels: { start: 'a', middle: <span>b</span>, end: 'c' },
  color: 'red',
  lineColor: null,
  headColor: null,
  tailColor: null,
  strokeWidth: 4,
  showHead: true,
  headSize: 6,
  showTail: false,
  tailSize: 6,
  path: 'grid',
  showXarrow: true,
  curveness: 0.8,
  gridBreak: '50%',
  gridRadius: 12,
  dashness: { strokeLen: 8, nonStrokeLen: 4, animation: 2 },
  headShape: 'arrow1',
  tailShape: { svgElem: <path d="M 0 0 L 1 1 z" />, offsetForward: 0.25 },
  animateDrawing: true,
  zIndex: 1,
  passProps: { opacity: 0.5 },
  SVGcanvasProps: { className: 'canvas' },
  arrowBodyProps: { strokeLinecap: 'round' },
  arrowHeadProps: { strokeWidth: 2 },
  arrowTailProps: { strokeWidth: 2 },
  divContainerProps: { className: 'container' },
  SVGcanvasStyle: { opacity: 1 },
  divContainerStyle: { opacity: 1 },
};

// --- exported type aliases stay usable ------------------------------------
export const aliases = () => {
  const anchor: anchorType = ['left', 'right'];
  const label: labelType = <b>x</b>;
  const labelsObject: labelsType = { middle: 'mid' };
  const path: pathType = 'smooth';
  const shape: svgCustomEdgeType = { svgElem: <circle r={0.5} /> };
  // The per-tag union has to survive: a ref typed for one specific element is
  // only assignable if this did not collapse to SVGProps<union>.
  const pathRef = useRef<SVGPathElement>(null);
  const elemProps: svgElemPropsType = { ref: pathRef, strokeWidth: 2 };
  return { anchor, label, labelsObject, path, shape, elemProps };
};

// --- rendering ------------------------------------------------------------
export const Rendered = () => {
  const from = useRef<HTMLDivElement>(null);
  useXarrow();
  return (
    <Xwrapper>
      <div ref={from} />
      <div id="to" />
      <Xarrow start={from} end="to" path="grid" gridRadius headShape={{ svgElem: <path d="M 0 0 z" /> }} />
      <Xarrow start="to" end="to" labels="mid" dashness={{ animation: true }} />
    </Xwrapper>
  );
};

// Xwrapper's children used to be typed `any`, and are now optional ReactNode.
export const emptyWrapper = () => <Xwrapper />;
export const wrapperWithChildren = () => (
  <Xwrapper>
    <div />
  </Xwrapper>
);

// React namespace import is used above for the JSX factory under jsx: react.
export type _React = typeof React;
