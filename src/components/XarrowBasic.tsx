import React, { useEffect, useState } from 'react';
import XarrowCore, { XarrowCoreProps } from './XarrowCore';
import { XElementType } from '../privateTypes';

export const getPosition = (startElem: XElementType, endElem: XElementType, rootElem: XElementType) => {
  // console.log('getPosition');
  const { x: xr, y: yr } = rootElem.position;
  const startPos = startElem.position;
  const endPos = endElem.position;
  let xs = (startPos.x + startPos.right) / 2;
  let ys = (startPos.y + startPos.bottom) / 2;
  let xe = (endPos.x + endPos.right) / 2;
  let ye = (endPos.y + endPos.bottom) / 2;
  const cw = Math.abs(xe - xs);
  const ch = Math.abs(ye - ys);
  let cx0 = Math.min(xs, xe);
  let cy0 = Math.min(ys, ye);
  xs -= cx0;
  xe -= cx0;
  ys -= cy0;
  ye -= cy0;
  cx0 -= xr;
  cy0 -= yr;
  const path = `M ${xs} ${ys} L ${xe} ${ye}`;
  return { path, cw, ch, cx0, cy0 };
};

export interface XarrowBasicProps extends Omit<XarrowCoreProps, '_getPosition'> {
  _getPosition?: typeof getPosition;
}

const XarrowBasic: React.FC<XarrowBasicProps> = (props) => {
  return <XarrowCore _getPosition={getPosition} {...props} />;
};

export default XarrowBasic;

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
