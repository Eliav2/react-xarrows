// constants used for typescript and proptypes definitions
import React from 'react';

export const cAnchorEdge = ['middle', 'left', 'right', 'top', 'bottom', 'auto'] as const;
export const cPaths = ['smooth', 'grid', 'straight'] as const;
export const cSvgElems = ['circle', 'ellipse', 'line', 'path', 'polygon', 'polyline', 'rect'] as const;
export const cFacingDir = ['auto', 'inwards', 'outwards', 'left', 'right', 'up', 'down'] as const;

//default arrows svgs
export const arrowShapes = {
  arrow1: { svgElem: <path d="M 0 0 L 1 0.5 L 0 1 L 0.25 0.5 z" />, offsetForward: 0.75 },
  heart: {
    svgElem: (
      <path d="M 0,0.25 A 0.125,0.125 0,0,1 0.5,0.25 A 0.125,0.125 0,0,1 1,0.25 Q 1,0.625 0.5,1 Q 0,0.625 0,0.25 z" />
    ),
    offsetForward: 0.9,
  },
  circle: {
    svgElem: <circle r={0.5} cx={0.5} cy={0.5} />,
    offsetForward: 1,
  },
} as const;

export const cArrowShapes = Object.keys(arrowShapes) as Array<keyof typeof arrowShapes>;
