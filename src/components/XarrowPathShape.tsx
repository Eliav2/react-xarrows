import React from 'react';
import { pathType, relativeOrAbsStr } from '../types';
import { getPathStateType } from '../utils/XarrowUtils';
import { xStr2absRelative } from '../utils';

export interface XarrowPathShapeAPIProps {
  path?: pathType;
  gridBreak?: relativeOrAbsStr;
}

export interface XarrowPathShapeProps extends XarrowPathShapeAPIProps {
  getPathState: getPathStateType;
}

const XarrowPathShape: React.FC<XarrowPathShapeProps> = (props) => {
  let getPathState = props.getPathState;
  if (props.path === 'straight') {
    getPathState = getPathState(
      (pos) => pos,
      (pos) => `M ${pos.x1} ${pos.y1} L ${pos.x2} ${pos.y2}`
    );
  }
  if (props.path === 'grid') {
    let gridBreak = xStr2absRelative(props.gridBreak);
    getPathState = getPathState(
      (pos) => {
        return pos;
      },
      (pos) => `M ${pos.x1} ${pos.y1} L ${pos.x2} ${pos.y2}`
    );
  }

  return <path d={getPathState()} stroke="black" />;
};

XarrowPathShape.defaultProps = {
  path: 'straight',
};

export default XarrowPathShape;
