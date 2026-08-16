import { refType } from '../../types';
import { parsedAnchorType } from '../../privateTypes';
import React from 'react';

export type point = { x: number; y: number };

export const getElementByPropGiven = (ref: refType): Element | null => {
  let myRef;
  if (typeof ref === 'string') {
    // myRef = document.getElementById(ref);
    myRef = document.getElementById(ref);
  } else myRef = ref?.current;
  return myRef ?? null;
};

// receives string representing a d path and factoring only the numbers
export const factorDpathStr = (d: string, factor: number) => {
  let l = d.split(/(\d+(?:\.\d+)?)/);
  l = l.map((s) => {
    if (Number(s)) return (Number(s) * factor).toString();
    else return s;
  });
  return l.join('');
};

// return relative,abs
export const xStr2absRelative = (str: string): { abs: number; relative: number } | undefined => {
  if (typeof str !== 'string') return { abs: 0, relative: 0.5 };
  const sp = str.split('%');
  let absLen = 0,
    percentLen = 0;
  if (sp.length == 1) {
    const p = parseFloat(sp[0]);
    if (!isNaN(p)) {
      absLen = p;
      return { abs: absLen, relative: 0 };
    }
  } else if (sp.length == 2) {
    const [p1, p2] = [parseFloat(sp[0]), parseFloat(sp[1])];
    if (!isNaN(p1)) percentLen = p1 / 100;
    if (!isNaN(p2)) absLen = p2;
    if (!isNaN(p1) || !isNaN(p2)) return { abs: absLen, relative: percentLen };
  }
};

const dist = (p1: point, p2: point) => {
  //length of line
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
};

type t1 = { x: number; y: number; anchor: parsedAnchorType };

export const getShortestLine = (sPoints: t1[], ePoints: t1[]) => {
  // closes tPair Of Points which feet to the specified anchors
  let minDist = Infinity,
    d = Infinity;
  // Seeded with the first pair rather than left unassigned: callers destructure
  // the result, and both lists always hold at least one anchor.
  let closestPair = { chosenStart: sPoints[0], chosenEnd: ePoints[0] };
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

export const getElemPos = (elem: Element | null) => {
  if (!elem) return { x: 0, y: 0, right: 0, bottom: 0 };
  const pos = elem.getBoundingClientRect();
  return {
    x: pos.left,
    y: pos.top,
    right: pos.right,
    bottom: pos.bottom,
  };
};

export const getSvgPos = (svgRef: React.MutableRefObject<SVGSVGElement | null>) => {
  if (!svgRef.current) return { x: 0, y: 0 };
  const { left: xarrowElemX, top: xarrowElemY } = svgRef.current.getBoundingClientRect();
  const xarrowStyle = getComputedStyle(svgRef.current);
  const xarrowStyleLeft = Number(xarrowStyle.left.slice(0, -2));
  const xarrowStyleTop = Number(xarrowStyle.top.slice(0, -2));
  return {
    x: xarrowElemX - xarrowStyleLeft,
    y: xarrowElemY - xarrowStyleTop,
  };
};

/**
 * SVGGeometryElement.getTotalLength is not implemented by every DOM
 * implementation - jsdom and server-side rendering both provide the element
 * without the method. Falling back to 0 keeps the draw animation inert instead
 * of throwing during render.
 */
export const getTotalLength = (elem: SVGPathElement | null): number => {
  if (!elem || typeof elem.getTotalLength !== 'function') return 0;
  return elem.getTotalLength();
};

const SAME_POINT_EPSILON = 1e-6;

/**
 * Builds an SVG path through `points`, rounding every interior corner with a
 * quadratic whose control point is the corner itself.
 *
 * Deliberately vector based rather than special cased per corner orientation.
 * The grid control points are axis aligned only by arithmetic coincidence - the
 * head offset applied to cpx1 and cpx2 cancels out the shift applied to x2 - so
 * comparing coordinates for equality would rest on two independently computed
 * floats matching exactly, and would break outright for anyone using the
 * _cpx1Offset escape hatches.
 */
export const polylinePath = (points: point[], radius: number): string => {
  // Collapse repeated points first. The hv and vh grid paths put the second
  // control point on top of the end point, and gridBreak "0%" puts the first on
  // top of the start; left in place they become zero length segments and the
  // corner math divides by zero.
  const p = points.filter(
    (q, i) =>
      i === 0 ||
      Math.abs(q.x - points[i - 1].x) > SAME_POINT_EPSILON ||
      Math.abs(q.y - points[i - 1].y) > SAME_POINT_EPSILON,
  );
  if (p.length === 0) return '';
  const move = `M ${p[0].x} ${p[0].y}`;
  if (!(radius > 0) || p.length < 3)
    return (
      move +
      p
        .slice(1)
        .map((q) => ` L ${q.x} ${q.y}`)
        .join('')
    );

  let d = move;
  for (let i = 1; i < p.length - 1; i++) {
    const [prev, corner, next] = [p[i - 1], p[i], p[i + 1]];
    const dPrev = Math.sqrt((corner.x - prev.x) ** 2 + (corner.y - prev.y) ** 2);
    const dNext = Math.sqrt((next.x - corner.x) ** 2 + (next.y - corner.y) ** 2);
    // Half of the shorter neighbour, so that two corners sharing a segment can
    // never overshoot into each other and fold the path back on itself.
    const r = Math.min(radius, dPrev / 2, dNext / 2);
    if (!(r > 0)) {
      d += ` L ${corner.x} ${corner.y}`;
      continue;
    }
    d += ` L ${corner.x + ((prev.x - corner.x) / dPrev) * r} ${corner.y + ((prev.y - corner.y) / dPrev) * r}`;
    d += ` Q ${corner.x} ${corner.y} ${corner.x + ((next.x - corner.x) / dNext) * r} ${
      corner.y + ((next.y - corner.y) / dNext) * r
    }`;
  }
  const last = p[p.length - 1];
  return `${d} L ${last.x} ${last.y}`;
};
