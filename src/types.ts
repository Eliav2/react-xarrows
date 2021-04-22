///////////////
// public types

import React from 'react';

export type xarrowPropsType = {
  start: refType;
  end: refType;
  startAnchor?: anchorType | anchorType[];
  endAnchor?: anchorType | anchorType[];
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
  curveness?: number;
  dashness?:
    | boolean
    | {
        strokeLen?: number;
        nonStrokeLen?: number;
        animation?: boolean | number;
      };
  svgHead?: svgEdgeShapeType | svgCustomEdgeType;
  svgTail?: svgEdgeShapeType | svgCustomEdgeType;
  animateDrawing?: boolean | number;
  passProps?: JSX.IntrinsicElements[svgElemType];
  SVGcanvasProps?: React.SVGAttributes<SVGSVGElement>;
  arrowBodyProps?: React.SVGProps<SVGPathElement>;
  arrowHeadProps?: JSX.IntrinsicElements[svgElemType];
  arrowTailProps?: JSX.IntrinsicElements[svgElemType];
  // arrowTailProps?: React.SVGProps<SVGElement>;
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

export type pathType = 'smooth' | 'grid' | 'straight';
export type anchorType = anchorPositionType | anchorCustomPositionType;
export type anchorPositionType = 'middle' | 'left' | 'right' | 'top' | 'bottom' | 'auto';

export type anchorCustomPositionType = {
  position: anchorPositionType;
  offset: { rightness?: number; bottomness?: number };
};
export type refType = React.MutableRefObject<any> | string;
export type labelsType = {
  start?: labelType;
  middle?: labelType;
  end?: labelType;
};
export type labelType = JSX.Element | string;

export type svgCustomTypeGeneric<T extends svgElemType> = {
  svgElem: T;
  svgProps?: JSX.IntrinsicElements[T];
  offsetBack?: number;
};
export type svgCustomEdgeType = { [K in svgElemType]: svgCustomTypeGeneric<K> }[svgElemType];

export type svgEdgeShapeType = 'sharpArrow' | 'heart' | 'circle';
export type svgEdgeType = svgEdgeShapeType | svgCustomEdgeType;
export type svgElemType = 'circle' | 'ellipse' | 'line' | 'path' | 'polygon' | 'polyline' | 'rect';

////////////////
// private types

export type _prevPosType = {
  start: {
    x: number;
    y: number;
    right: number;
    bottom: number;
  };
  end: {
    x: number;
    y: number;
    right: number;
    bottom: number;
  };
};

type Common<A, B> = {
  [P in keyof A & keyof B]: A[P] | B[P];
};
// const c: Common<T1, T2> = { y: 123 };

// export type SvgCustomTypeOneLiner = svgElemType extends infer T
//   ? T extends svgElemType
//     ? { svgElem: T; svgProps?: JSX.IntrinsicElements[T] }
//     : never
//   : never;

// export type svgCustomType<T extends svgElemType> = {
//   svgElem: T;
//   svgProps?: { [key in T]: JSX.IntrinsicElements[T] };
//   offsetBack?: number;
// };
