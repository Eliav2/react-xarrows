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
  _debug?: boolean;
}

export interface XarrowPathShapeProps extends XarrowPathShapeAPIProps {
  getPathState: getPathStateType<simplePosType>;
  anchors: { chosenStart: choosenAnchorType; chosenEnd: choosenAnchorType };
}

const XarrowPathShape: React.FC<XarrowPathShapeProps> = (props) => {
  let getPathState = props.getPathState;
  let startDir = new Dir(anchorsInwardOffset[props.anchors.chosenStart.anchor.position]).mul(-1);
  let endDir = new Dir(anchorsInwardOffset[props.anchors.chosenEnd.anchor.position]);
  let posState = getPathState(undefined, null);
  let ps = new Vector(posState.x1, posState.y1);
  let pe = new Vector(posState.x2, posState.y2);
  let ll = new Line(ps, pe);
  let gridBreak = xStr2absRelative(props.gridBreak) ?? { relative: 0, abs: 0 };
  let cu = xStr2absRelative(props.curveness) ?? { relative: 0, abs: 0 };
  let cp1: Vector = new Vector(ps),
    cp2 = new Vector(pe);
  let cps1 = '';
  let cps2 = '';

  if (props.path === 'straight') {
    getPathState = getPathState(
      (pos) => pos,
      (pos) => `M ${pos.x1} ${pos.y1} L ${pos.x2} ${pos.y2}`
    );
  } else {
    let dStr: (pos: simplePosType) => string = () => '';

    if (startDir.eq(endDir)) {
      //two control points
      let dd = startDir.mul(ll.diff.abs().add(startDir.mul(gridBreak.abs).abs())).mul(gridBreak.relative);
      cp1 = ps.add(dd);
      cp2 = cp1.add(ll.diff.mul(startDir.rotate(90).abs()));
      let l1 = new Line(ps, cp1);
      let dd2 = startDir.mul(l1.diff.abs().mul(cu.relative).add(cu.abs));
      cp1 = cp1.add(dd2);
      cp2 = cp2.sub(dd2);
    } else {
      //one control point
      let d = startDir.add(endDir.mul(-1)).mul(0.5);
      cp1 = ps;
      cp2 = ps.add(startDir.abs().mul(ll.diff));
      let dd2 = d.mul(ll.diff.abs().mul(cu.relative).add(cu.abs));
      cp2 = cp2.add(dd2);
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

  return (
    <>
      <path d={getPathState()} stroke="black" />
      {props._debug && (
        <>
          <circle cx={cp1.x} cy={cp1.y} r="3" stroke="black" fill="red" />
          <circle cx={cp2.x} cy={cp2.y} r="3" stroke="black" fill="blue" />
        </>
      )}
    </>
  );
};

XarrowPathShape.defaultProps = {
  path: 'straight',
  gridBreak: '50%',
  curveness: '20%',
  _debug: false,
};

export default XarrowPathShape;
