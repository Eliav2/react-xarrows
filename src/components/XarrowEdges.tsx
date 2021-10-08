import React from 'react';
import { getPathStateType, simplePosType } from '../utils/XarrowUtils';
import { svgEdgeType, svgElemType } from '../types';
import XEdge from './XEdge';
import { XarrowMainProps, XarrowMainPropsAPI } from './XarrowMain';
import { choosenAnchorType } from '../utils';
import { Dir } from '../classes/classes';
import { anchorsInwardOffset } from './XarrowAnchors';

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
  anchors: { chosenStart: choosenAnchorType; chosenEnd: choosenAnchorType };
}

const XarrowEdges: React.FC<XarrowEdgesProps> = (props) => {
  let getPathState = props.getPathState;
  let pos = getPathState(undefined, null);
  let startDir = new Dir(anchorsInwardOffset[props.anchors.chosenStart.anchor.position]);
  let newGetPathState = getPathState((pos) => {
    //todo: offset the size of the svg
    return pos;
  });
  return (
    <>
      <path d={newGetPathState()} stroke="black" strokeWidth={props.strokeWidth} />
      <XEdge pos={{ x: pos.x1, y: pos.y1 }} dir={startDir.reverse()} />
      {/*<XEdge*/}
      {/*  transform={`translate(${pos.x2}px,${pos.y2}px) rotate(${0}) scale(${2})`}*/}
      {/*  dir={new Dir(anchorsInwardOffset[props.anchors.chosenEnd.anchor.position]).reverse()}*/}
      {/*/>*/}
    </>
  );
};

export default XarrowEdges;
