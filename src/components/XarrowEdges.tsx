import React from 'react';
import { getPathStateType, simplePosType } from '../utils/XarrowUtils';
import { svgEdgeType, svgElemType } from '../types';
import XEdge from './XEdge';
import { XarrowMainProps, XarrowMainPropsAPI } from './XarrowMain';

export interface XarrowEdgesAPIProps {
  showHead?: boolean;
  headColor?: string | null;
  tailColor?: string | null;
  headSize?: number;
  showTail?: boolean;
  tailSize?: number;
  headShape?: svgEdgeType;
  tailShape?: svgEdgeType;
  arrowHeadProps?: JSX.IntrinsicElements[svgElemType];
  arrowTailProps?: JSX.IntrinsicElements[svgElemType];
}

export interface XarrowEdgesProps extends XarrowEdgesAPIProps, XarrowMainPropsAPI {
  getPathState: getPathStateType<simplePosType>;
  children?: (posState: getPathStateType) => React.ReactElement;
}

const XarrowEdges: React.FC<XarrowEdgesProps> = (props) => {
  let getPathState = props.getPathState;
  let pos = getPathState(undefined, null);
  console.log(pos);
  return (
    <>
      <path d={getPathState()} stroke="black" strokeWidth={props.strokeWidth} />
      <XEdge transform={`translate(${pos.x1},${pos.y1}) rotate(${10}) scale(${1})`} />
    </>
  );
};

export default XarrowEdges;
