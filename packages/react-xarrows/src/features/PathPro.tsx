import { createFeature, XarrowFeature } from '../components/XarrowBuilder';
import { AnchorsStateChange } from './Anchors';
import { pathType, relativeOrAbsStr } from '../types';
import {
  calcFromStartToEnd,
  chooseSimplestPath,
  Dir,
  gridDirs,
  Line,
  points2Vector,
  pointsToCurves,
  pointsToLines,
  Vector,
} from '../classes/pathPro';
// import { anchorsInwardOffset } from '../components/XarrowAnchors';
import { choosenAnchorType, getShortestLine, xStr2absRelative } from '../utils';
import React from 'react';
import PT from 'prop-types';
import { cPaths } from '../constants';
import { CoreStateChange } from './Core';
import { anchorsInwardOffset } from '../utils/XarrowUtils';
import { EdgesStateChange } from './Edges';
import _ from 'lodash';

export const cFacingDir = ['auto', 'inwards', 'outwards', 'left', 'right', 'up', 'down'] as const;
export type _faceDirType = typeof cFacingDir[number];

export interface PathStateChange extends Partial<AnchorsStateChange> {}

export interface PathProps {
  path?: pathType;
  gridBreak?: relativeOrAbsStr;
  curveness?: relativeOrAbsStr;
  _debug?: boolean;
  pathMargin?: number;
}

const PATH_MARGIN = 20;
// const Path = createFeature<PathProps, CoreStateChange & AnchorsStateChange>({
const PathPro: XarrowFeature<
  PathProps,
  CoreStateChange & AnchorsStateChange & EdgesStateChange,
  void,
  { gridBreak: { abs: number; relative: number }; curveness: { abs: number; relative: number } }
