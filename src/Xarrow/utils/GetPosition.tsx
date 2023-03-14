import { useXarrowPropsResType } from '../useXarrowProps';
import React from 'react';
import { calcAnchors } from '../anchors';
import { getShortestLine, getSvgPos } from './index';
import pick from 'lodash/pick';
import { cPaths } from '../../constants';
import { buzzierMinSols, bzFunction } from './buzzier';

/**
 * The Main logic of path calculation for the arrow.
 * calculate new path, adjusting canvas, and set state based on given properties.
 * */
export const getPosition = (xProps: useXarrowPropsResType, mainRef: React.MutableRefObject<any>) => {
  let [propsRefs, valVars] = xProps;
  let {
    startAnchor,
    endAnchor,
    strokeWidth,
    showHead,
    headSize,
    showTail,
    tailSize,
    path,
    curveness,
    gridBreak,
    headShape,
    tailShape,
    _extendSVGcanvas,
    _cpx1Offset,
    _cpy1Offset,
    _cpx2Offset,
    _cpy2Offset,
  } = propsRefs;
  const { startPos, endPos } = valVars;
  const { svgRef, lineRef } = mainRef.current;

  let headOrient: number = 0;
  let tailOrient: number = 0;

  // convert startAnchor and endAnchor to list of objects represents allowed anchors.
  let startPoints = calcAnchors(startAnchor, startPos);
  let endPoints = calcAnchors(endAnchor, endPos);

  // choose the smallest path for 2 points from these possibilities.
  let { chosenStart, chosenEnd } = getShortestLine(startPoints, endPoints);

  let startAnchorPosition = chosenStart.anchor.position,
    endAnchorPosition = chosenEnd.anchor.position;
  let startPoint = pick(chosenStart, ['x', 'y']),
    endPoint = pick(chosenEnd, ['x', 'y']);

  let mainDivPos = getSvgPos(svgRef);
  let cx0 = Math.min(startPoint.x, endPoint.x) - mainDivPos.x;
  let cy0 = Math.min(startPoint.y, endPoint.y) - mainDivPos.y;
  let dx = endPoint.x - startPoint.x;
  let dy = endPoint.y - startPoint.y;
  let absDx = Math.abs(endPoint.x - startPoint.x);
  let absDy = Math.abs(endPoint.y - startPoint.y);
  let xSign = dx > 0 ? 1 : -1;
  let ySign = dy > 0 ? 1 : -1;
  let [headOffset, tailOffset] = [headShape.offsetForward, tailShape.offsetForward];
  let fHeadSize = headSize * strokeWidth; //factored head size
  let fTailSize = tailSize * strokeWidth; //factored head size

  // const { current: _headBox } = headBox;
  let xHeadOffset = 0;
  let yHeadOffset = 0;
  let xTailOffset = 0;
  let yTailOffset = 0;

  let _headOffset = fHeadSize * headOffset;
  let _tailOffset = fTailSize * tailOffset;

  let cu = Number(curveness);
  // gridRadius = Number(gridRadius);
  if (!cPaths.includes(path)) path = 'smooth';
  if (path === 'straight') {
    cu = 0;
    path = 'smooth';
  }

  let biggerSide = headSize > tailSize ? headSize : tailSize;
  let _calc = strokeWidth + (strokeWidth * biggerSide) / 2;
  let excRight = _calc;
  let excLeft = _calc;
  let excUp = _calc;
  let excDown = _calc;
  excLeft += Number(_extendSVGcanvas);
  excRight += Number(_extendSVGcanvas);
  excUp += Number(_extendSVGcanvas);
  excDown += Number(_extendSVGcanvas);

  ////////////////////////////////////
  // arrow point to point calculations
  let x1 = 0,
    x2 = absDx,
    y1 = 0,
    y2 = absDy;
  if (dx < 0) [x1, x2] = [x2, x1];
  if (dy < 0) [y1, y2] = [y2, y1];

  ////////////////////////////////////
  // arrow curviness and arrowhead placement calculations

  if (cu === 0) {
    // in case of straight path
    let headAngel = Math.atan(absDy / absDx);

    if (showHead) {
      x2 -= fHeadSize * (1 - headOffset) * xSign * Math.cos(headAngel);
      y2 -= fHeadSize * (1 - headOffset) * ySign * Math.sin(headAngel);

      headAngel *= ySign;
      if (xSign < 0) headAngel = (Math.PI - headAngel * xSign) * xSign;
      xHeadOffset = Math.cos(headAngel) * _headOffset - (Math.sin(headAngel) * fHeadSize) / 2;
      yHeadOffset = (Math.cos(headAngel) * fHeadSize) / 2 + Math.sin(headAngel) * _headOffset;
      headOrient = (headAngel * 180) / Math.PI;
    }

    let tailAngel = Math.atan(absDy / absDx);
    if (showTail) {
      x1 += fTailSize * (1 - tailOffset) * xSign * Math.cos(tailAngel);
      y1 += fTailSize * (1 - tailOffset) * ySign * Math.sin(tailAngel);
      tailAngel *= -ySign;
      if (xSign > 0) tailAngel = (Math.PI - tailAngel * xSign) * xSign;
      xTailOffset = Math.cos(tailAngel) * _tailOffset - (Math.sin(tailAngel) * fTailSize) / 2;
      yTailOffset = (Math.cos(tailAngel) * fTailSize) / 2 + Math.sin(tailAngel) * _tailOffset;
      tailOrient = (tailAngel * 180) / Math.PI;
    }
  } else {
    // in case of smooth path
    if (endAnchorPosition === 'middle') {
      // in case a middle anchor is chosen for endAnchor choose from which side to attach to the middle of the element
      if (absDx > absDy) {
        endAnchorPosition = xSign ? 'left' : 'right';
      } else {
        endAnchorPosition = ySign ? 'top' : 'bottom';
      }
    }
    if (showHead) {
      if (['left', 'right'].includes(endAnchorPosition)) {
        xHeadOffset += _headOffset * xSign;
        x2 -= fHeadSize * (1 - headOffset) * xSign; //same!
        yHeadOffset += (fHeadSize * xSign) / 2;
        if (endAnchorPosition === 'left') {
          headOrient = 0;
          if (xSign < 0) headOrient += 180;
        } else {
          headOrient = 180;
          if (xSign > 0) headOrient += 180;
        }
      } else if (['top', 'bottom'].includes(endAnchorPosition)) {
        xHeadOffset += (fHeadSize * -ySign) / 2;
        yHeadOffset += _headOffset * ySign;
        y2 -= fHeadSize * ySign - yHeadOffset;
        if (endAnchorPosition === 'top') {
          headOrient = 270;
          if (ySign > 0) headOrient += 180;
        } else {
          headOrient = 90;
          if (ySign < 0) headOrient += 180;
        }
      }
    }
  }

  if (showTail && cu !== 0) {
    if (['left', 'right'].includes(startAnchorPosition)) {
      xTailOffset += _tailOffset * -xSign;
      x1 += fTailSize * xSign + xTailOffset;
      yTailOffset += -(fTailSize * xSign) / 2;
      if (startAnchorPosition === 'left') {
        tailOrient = 180;
        if (xSign < 0) tailOrient += 180;
      } else {
        tailOrient = 0;
        if (xSign > 0) tailOrient += 180;
      }
    } else if (['top', 'bottom'].includes(startAnchorPosition)) {
      yTailOffset += _tailOffset * -ySign;
      y1 += fTailSize * ySign + yTailOffset;
      xTailOffset += (fTailSize * ySign) / 2;
      if (startAnchorPosition === 'top') {
        tailOrient = 90;
        if (ySign > 0) tailOrient += 180;
      } else {
        tailOrient = 270;
        if (ySign < 0) tailOrient += 180;
      }
    }
  }

  let arrowHeadOffset = { x: xHeadOffset, y: yHeadOffset };
  let arrowTailOffset = { x: xTailOffset, y: yTailOffset };

  let cpx1 = x1,
    cpy1 = y1,
    cpx2 = x2,
    cpy2 = y2;

  let curvesPossibilities = {};
  if (path === 'smooth')
    curvesPossibilities = {
      hh: () => {
        //horizontal - from right to left or the opposite
        cpx1 += absDx * cu * xSign;
        cpx2 -= absDx * cu * xSign;
      },
      vv: () => {
        //vertical - from top to bottom or opposite
        cpy1 += absDy * cu * ySign;
        cpy2 -= absDy * cu * ySign;
      },
      hv: () => {
        // start horizontally then vertically
        // from v side to h side
        cpx1 += absDx * cu * xSign;
        cpy2 -= absDy * cu * ySign;
      },
      vh: () => {
        // start vertically then horizontally
        // from h side to v side
        cpy1 += absDy * cu * ySign;
        cpx2 -= absDx * cu * xSign;
      },
    };
  else if (path === 'grid') {
    curvesPossibilities = {
      hh: () => {
        cpx1 += (absDx * gridBreak.relative + gridBreak.abs) * xSign;
        cpx2 -= (absDx * (1 - gridBreak.relative) - gridBreak.abs) * xSign;
        if (showHead) {
          cpx1 -= ((fHeadSize * (1 - headOffset)) / 2) * xSign;
          cpx2 += ((fHeadSize * (1 - headOffset)) / 2) * xSign;
        }
        if (showTail) {
          cpx1 -= ((fTailSize * (1 - tailOffset)) / 2) * xSign;
          cpx2 += ((fTailSize * (1 - tailOffset)) / 2) * xSign;
        }
      },
      vv: () => {
        cpy1 += (absDy * gridBreak.relative + gridBreak.abs) * ySign;
        cpy2 -= (absDy * (1 - gridBreak.relative) - gridBreak.abs) * ySign;
        if (showHead) {
          cpy1 -= ((fHeadSize * (1 - headOffset)) / 2) * ySign;
          cpy2 += ((fHeadSize * (1 - headOffset)) / 2) * ySign;
        }
        if (showTail) {
          cpy1 -= ((fTailSize * (1 - tailOffset)) / 2) * ySign;
          cpy2 += ((fTailSize * (1 - tailOffset)) / 2) * ySign;
        }
      },
      hv: () => {
        cpx1 = x2;
      },
      vh: () => {
        cpy1 = y2;
      },
    };
  }
  // smart select best curve for the current anchors
  let selectedCurviness = '';
  if (['left', 'right'].includes(startAnchorPosition)) selectedCurviness += 'h';
  else if (['bottom', 'top'].includes(startAnchorPosition)) selectedCurviness += 'v';
  else if (startAnchorPosition === 'middle') selectedCurviness += 'm';
  if (['left', 'right'].includes(endAnchorPosition)) selectedCurviness += 'h';
  else if (['bottom', 'top'].includes(endAnchorPosition)) selectedCurviness += 'v';
  else if (endAnchorPosition === 'middle') selectedCurviness += 'm';
  if (absDx > absDy) selectedCurviness = selectedCurviness.replace(/m/g, 'h');
  else selectedCurviness = selectedCurviness.replace(/m/g, 'v');
  curvesPossibilities[selectedCurviness]();

  cpx1 += _cpx1Offset;
  cpy1 += _cpy1Offset;
  cpx2 += _cpx2Offset;
  cpy2 += _cpy2Offset;

  ////////////////////////////////////
  // canvas smart size adjustments
  const [xSol1, xSol2] = buzzierMinSols(x1, cpx1, cpx2, x2);
  const [ySol1, ySol2] = buzzierMinSols(y1, cpy1, cpy2, y2);
  if (xSol1 < 0) excLeft += -xSol1;
  if (xSol2 > absDx) excRight += xSol2 - absDx;
  if (ySol1 < 0) excUp += -ySol1;
  if (ySol2 > absDy) excDown += ySol2 - absDy;

  if (path === 'grid') {
    excLeft += _calc;
    excRight += _calc;
    excUp += _calc;
    excDown += _calc;
  }

  x1 += excLeft;
  x2 += excLeft;
  y1 += excUp;
  y2 += excUp;
  cpx1 += excLeft;
  cpx2 += excLeft;
  cpy1 += excUp;
  cpy2 += excUp;

  const cw = absDx + excLeft + excRight,
    ch = absDy + excUp + excDown;
  cx0 -= excLeft;
  cy0 -= excUp;

  //labels
  const bzx = bzFunction(x1, cpx1, cpx2, x2);
  const bzy = bzFunction(y1, cpy1, cpy2, y2);
  const labelStartPos = { x: bzx(0.01), y: bzy(0.01) };
  const labelMiddlePos = { x: bzx(0.5), y: bzy(0.5) };
  const labelEndPos = { x: bzx(0.99), y: bzy(0.99) };

  let arrowPath;
  if (path === 'grid') {
    // todo: support gridRadius
    //  arrowPath = `M ${x1} ${y1} L  ${cpx1 - 10} ${cpy1} a10,10 0 0 1 10,10
    // L ${cpx2} ${cpy2 - 10} a10,10 0 0 0 10,10 L  ${x2} ${y2}`;
    arrowPath = `M ${x1} ${y1} L  ${cpx1} ${cpy1} L ${cpx2} ${cpy2} ${x2} ${y2}`;
  } else if (path === 'smooth') arrowPath = `M ${x1} ${y1} C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${x2} ${y2}`;
  return {
    cx0,
    cy0,
    x1,
    x2,
    y1,
    y2,
    cw,
    ch,
    cpx1,
    cpy1,
    cpx2,
    cpy2,
    dx,
    dy,
    absDx,
    absDy,
    headOrient,
    tailOrient,
    labelStartPos,
    labelMiddlePos,
    labelEndPos,
    excLeft,
    excRight,
    excUp,
    excDown,
    headOffset: _headOffset,
    arrowHeadOffset,
    arrowTailOffset,
    startPoints,
    endPoints,
    mainDivPos,
    xSign,
    ySign,
    lineLength: lineRef.current?.getTotalLength() ?? 0,
    fHeadSize,
    fTailSize,
    arrowPath,
  };
};
