import { XarrowFeature } from '../components/XarrowBuilder';
import { AnchorsProps } from './Anchors';
import { pathType, relativeOrAbsStr } from '../types';
import { Dir, Line, Vector } from '../classes/classes';
import { anchorsInwardOffset } from '../components/XarrowAnchors';
import { xStr2absRelative } from '../utils';
import React from 'react';
import PT from 'prop-types';
import { cPaths } from '../constants';

export interface PathProps {
  path?: pathType;
  gridBreak?: relativeOrAbsStr;
  curveness?: relativeOrAbsStr;
  _debug?: boolean;
}

const PATH_MARGIN = 10;
const Path: XarrowFeature<PathProps> = {
  propTypes: {
    path: PT.oneOf(cPaths),
    gridBreak: PT.oneOfType([PT.string as any, PT.number]),
    curveness: PT.oneOfType([PT.string as any, PT.number]),
    _debug: PT.bool,
  },
  defaultProps: {
    path: 'smooth',
    gridBreak: '50%',
    curveness: '0%',
    _debug: false,
  },
  state: (state, props) => {
    // console.log('hello Path State', props);
    let { posSt, chosenStart, chosenEnd, getPath } = state;
    const { start: ps, end: pe } = posSt;
    let ll = new Line(ps, pe);
    let startDir = new Dir(anchorsInwardOffset[chosenStart.anchor.position]).mul(-1);
    let endDir = new Dir(anchorsInwardOffset[chosenEnd.anchor.position]);

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
      // no additional actions are needed because the default path is straight
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
      Object.assign(posSt, { cp1, cp2 });
      if (props.path === 'grid') {
        getPath = (pos) =>
          `M ${pos.start.x} ${pos.start.y} ${
            pos.cp1 ? `L ${pos.cp1.x} ${pos.cp1.y}` : ''
          } ${`L ${pos.cp2.x} ${pos.cp2.y}`} L ${pos.end.x} ${pos.end.y}`;
      } else if (props.path === 'smooth') {
        getPath = (pos) =>
          `M ${pos.start.x} ${pos.start.y} C ${pos.cp1.x} ${pos.cp1.y}, ${pos.cp2.x} ${pos.cp2.y} ${pos.end.x} ${pos.end.y}`;
      }
    }
    return { getPath };
  },
  jsx: (state, props, nextJsx) => {
    const { cp1, cp2 } = state.posSt;
    return (
      <>
        {props._debug && (
          <>
            <circle cx={cp1.x} cy={cp1.y} r="3" stroke="black" fill="red" />
            <circle cx={cp2.x} cy={cp2.y} r="3" stroke="black" fill="blue" />
          </>
        )}
      </>
    );
  },
};
export default Path;
