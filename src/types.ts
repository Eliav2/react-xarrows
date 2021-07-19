import React from 'react';
import { tAnchorEdge, tArrowShapes, tPaths, tSvgElems } from './constants';

export type xarrowPropsType = {
  start: refType;
  end: refType;
  startAnchor?: anchorType;
  endAnchor?: anchorType;
  label?: labelType | labelsType;
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
  // gridRadius?: number;
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
  passProps?: JSX.IntrinsicElements[svgElemType];
  SVGcanvasProps?: React.SVGAttributes<SVGSVGElement>;
  arrowBodyProps?: React.SVGProps<SVGPathElement>;
  arrowHeadProps?: JSX.IntrinsicElements[svgElemType];
  arrowTailProps?: JSX.IntrinsicElements[svgElemType];
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

export type pathType = typeof tPaths[number];
export type _anchorType = anchorNamedType | anchorCustomPositionType;
export type anchorType = _anchorType | _anchorType[];
export type anchorNamedType = typeof tAnchorEdge[number];

export type anchorCustomPositionType = {
  position: anchorNamedType;
  offset: { x?: number; y?: number };
};
export type refType = React.MutableRefObject<any> | string;
export type labelsType = {
  start?: labelType;
  middle?: labelType;
  end?: labelType;
};
export type labelType = JSX.Element | string;

// export type svgCustomTypeGeneric<T extends svgElemType> = {
//   svgElem: T;
//   svgProps?: JSX.IntrinsicElements[T];
//   offsetForward?: number;
// };
export type svgCustomTypeGeneric<T extends svgElemType> = {
  svgElem: SVGElementTagNameMap[T];
  // svgProps?: JSX.IntrinsicElements[T];
  offsetForward?: number;
};
export type svgCustomEdgeType = { [K in svgElemType]: svgCustomTypeGeneric<K> }[svgElemType];
export type svgEdgeShapeType = typeof tArrowShapes[number];
export type svgEdgeType = svgEdgeShapeType | svgCustomEdgeType;
export type svgElemType = typeof tSvgElems[number];
