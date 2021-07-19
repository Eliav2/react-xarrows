///////////////
// public types

// constants used for typescript and proptypes definitions
export const tAnchorEdge = ['middle', 'left', 'right', 'top', 'bottom', 'auto'] as const;
export const tPaths = ['smooth', 'grid', 'straight'] as const;
export const tSvgElems = ['circle', 'ellipse', 'line', 'path', 'polygon', 'polyline', 'rect'] as const;
export const tFacingDir = ['auto', 'inwards', 'outwards', 'left', 'right', 'up', 'down'] as const;

//default arrows svgs
export const arrowShapes = {
  arrow1: { svgElem: 'path', svgProps: { d: `M 0 0 L 1 0.5 L 0 1 L 0.25 0.5 z` }, offsetForward: 0.25 },
  heart: {
    svgElem: 'path',
    svgProps: {
      d: `M 0,0.25 A 0.125,0.125 0,0,1 0.5,0.25 A 0.125,0.125 0,0,1 1,0.25 Q 1,0.625 0.5,1 Q 0,0.625 0,0.25 z`,
    },
    offsetForward: 0.1,
  },
  circle: {
    svgElem: 'circle',
    svgProps: {
      r: 0.5,
      cx: 0.5,
      cy: 0.5,
      // children: <animate attributeName="r" values={'0.25;0.5;0.25'} dur="1s" repeatCount={'indefinite'} />,
    },
    offsetForward: 0,
  },
  // todo: add support for automatic svg adjustments with getBBbox()
  // arrow2: {
  //   svgElem: 'path',
  //   svgProps: {
  //     //// handle automatic resize of the svg
  //     // d: `M 0.5 1 l -0.171749 -0.16666 0.3333 -0.3333 -0.3333 -0.3333 0.171749 -0.16666 0.494916 0.5 z`,
  //     // d: `M 0 1 l -0.171749 -0.16666 0.3333 -0.3333 -0.3333 -0.3333 0.171749 -0.16666 0.494916 0.5 z`,
  //     d: `M 0 24 l -4.122     -4      8      -8      -8      -8       4.122    -4 11.878 12 z`,
  //   },
  //   // offsetForward: -0.65,
  // },
  // todo: add more default shapes
} as const;

export const tArrowShapes = Object.keys(arrowShapes) as Array<keyof typeof arrowShapes>;

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

export type svgCustomTypeGeneric<T extends svgElemType> = {
  svgElem: T;
  svgProps?: JSX.IntrinsicElements[T];
  offsetForward?: number;
};
export type svgCustomEdgeType = { [K in svgElemType]: svgCustomTypeGeneric<K> }[svgElemType];
export type svgEdgeShapeType = typeof tArrowShapes[number];
export type svgEdgeType = svgEdgeShapeType | svgCustomEdgeType;
export type svgElemType = typeof tSvgElems[number];

////////////////
// private types

export type dimensionType = {
  x: number;
  y: number;
  right: number;
  bottom: number;
};
export type _prevPosType = {
  start: dimensionType;
  end: dimensionType;
};

export type anchorEdgeType = 'left' | 'right' | 'top' | 'bottom';
export type _xarrowVarPropsType = Omit<xarrowPropsType, 'start' | 'end'>;

// pick the common props between 2 objects
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
//   offsetForward?: number;
// };
