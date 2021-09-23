import React from 'react';
import { XElementType } from '../privateTypes';
import { getPathState, getPathStateType, simplePosType } from '../utils/XarrowUtils';

export interface XarrowBasicAPIProps {}

export interface XarrowBasicProps extends XarrowBasicAPIProps {
  startElem: XElementType;
  endElem: XElementType;
  rootElem: XElementType;
  // arrowBodyProps?: SVGProps<SVGPathElement>;

  children?: (
    state: getPathStateType<simplePosType, `M ${number} ${number} L ${number} ${number}`>
  ) => React.ReactElement;
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
  let x1 = startPos.x - xr;
  let y1 = startPos.y - yr;
  let x2 = endPos.x - xr;
  let y2 = endPos.y - yr;
  const posSt = { x1, y1, x2, y2 };
  return getPathState(
    (pos) => pos,
    (pos) => `M ${pos.x1} ${pos.y1} L ${pos.x2} ${pos.y2}` as const,
    posSt
  );
};
