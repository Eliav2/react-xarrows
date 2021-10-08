import React from 'react';
import { pathType, relativeOrAbsStr } from '../types';
import { getPathStateType, simplePosType } from '../utils/XarrowUtils';
import { choosenAnchorType, xStr2absRelative } from '../utils';
import { anchorsInwardOffset } from './XarrowAnchors';
import { Dir, Line, Vector } from '../classes/classes';
import { XarrowMainPropsAPI } from './XarrowMain';

export interface XarrowPathShapeAPIProps {
  path?: pathType;
  gridBreak?: relativeOrAbsStr;
  curveness?: relativeOrAbsStr;
  _debug?: boolean;
}

export interface XarrowPathShapeProps extends XarrowPathShapeAPIProps, XarrowMainPropsAPI {
  getPathState: getPathStateType<simplePosType>;
  anchors: { chosenStart: choosenAnchorType; chosenEnd: choosenAnchorType };
  children?: (posState: getPathStateType) => React.ReactElement;
}
const PATH_MARGIN = 10;
const XarrowPathShape: React.FC<XarrowPathShapeProps> = (props) => {
  let getPathState = props.getPathState;
  let posState = getPathState(undefined, null);
  let ps = new Vector(posState.start.x, posState.start.y);
  let pe = new Vector(posState.end.x, posState.end.y);
  let ll = new Line(ps, pe);
  let startDir = new Dir(anchorsInwardOffset[props.anchors.chosenStart.anchor.position]).mul(-1);
  let endDir = new Dir(anchorsInwardOffset[props.anchors.chosenEnd.anchor.position]);
  // for 'middle' anchors
  if (startDir.size() === 0)
    startDir = new Dir(ll.diff.abs().x > ll.diff.abs().y ? new Vector(ll.diff.x, 0) : new Vector(0, ll.diff.y));
  if (endDir.size() === 0)
    endDir = new Dir(ll.diff.abs().x > ll.diff.abs().y ? new Vector(ll.diff.x, 0) : new Vector(0, ll.diff.y));
  let gridBreak = xStr2absRelative(props.gridBreak) ?? { relative: 0, abs: 0 };
  let cu = xStr2absRelative(props.curveness) ?? { relative: 0, abs: 0 };
  let cp1: Vector = new Vector(ps),
    cp2 = new Vector(pe);
  let cps1 = '';
  let cps2 = '';

  if (props.path === 'straight') {
    getPathState = getPathState(
      (pos) => pos,
      (pos) => `M ${pos.start.x} ${pos.start.y} L ${pos.end.x} ${pos.end.y}`
    );
  } else {
    if (startDir.abs().eq(endDir.abs())) {
      //two control points
      let dd = startDir.mul(ll.diff.abs().add(startDir.mul(gridBreak.abs).abs())).mul(gridBreak.relative);
      if (ll.diff.projection(startDir).mul(startDir).size() < -PATH_MARGIN) {
        // cases where path is drawn in negative direction to the start or end anchors directions
        dd = startDir.mul(PATH_MARGIN);
      }
      cp1 = ps.add(dd);
      cp2 = cp1.add(ll.diff.mul(startDir.rotate(90).abs()));
      // handle custom curveness
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
    getPathState = getPathState((pos) => ({ ...pos, cp1, cp2 }));
    if (props.path === 'grid') {
      cps1 = cp1 ? `L ${cp1.x} ${cp1.y}` : '';
      cps2 = `L ${cp2.x} ${cp2.y}`;
      getPathState = getPathState(
        (pos) => pos,
        (pos) => `M ${pos.start.x} ${pos.start.y} ${cps1} ${cps2} L ${pos.end.x} ${pos.end.y}`
      );
    } else if (props.path === 'smooth') {
      getPathState = getPathState(
        (pos) => pos,
        (pos) => `M ${pos.start.x} ${pos.start.y} C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y} ${pos.end.x} ${pos.end.y}`
      );
    }
  }

  let child = props.children?.(getPathState) ?? (
    <path d={getPathState()} stroke="black" strokeWidth={props.strokeWidth} />
  );

  return (
    <>
      {child}
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
  path: 'smooth',
  gridBreak: '50%',
  curveness: '0%',
  _debug: false,
};

export default XarrowPathShape;
