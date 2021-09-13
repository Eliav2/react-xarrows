import React from 'react';
import { XElementType } from '../privateTypes';
import { extendPosType, getPathState, getPathStateType } from '../utils/XarrowUtils';

// export interface XarrowBasicProps extends Omit<XarrowCoreProps, 'children'> {
export interface XarrowBasicAPIProps {}

export interface XarrowBasicProps extends XarrowBasicAPIProps {
  startElem: XElementType;
  endElem: XElementType;
  rootElem: XElementType;
  // arrowBodyProps?: SVGProps<SVGPathElement>;

  children?: (state: getPathStateType) => React.ReactElement;
}

/**
 * receives the position of the start, end , and the root elements(which is the position of the main div).
 * will calculate a simple path. if no children is provided will return a <path/> element. else will pass down the
 * updated path for farther customization.
 */
const XarrowBasicPath: React.FC<XarrowBasicProps> = (props) => {
  const { startElem, endElem, rootElem } = props;
  const elems = Object.values({ startElem, endElem, rootElem }) as [XElementType, XElementType, XElementType];
  const getPathState = getPosition(...elems);
  if (!props.children) {
    // in case this component is used without children(means that A UI feedback is expected) return a simple line connecting the chosen points
    return <path d={getPathState()} stroke="black" />;
  }
  return props.children(getPathState);
};

export default XarrowBasicPath;

// export type getPathType = (extendPos?: extendPosType, pos?: basicPos) => getPathType | string;

export const getPosition = (startElem: XElementType, endElem: XElementType, rootElem: XElementType) => {
  const { x: xr, y: yr } = rootElem.position;
  const startPos = startElem.position;
  const endPos = endElem.position;
  let xs = startPos.x - xr;
  let ys = startPos.y - yr;
  let xe = endPos.x - xr;
  let ye = endPos.y - yr;
  const posSt = { xs, ys, xe, ye };
  return getPathState(
    (pos) => pos,
    (pos) => `M ${pos.x1} ${pos.y1} L ${pos.x2} ${pos.y2}`,
    posSt
  );
};