> = {
  name: 'PathPro',
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
    pathMargin: 20,
  },
  parseProps: {
    gridBreak: xStr2absRelative,
    curveness: xStr2absRelative,
  },
  state: ({ state, props }) => {
    const gridBreak = props.gridBreak;
    let { posSt, chosenStart, chosenEnd, getPath } = state;

    let sv: Vector, ev: Vector;
    let sSides = chosenStart.anchor.facingDir as _faceDirType[],
      eSides = chosenEnd.anchor.facingDir as _faceDirType[];

    sSides = sSides.map((side) => (side === 'auto' ? 'outwards' : side));
    eSides = eSides.map((side) => (side === 'auto' ? 'inwards' : side));
    let allowedDirs = Object.values(gridDirs);
    // figure the different possibilities to connect
    sv = points2Vector(
      posSt.start.x - state.rootElem.position.x,
      posSt.start.y - state.rootElem.position.y,
      chosenStart.anchor.position,
      sSides as Exclude<_faceDirType, 'auto'>[]
    );
    ev = points2Vector(
      posSt.end.x - state.rootElem.position.x,
      posSt.end.y - state.rootElem.position.y,
      chosenEnd.anchor.position,
      eSides as Exclude<_faceDirType, 'auto'>[]
    );
    if (props.path == 'straight') {
      sv.faceDirs = [];
      ev.faceDirs = [];
      allowedDirs = [];
    }
    let svFaceDirs = sv.faceDirs;
    let evFaceDirs = ev.faceDirs;

    // choose the simplest one
    let [sd, ed] = chooseSimplestPath(sv, ev, props.pathMargin);
    let sev = ev.sub(sv);
    if (!ed) {
      if (ev.faceDirs?.length > 0) {
        ed = _.maxBy(ev.faceDirs, (d) => sev.projection(d));
      } else ed = sev.dir;
    }
    if (!sd) {
      if (sv.faceDirs?.length > 0) {
        sd = _.maxBy(sv.faceDirs, (d) => sev.projection(d));
      } else sd = sev.dir;
    }

    let sdd = sd;
    let edd = ed;
    let svv: Vector = sv,
      evv: Vector = ev;
    svv = svv.setChosenDir(sd);
    evv = evv.setChosenDir(ed);

    // avoidRects.push(startRef, endRef);
    // let avoidDims = avoidRects
    //   .map((a) => getRectDim(a))
    //   .map((a) => ({
    //     x: a.x - _xM,
    //     y: a.y - _yM,
    //     right: a.right - _xM,
    //     bottom: a.bottom - _yM,
    //   }));
    let smartGrid = calcFromStartToEnd(svv, evv, [], props.pathMargin, { zGridBreak: props.gridBreak }, allowedDirs);
    let headDir = ed;
    let tailDir = sd;
    let headOrient = headDir.toDegree();
    let tailOrient = tailDir.toDegree();

    let points = smartGrid.getPoints();
    let arrowPath = { grid: pointsToLines, smooth: pointsToCurves, straight: pointsToLines }[props.path](points);

    // console.log('points', points);
    // console.log('arrowPath', arrowPath);

    return { getPath: () => arrowPath };

    // console.log('hello Path State', props);
    // let ll = new Line(ps, pe);
    // let llO = new Line(posSt.originalStart, posSt.originalEnd);
    // // let llO = ll;
    // let startDir = new Dir(anchorsInwardOffset[chosenStart.anchor.position]).mul(-1);
    // let endDir = new Dir(anchorsInwardOffset[chosenEnd.anchor.position]);
    // // for 'middle' anchors
    // if (startDir.size() === 0)
    //   startDir = new Dir(llO.diff.abs().x > llO.diff.abs().y ? new Vector(llO.diff.x, 0) : new Vector(0, llO.diff.y));
    // if (endDir.size() === 0)
    //   endDir = new Dir(llO.diff.abs().x > llO.diff.abs().y ? new Vector(llO.diff.x, 0) : new Vector(0, llO.diff.y));
    // let gridBreak = xStr2absRelative(props.gridBreak) ?? { relative: 0, abs: 0 };
    // let cu = xStr2absRelative(props.curveness) ?? { relative: 0, abs: 0 };
    // let cp1: Vector = new Vector(ps),
    //   cp2 = new Vector(pe);
    // if (props.path === 'straight') {
    //   // no additional actions are needed because the default path is straight
    // } else {
    //   if (startDir.abs().eq(endDir.abs())) {
    //     //two control points
    //     let dd = endDir.mul(ll.diff.abs().add(endDir.mul(gridBreak.abs).abs())).mul(gridBreak.relative);
    //     if (ll.diff.projection(endDir).mul(endDir).size() < PATH_MARGIN) {
    //       // cases where path is drawn in negative direction to the start or end anchors directions
    //       dd = endDir.mul(PATH_MARGIN);
    //     }
    //     cp2 = pe.sub(dd);
    //     cp1 = cp2.sub(ll.diff.mul(startDir.rotate(90).abs()));
    //     let ll2 = new Line(cp1, ps);
    //     let dd3 = startDir.mul(-ll2.diff.size()).size();
    //     if (dd3 < PATH_MARGIN) {
    //       cp1 = cp1.add(startDir.mul(PATH_MARGIN - dd3));
    //     }
    //     // handle custom curveness
    //     let l1 = new Line(ps, cp1);
    //     let dd2 = startDir.mul(l1.diff.abs().mul(cu.relative).add(cu.abs));
    //     cp1 = cp1.add(dd2);
    //     cp2 = cp2.sub(dd2);
    //   } else {
    //     //one control point
    //     // let d = startDir.add(endDir.mul(-1)).mul(0.5); // two directions
    //     let d = endDir.mul(-1).mul(0.5); // only endDir direction
    //     cp1 = ps;
    //     cp2 = ps.add(startDir.abs().mul(ll.diff));
    //     let dd2 = d.mul(ll.diff.abs().mul(cu.relative).add(cu.abs));
    //     cp2 = cp2.add(dd2);
    //     const ll2 = new Line(cp2, pe);
    //     let dd3 = endDir.mul(ll2.diff.size()).size();
    //     if (dd3 < PATH_MARGIN) {
    //       cp2 = cp2.sub(endDir.mul(PATH_MARGIN - dd3));
    //     }
    //   }
    //   Object.assign(posSt, { cp1, cp2 });
    //   if (props.path === 'grid') {
    //     getPath = (pos = posSt) =>
    //       `M ${pos.start.x} ${pos.start.y} ${
    //         pos.cp1 ? `L ${pos.cp1.x} ${pos.cp1.y}` : ''
    //       } ${`L ${pos.cp2.x} ${pos.cp2.y}`} L ${pos.end.x} ${pos.end.y}`;
    //   } else if (props.path === 'smooth') {
    //     getPath = (pos = posSt) =>
    //       `M ${pos.start.x} ${pos.start.y} C ${pos.cp1.x} ${pos.cp1.y}, ${pos.cp2.x} ${pos.cp2.y} ${pos.end.x} ${pos.end.y}`;
    //   }
    // }
    // return { getPath };
  },
  jsx: ({ state, props, nextJsx }) => {
    const { cp1, cp2 } = state.posSt;
    return (
      <>
        {nextJsx()}
        {props._debug && (
          <>
            {cp1 && <circle cx={cp1.x} cy={cp1.y} r="3" stroke="black" fill="red" />}
            {cp2 && <circle cx={cp2.x} cy={cp2.y} r="3" stroke="black" fill="blue" />}
          </>
        )}
      </>
    );
  },
};
// );

export default PathPro;
