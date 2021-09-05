import React, { SVGProps } from 'react';
import XarrowCore, { XarrowCoreProps } from './XarrowCore';
import { XElementType } from '../privateTypes';
import { string } from 'prop-types';

type basicPos = { ys: number; xs: number; ye: number; xe: number };
type extendPosType = ((pos: basicPos) => basicPos) | undefined;
type getPathType = (extendPos?: extendPosType, pos?: basicPos) => getPathType | string;

export const getPosition = (startElem: XElementType, endElem: XElementType, rootElem: XElementType) => {
  const { x: xr, y: yr } = rootElem.position;
  const startPos = startElem.position;
  const endPos = endElem.position;
  let xs = (startPos.x + startPos.right) / 2 - xr;
  let ys = (startPos.y + startPos.bottom) / 2 - yr;
  let xe = (endPos.x + endPos.right) / 2 - xr;
  let ye = (endPos.y + endPos.bottom) / 2 - yr;
  const posSt = { xs, ys, xe, ye };
  const getPath: getPathType = (extendPos?: extendPosType, pos = posSt) => {
    if (extendPos) {
      let newPos = extendPos(pos);
      return (newExtendPos?) => getPath(newExtendPos, newPos);
    } else return `M ${pos.xs} ${pos.ys} L ${pos.xe} ${pos.ye}`;
  };
  return getPath;
};

export interface XarrowBasicProps extends Omit<XarrowCoreProps, 'children'> {
  extendPath?: (pos: basicPos) => basicPos;
  // arrowBodyProps?: SVGProps<SVGPathElement>;

  // children: (path: extendPos?: (pos: basicPos) => basicPos) => string;
  // children:  (extendPos?: basicPos) => string
  children: (state: (extendPos?: (pos: basicPos) => basicPos) => string | getPathType) => React.ReactElement;
}

const XarrowBasicPath: React.FC<XarrowBasicProps> = (props) => {
  return (
    <XarrowCore {...props}>
      {(elemsSt) => {
        const elems = Object.values(elemsSt) as [XElementType, XElementType, XElementType];
        const getPath = getPosition(...elems);
        let newGetPath = getPath(props.extendPath);
        if (!props.children) return <path d={(newGetPath as CallableFunction)()} stroke="black" />;
        return props.children(newGetPath as getPathType);
        // const path = getPath(props.extendPath);
      }}
    </XarrowCore>
  );
};

export default XarrowBasicPath;

// Properties	Description	default value	type                                                               //
//     start	ref to start element	none(Required!)	string/ReactRef                                        //
// end	ref to end element	none(Required!)	string/ReactRef                                                    //
// startAnchor	from which side the arrow should start from start element	'auto'	string/object/array        // behavior
// endAnchor	at which side the arrow should end at end element	'auto'	string/object/array                // behavior
// labels	optional labels	null	string/array                                                               // enhancement
// color	color of Xarrow(all parts)	'CornflowerBlue'	string                                             // style
// lineColor	color of the line	null	string                                                             // style
// headColor	color of the head	null	string                                                             // style
// tailColor	color of the tail	null	string                                                             // style
// strokeWidth	thickness of Xarrow(all parts)	4	number                                                     // style
// headSize	thickness of head(relative to strokeWidth)	6	number                                             // style
// tailSize	thickness of tail(relative to strokeWidth)	6	number                                             // style
// path	path drawing style	'smooth'	string                                                                 //
// curveness	how much the line curveness when path='smooth'	0.8	number                                     //
// gridBreak	where the line breaks in path='grid'	"50%"	string                                         //
// dashness	should the line be dashed	false	boolean/object                                                 //
// showHead	show the arrow head?	true	boolean                                                            //
// showTail	show the arrow tail?	false	boolean                                                            //
// showXarrow	show Xarrow?	true	boolean                                                                //
// animateDrawing	animate drawing when arrow mounts?	false	boolean/object                                 //
// headShape	shape of the arrow head	'arrow1'	string/object                                              //
// tailShape	shape of the arrow tail	'arrow1'	string/object                                              //
// zIndex	zIndex - Overlapping elements with a larger z-index cover those with a smaller one	0	number     //
