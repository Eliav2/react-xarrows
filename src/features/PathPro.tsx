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
    // console.log('asd', svv.faceDirs, evv.faceDirs);
    // console.log('asd', svv._chosenFaceDir, evv._chosenFaceDir);
    let smartGrid = calcFromStartToEnd(svv, evv, [], props.pathMargin, { zGridBreak: props.gridBreak }, allowedDirs);

    let points = smartGrid.getPoints();
    let arrowPath = { grid: pointsToLines, smooth: pointsToCurves, straight: pointsToLines }[props.path](points);

    // console.log('points', points);
    // console.log('arrowPath', arrowPath);

    return { getPath: () => arrowPath };
  },
  jsx: ({ state, props }) => {
    const { cp1, cp2 } = state.posSt;
    return (
      <>
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
