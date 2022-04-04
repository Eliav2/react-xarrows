import { anchorCustomPositionType, percentStr, refType, relativeOrAbsStr } from '../types';
import React from 'react';
import _ from 'lodash';
import { posType } from '../privateTypes';
import { parsedAnchorType } from '../features/Anchors';
import { _faceDirType } from '../features/PathPro';
// import { parsedAnchorType } from '../components/XarrowAnchors';

export const getElementByPropGiven = (ref: refType): HTMLElement => {
  let myRef;
  if (typeof ref === 'string') {
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
export const xStr2absRelative = (str: relativeOrAbsStr): { abs: number; relative: number } => {
  if (typeof str === 'number') return { abs: str, relative: 0 };
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

export type choosenAnchorType = { x: number; y: number; anchor: parsedAnchorType };

const defaultChosen = {
  x: 0,
  y: 0,
  anchor: {
    position: 'middle' as const,
    offset: { x: 0, y: 0, inwards: 0, sidewards: 0 },
    facingDir: 'auto' as const,
  },
};
const defaultPair = { chosenStart: defaultChosen, chosenEnd: defaultChosen };

export const getShortestLine = (sPoints: choosenAnchorType[], ePoints: choosenAnchorType[]) => {
  // closes tPair Of Points which feet to the specified anchors
  let minDist = Infinity,
    d = Infinity;
  let closestPair: { chosenStart: choosenAnchorType; chosenEnd: choosenAnchorType } = defaultPair;
  sPoints.forEach((sp) => {
    ePoints.forEach((ep) => {
      d = dist(sp, ep);
      // multiple with 0.95 so the next closer point is at least 5% closer
      if (d < minDist * 0.95) {
        minDist = d;
        closestPair = { chosenStart: sp, chosenEnd: ep };
      }
    });
  });
  return closestPair;
};

export const getElemPos = (elem: HTMLElement): posType => {
  // console.log(memorizedPositions);
  if (!elem || !('getBoundingClientRect' in elem)) {
    // return null;
    return { x: 0, y: 0, right: 0, bottom: 0, height: 0, width: 0 };
  }
  // const pos = elem.getBoundingClientRect();
  // console.log(_.pick(elem.getBoundingClientRect(), 'left', 'top', 'right', 'bottom'));
  // return {
  //   x: pos.left,
  //   y: pos.top,
  //   right: pos.right,
  //   bottom: pos.bottom,
  // };
  const pos = _.pick(elem.getBoundingClientRect(), 'x', 'y', 'right', 'bottom', 'width', 'height');
  // if (!memorizedPositions.has(elem)) memorizedPositions.set(elem, pos);
  return pos;
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

const charCodeZero = '0'.charCodeAt(0);
const charCodeNine = '9'.charCodeAt(0);

export function isDigit(s: string) {
  return s.length == 1 && s.charCodeAt(0) >= charCodeZero && s.charCodeAt(0) <= charCodeNine;
}

const isNumber = (s: string) => {
  let i = 0;
  if (s[0] == '-') i++;
  for (; i < s.length; i++) if (!isDigit(s[i])) return false;
  return true;
};

export const isPercentStr = (s: string): s is percentStr => {
  // let i;
  // if (s.length < 2) return false;
  // for (i = 0; i < s.length - 1; i++) {
  //   if (!isDigit(s[i])) return false;
  // }
  return isNumber(s.slice(0, -1)) && s[s.length - 1] == '%';
};

export const isRelativeOrAbsStr = (s: string | number) => {
  if (typeof s === 'number') return true;
  let sp = s.split('%');
  if (sp.length == 1 || (sp.length == 2 && sp[1] == '')) {
    return isPercentStr(s) || isNumber(s);
  } else if (sp.length == 2) {
    return isPercentStr(sp[0] + '%') && isNumber(sp[1]);
  }
  return false;
};

export const between = (num: number, a: number, b: number, inclusiveA = true, inclusiveB = true): boolean => {
  if (a > b) [a, b, inclusiveA, inclusiveB] = [b, a, inclusiveB, inclusiveA];
  if (a == b && (inclusiveA || inclusiveB)) [inclusiveA, inclusiveB] = [true, true];
  return (inclusiveA ? num >= a : num > a) && (inclusiveB ? num <= b : num < b);
};

// if (require.main === module) {
//   console.log(isPercentStr('1%'));
//   console.log(isPercentStr('1'));
//   // console.log(isRelativeOrAbsStr('1'));
//   // console.log(isRelativeOrAbsStr('1%'));
// }
// isNaN('19');
