import React from 'react';
import { pathType, relativeOrAbsStr } from '../types';
import { getPathStateType, simplePosType } from '../utils/XarrowUtils';
import { choosenAnchorType, xStr2absRelative } from '../utils';
import { anchorsInwardOffset } from './XarrowAnchors';
import { Dir, Line, Vector } from '../classes/classes';

export interface XarrowPathShapeAPIProps {
  path?: pathType;
  gridBreak?: relativeOrAbsStr;
  curveness?: relativeOrAbsStr;
}

export interface XarrowPathShapeProps extends XarrowPathShapeAPIProps {
  getPathState: getPathStateType<simplePosType>;
  anchors: { chosenStart: choosenAnchorType; chosenEnd: choosenAnchorType };
}

const XarrowPathShape: React.FC<XarrowPathShapeProps> = (props) => {
  let getPathState = props.getPathState;
  if (props.path === 'straight') {
    getPathState = getPathState(
      (pos) => pos,
      (pos) => `M ${pos.x1} ${pos.y1} L ${pos.x2} ${pos.y2}`
    );
  } else {
    let startDir = new Dir(anchorsInwardOffset[props.anchors.chosenStart.anchor.position]).mul(-1);
    let endDir = new Dir(anchorsInwardOffset[props.anchors.chosenEnd.anchor.position]);
    let posState = getPathState(undefined, null);
    let ps = new Vector(posState.x1, posState.y1);
    let pe = new Vector(posState.x2, posState.y2);
    let ll = new Line(ps, pe);
    let gridBreak = xStr2absRelative(props.gridBreak);
    let cp1: Vector = new Vector(ps),
      cp2 = new Vector(pe);
    let cps1 = '';
    let cps2 = '';
    let dStr: (pos: simplePosType) => string = () => '';

    if (startDir.eq(endDir)) {
      //two control points
      let dd = startDir
        .abs()
        .mul(ll.diff.add(startDir.mul(gridBreak.abs).abs()))
        .mul(gridBreak.relative);
      cp1 = ps.add(dd);
      cp2 = cp1.add(ll.diff.mul(startDir.rotate(90).abs()));
    } else {
      //one control point
      let dd = startDir.abs().mul(ll.diff);
      cp2 = ps.add(dd);
    }
    if (props.path === 'grid') {
      cps1 = cp1 ? `L ${cp1.x} ${cp1.y}` : '';
      cps2 = `L ${cp2.x} ${cp2.y}`;
      dStr = (pos) => `M ${pos.x1} ${pos.y1} ${cps1} ${cps2} L ${pos.x2} ${pos.y2}`;
    } else if (props.path === 'smooth') {
      dStr = (pos) => `M ${pos.x1} ${pos.y1} C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y} ${pos.x2} ${pos.y2}`;
    }
    getPathState = getPathState((pos) => pos, dStr);
  }

  return <path d={getPathState()} stroke="black" />;
};

XarrowPathShape.defaultProps = {
  path: 'straight',
  curveness: '50%',
};

export default XarrowPathShape;
