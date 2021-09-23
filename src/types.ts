import React, { ReactSVG } from 'react';
import { cAnchorEdge, cArrowShapes, cPaths, cSvgElems } from './constants';
import { Contains, OneOrMore, ToArray } from './privateTypes';

//any xarrow prop is allowed to be passed
export interface partialXarrowProps extends Partial<xarrowPropsType> {}

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
  gridBreak?: relativeOrAbsStr;
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

export type pathType = typeof cPaths[number];

// // type percentStr = `${'1' | ''}${digit | ''}${digit}%`;
// type DigitsStr = `${number}`;
// let myNum: percentStr = '211%';
// type digit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
export type percentStr = `${number}%`;
export type relativeOrAbsStr = number | `${number | percentStr}${number | ''}`;

export type _anchorType = anchorNamedType | anchorCustomPositionType | relativeOrAbsStr;
// export type anchorType = _anchorType | _anchorType[];
export type anchorType = OneOrMore<_anchorType>;
export type anchorNamedType = typeof cAnchorEdge[number];

export type anchorCustomPositionType = {
  position?: anchorNamedType;
  offset?: { x?: number; y?: number; inwards?: relativeOrAbsStr; sidewards?: relativeOrAbsStr };
};

export type refType = React.MutableRefObject<any> | string | Contains<{ x: number; y: number }>;
export type labelsType = {
  start?: labelType;
  middle?: labelType;
  end?: labelType;
};
export type labelType = JSX.Element | string;

export type svgCustomEdgeType = {
  svgElem: JSX.IntrinsicElements[keyof ReactSVG];
  offsetForward?: number;
};

export type svgEdgeShapeType = typeof cArrowShapes[number];
export type svgEdgeType = svgEdgeShapeType | svgCustomEdgeType;
export type svgElemType = typeof cSvgElems[number];
