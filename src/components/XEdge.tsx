import React, { ReactSVG } from 'react';
import { getPathStateType, simplePosType } from '../utils/XarrowUtils';
import { svgEdgeType, svgElemType } from '../types';
import { PlainObject } from '../privateTypes';
import { arrowShapes, cArrowShapes } from '../constants';

export interface XEdgeProps {
  svgElem: svgEdgeType;
  color?: string;
  strokeWidth: number;
  show?: boolean;
  size?: number;
  arrowProps?: JSX.IntrinsicElements[svgElemType];
  transform?: string;
  props?: PlainObject;
}

const XEdge: React.FC<XEdgeProps> = (props) => {
  console.log(props.svgElem);
  return (
    <g fill={props.color} pointerEvents="auto" transform={props.transform} {...props}>
      <g transform={'translate(-100% , -50%)'}>
        <circle cx={0} cy={0} r="3" stroke="black" fill="purple" />
        {props.svgElem.svgElem}
      </g>
    </g>
  );
};
XEdge.defaultProps = {
  svgElem: arrowShapes.arrow1,
};

export default XEdge;
