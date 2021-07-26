import { anchorCustomPositionType, refType } from '../../types';
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

// return relative,abs
export const xStr2absRelative = (str): { abs: number; relative: number } => {
  if (typeof str !== 'string') return { abs: 0, relative: 0.5 };
  let sp = str.split('%');
  let absLen = 0,
    percentLen = 0;
  if (sp.length == 1) {
    let p = parseFloat(sp[0]);
    if (!isNaN(p)) {
      absLen = p;
      return { abs: absLen, relative: 0 };
    }
  } else if (sp.length == 2) {
    let [p1, p2] = [parseFloat(sp[0]), parseFloat(sp[1])];
    if (!isNaN(p1)) percentLen = p1 / 100;
    if (!isNaN(p2)) absLen = p2;
    if (!isNaN(p1) || !isNaN(p2)) return { abs: absLen, relative: percentLen };
  }
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

export const getSvgPos = (svgRef: React.MutableRefObject<any>) => {
  if (!svgRef.current) return { x: 0, y: 0 };
  let { left: xarrowElemX, top: xarrowElemY } = svgRef.current.getBoundingClientRect();
  let xarrowStyle = getComputedStyle(svgRef.current);
  let xarrowStyleLeft = Number(xarrowStyle.left.slice(0, -2));
  let xarrowStyleTop = Number(xarrowStyle.top.slice(0, -2));
  return {
    x: xarrowElemX - xarrowStyleLeft,
    y: xarrowElemY - xarrowStyleTop,
  };
};
