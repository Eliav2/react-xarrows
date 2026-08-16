import React from 'react';
import { cAnchorEdge, cArrowShapes, cPaths, cSvgElems } from './constants';

export type xarrowPropsType = {
  start: refType;
  end: refType;
  startAnchor?: anchorType;
  endAnchor?: anchorType;
  labels?: labelType | labelsType;
  color?: string;
  lineColor?: string | null;
  headColor?: string | null;
  tailColor?: string | null;
  strokeWidth?: number;
  showHead?: boolean;
  headSize?: number;
  showTail?: boolean;
  tailSize?: number;
  path?: pathType;
  showXarrow?: boolean;
  curveness?: number;
  gridBreak?: string;
  /** rounds the corners of a `path="grid"` arrow. `true` uses `strokeWidth * 2`, a number is a radius in pixels. */
  gridRadius?: boolean | number;
  dashness?:
    | boolean
    | {
        strokeLen?: number;
        nonStrokeLen?: number;
        animation?: boolean | number;
      };
  headShape?: svgEdgeShapeType | svgCustomEdgeType;
  tailShape?: svgEdgeShapeType | svgCustomEdgeType;
  animateDrawing?: boolean | number;
  zIndex?: number;
  passProps?: svgElemPropsType;
  SVGcanvasProps?: React.SVGAttributes<SVGSVGElement>;
  arrowBodyProps?: React.SVGProps<SVGPathElement>;
  arrowHeadProps?: svgElemPropsType;
  arrowTailProps?: svgElemPropsType;
  divContainerProps?: React.HTMLProps<HTMLDivElement>;
  SVGcanvasStyle?: React.CSSProperties;
  divContainerStyle?: React.CSSProperties;
  _extendSVGcanvas?: number;
  _debug?: boolean;
  _cpx1Offset?: number;
  _cpy1Offset?: number;
  _cpx2Offset?: number;
  _cpy2Offset?: number;
};

export type pathType = (typeof cPaths)[number];
export type _anchorType = anchorNamedType | anchorCustomPositionType;
export type anchorType = _anchorType | _anchorType[];
export type anchorNamedType = (typeof cAnchorEdge)[number];

export type anchorCustomPositionType = {
  position: anchorNamedType;
  offset: { x?: number; y?: number };
};
/**
 * An element id, or any ref holding an element.
 *
 * Structural rather than React.RefObject or React.MutableRefObject on purpose:
 * React 19 redefined RefObject as mutable, and MutableRefObject is invariant, so
 * a MutableRefObject<HTMLDivElement> would not be assignable to one of
 * HTMLElement. A readonly reader accepts every shape either React version
 * produces.
 *
 * `Element` rather than `HTMLElement`, and `undefined` alongside `null`, because
 * this replaced a MutableRefObject<any> that accepted everything: useRef with no
 * argument yields `T | undefined`, and an SVG element ref is neither an
 * HTMLElement nor unusable here - only getBoundingClientRect is ever called.
 */
export type refType = string | { readonly current: Element | null | undefined };
export type labelsType = {
  start?: labelType;
  middle?: labelType;
  end?: labelType;
};
export type labelType = React.ReactElement | string;

export type svgCustomEdgeType = {
  /** a jsx svg element, for example `<path d="..." />`. */
  svgElem: React.ReactElement;
  offsetForward?: number;
};

export type svgEdgeShapeType = (typeof cArrowShapes)[number];
export type svgEdgeType = svgEdgeShapeType | svgCustomEdgeType;
export type svgElemType = (typeof cSvgElems)[number];

/**
 * Props of any one of the svg elements an arrow part can be rendered as.
 *
 * Spelled out rather than written as JSX.IntrinsicElements[svgElemType]: React
 * 19 removed the global JSX namespace, so the published declarations stopped
 * compiling for anyone on @types/react 19. React.JSX would fix that but does not
 * exist on the older @types/react this package still supports, and SVGProps is
 * exactly what JSX.IntrinsicElements maps these tags to in every version. The
 * mapped type preserves the per-tag union rather than collapsing to
 * SVGProps<union>, which would reject a ref typed for one specific element.
 */
export type svgElemPropsType = {
  [K in svgElemType]: React.SVGProps<SVGElementTagNameMap[K]>;
}[svgElemType];
