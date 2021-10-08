import React, { ReactSVG, useRef } from 'react';
import { getPathStateType, simplePosType } from '../utils/XarrowUtils';
import { svgEdgeType, svgElemType } from '../types';
import { PlainObject } from '../privateTypes';
import { arrowShapes, cArrowShapes } from '../constants';
import { choosenAnchorType } from '../utils';
import { Dir, Vector } from '../classes/classes';
import NormalizedGSvg from './NormalizedGSvg';

export interface XEdgeProps {
  svgElem: svgEdgeType;
  color?: string;
  strokeWidth?: number;
  show?: boolean;
  size?: number;
  arrowProps?: JSX.IntrinsicElements[svgElemType];
  props?: PlainObject;
  pos: { x: number; y: number };
  dir: Dir;
  containerRef?: React.MutableRefObject<any>;
}

// offset head and tail so line would start just after tail and will end just before head
const getEdgeOffset = (edgeBox: DOMRect, fEdgeSize: number, edgeDir: Dir) => {
  let { x: xBoxEdge, y: yBoxEdge, width: widthBoxEdge, height: heightBoxEdge } = edgeBox;
  fEdgeSize /= Math.min(widthBoxEdge, heightBoxEdge);
  //offset the svg of the head
  let edgeOffsetVector = new Vector(0, 0)
    .add(edgeDir.mul(-(xBoxEdge + widthBoxEdge) * fEdgeSize))
    .add(edgeDir.rotate(90).mul(-(yBoxEdge + heightBoxEdge / 2) * fEdgeSize));
  let edgeOffset = _.pick(edgeOffsetVector, ['x', 'y']);
  return [fEdgeSize, edgeOffset, -widthBoxEdge * fEdgeSize] as const;
};

// receives DOM rect and returns a normalized DOM rect at standard
// size 1x1 and at the center
const shouldBbox = (bbox: DOMRect) => {};

const XEdge: React.FC<XEdgeProps> = (props) => {
  const { pos, dir } = props;
  return (
    <g
      ref={props.containerRef}
      style={{
        transformBox: 'fill-box',
        transformOrigin: 'center',
        transform: `translate(${dir.x * 50}%,${dir.y * 50}%) rotate(${dir.reverse().toDegree()}deg) `,
      }}>
      <g
        style={{
          transform: `translate(${pos.x}px,${pos.y}px) scale(${props.size})`,
          fill: props.color,
          pointerEvents: 'auto',
        }}>
        <NormalizedGSvg>
          <path d="M 0 0 L 1 0.5 L 0 1 L 0.25 0.5 z" />

          {/*{arrowShapes.arrow1.svgElem}*/}
          {/*<circle cx={20} cy={20} r="10" fill="purple" />*/}
          {/*<rect height={10} width={20} fill="purple" />*/}
        </NormalizedGSvg>
        {/*<path d="M 0 0 L 1 0.5 L 0 1 L 0.25 0.5 z" stroke="black" />*/}
        {/*{props.svgElem.svgElem}*/}
      </g>
    </g>
  );
};
XEdge.defaultProps = {
  size: 30,
  svgElem: arrowShapes.arrow1,
  color: 'cornflowerBlue',
};

export default XEdge;
