import { _prevPosType, anchorCustomPositionType, refType } from '../types';
import React from 'react';

export const getElementByPropGiven = (ref: refType): HTMLElement => {
  let myRef;
  if (typeof ref === 'string') {
    // myRef = document.getElementById(ref);
    myRef = document.getElementById(ref);
  } else myRef = ref?.current;
  return myRef;
};

// receives string representing a d path and factoring only the numbers
export const factorDpathStr = (d: string, factor) => {
  let l = d.split(/(\d+(?:\.\d+)?)/);
  l = l.map((s) => {
    if (Number(s)) return (Number(s) * factor).toString();
    else return s;
  });
  return l.join('');
};

// debug
export const measureFunc = (callbackFunc: Function, name = '') => {
  const t = performance.now();

  const returnVal = callbackFunc();
  console.log('time ', name, ':', performance.now() - t);
  return returnVal;
};

const dist = (p1, p2) => {
  //length of line
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
};

type t1 = { x: number; y: number; anchor: anchorCustomPositionType };

export const getShortestLine = (sPoints: t1[], ePoints: t1[]) => {
  // closes tPair Of Points which feet to the specified anchors
  let minDist = Infinity,
    d = Infinity;
  let closestPair: { chosenStart: t1; chosenEnd: t1 };
  sPoints.forEach((sp) => {
    ePoints.forEach((ep) => {
      d = dist(sp, ep);
      if (d < minDist) {
        minDist = d;
        closestPair = { chosenStart: sp, chosenEnd: ep };
      }
    });
  });
  return closestPair;
};

export const getElemPos = (elem: HTMLElement) => {
  if (!elem) return { x: 0, y: 0, right: 0, bottom: 0 };
  const pos = elem.getBoundingClientRect();
  return {
    x: pos.left,
    y: pos.top,
    right: pos.right,
    bottom: pos.bottom,
  };
};

export const getElemsPos = (startRef, endRef): _prevPosType => {
  let start = getElemPos(startRef);
  let end = getElemPos(endRef);
  return { start, end };
};

export const getMainDivPos = (svgRef: React.MutableRefObject<any>) => {
  // if (!mainDivRef.current) return { x: 0, y: 0 };
  let { left: xarrowElemX, top: xarrowElemY } = svgRef.current.getBoundingClientRect();
  let xarrowStyle = getComputedStyle(svgRef.current);
  let xarrowStyleLeft = Number(xarrowStyle.left.slice(0, -2));
  let xarrowStyleTop = Number(xarrowStyle.top.slice(0, -2));
  return {
    x: xarrowElemX - xarrowStyleLeft,
    y: xarrowElemY - xarrowStyleTop,
  };
};
