import React, { useEffect, useState } from 'react';
import XarrowBasicPath, { getPathType, XarrowBasicProps } from './XarrowBasicPath';
import PT from 'prop-types';
import { cAnchorEdge } from '../constants';
import { anchorCustomPositionType, anchorType } from '../types';
import { anchorEdgeType, posType, XElementType } from '../privateTypes';
import { getShortestLine } from '../utils';

const pAnchorPositionType = PT.oneOf(cAnchorEdge);
const pAnchorCustomPositionType = PT.exact({
  position: pAnchorPositionType.isRequired,
  offset: PT.exact({
    x: PT.number,
    y: PT.number,
  }).isRequired,
});
const _pAnchorType = PT.oneOfType([pAnchorPositionType, pAnchorCustomPositionType]);
const pAnchorType = PT.oneOfType([_pAnchorType, PT.arrayOf(_pAnchorType)]);

// remove 'auto' as possible anchor from anchorCustomPositionType.position
interface anchorCustomPositionType2 extends Omit<Required<anchorCustomPositionType>, 'position'> {
  position: Exclude<typeof cAnchorEdge[number], 'auto'>;
}
const parseAnchor = (anchor: anchorType) => {
  // convert to array
  let anchorChoice = Array.isArray(anchor) ? anchor : [anchor];

  //convert to array of objects
  let anchorChoice2 = anchorChoice.map((anchorChoice) => {
    if (typeof anchorChoice === 'string') {
      return { position: anchorChoice };
    } else return anchorChoice;
  });

  //remove any invalid anchor names
  anchorChoice2 = anchorChoice2.filter((an) => cAnchorEdge.includes(an?.position));
  if (anchorChoice2.length == 0) anchorChoice2 = [{ position: 'auto' }];

  //replace any 'auto' with ['left','right','bottom','top']
  let autosAncs = anchorChoice2.filter((an) => an.position === 'auto');
  if (autosAncs.length > 0) {
    anchorChoice2 = anchorChoice2.filter((an) => an.position !== 'auto');
    anchorChoice2.push(
      ...autosAncs.flatMap((anchorObj) => {
        return (['left', 'right', 'top', 'bottom'] as anchorEdgeType[]).map((anchorName) => {
          return { ...anchorObj, position: anchorName };
        });
      })
    );
  }

  // default values
  let anchorChoice3 = anchorChoice2.map((anchorChoice) => {
    if (typeof anchorChoice === 'object') {
      let anchorChoiceCustom = anchorChoice as anchorCustomPositionType;
      if (!anchorChoiceCustom.position) anchorChoiceCustom.position = 'auto';
      if (!anchorChoiceCustom.offset) anchorChoiceCustom.offset = { x: 0, y: 0 };
      if (!anchorChoiceCustom.offset.y) anchorChoiceCustom.offset.y = 0;
      if (!anchorChoiceCustom.offset.x) anchorChoiceCustom.offset.x = 0;
      anchorChoiceCustom = anchorChoiceCustom as Required<anchorCustomPositionType>;
      return anchorChoiceCustom;
    } else return anchorChoice;
  }) as Required<anchorCustomPositionType>[];

  return anchorChoice3 as anchorCustomPositionType2[];
};

const getAnchorsDefaultOffsets = (width: number, height: number) => {
  return {
    middle: { x: 0, y: 0 },
    left: { x: -width * 0.5, y: 0 },
    right: { x: width * 0.5, y: 0 },
    top: { x: 0, y: -height * 0.5 },
    bottom: { x: 0, y: height * 0.5 },
  };
};

// calcs the offset per each possible anchor
const calcAnchors = (anchors: anchorCustomPositionType2[], anchorPos: posType) => {
  // now prepare this list of anchors to object expected by the `getShortestLine` function
  return anchors.map((anchor) => {
    let defsOffsets = getAnchorsDefaultOffsets(anchorPos.right - anchorPos.x, anchorPos.bottom - anchorPos.y);
    let { x, y } = defsOffsets[anchor.position];
    return {
      x: anchorPos.x + x + anchor.offset.x,
      y: anchorPos.y + y + anchor.offset.y,
      anchor: anchor,
    };
  });
};

export interface XarrowAnchorsProps {
  startElem: XElementType;
  endElem: XElementType;
  getPath: getPathType;

  //API
  startAnchor?: anchorType;
  endAnchor?: anchorType;
}

/**
 * assumes that the provided path is on the center of start and end element
 * will smartly chose anchor based on given props and will calculate the offset.
 */
const XarrowAnchors: React.FC<XarrowAnchorsProps> = (props) => {
  const startAnchors = parseAnchor(props.startAnchor);
  const startPoints = calcAnchors(startAnchors, props.startElem.position);
  const endAnchors = parseAnchor(props.endAnchor);
  const endPoints = calcAnchors(endAnchors, props.endElem.position);

  let { chosenStart, chosenEnd } = getShortestLine(startPoints, endPoints);
  chosenStart.x -= props.startElem.position.x;
  chosenStart.y -= props.startElem.position.y;
  chosenEnd.x -= props.endElem.position.x;
  chosenEnd.y -= props.endElem.position.y;

  // offset connection points to the selected anchors
  let newGetPath = props.getPath((posSt) => {
    posSt.xs += chosenStart.x;
    posSt.ys += chosenStart.y;
    posSt.xe += chosenEnd.x;
    posSt.ye += chosenEnd.y;
    return posSt;
  });
  if (!props.children) return <path d={(newGetPath as CallableFunction)()} stroke="black" />;
};

XarrowAnchors.propTypes = {
  startAnchor: pAnchorType,
  endAnchor: pAnchorType,
};

export default XarrowAnchors;

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
