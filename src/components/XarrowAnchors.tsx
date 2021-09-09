import React, { useMemo } from 'react';
import { getPathType } from './XarrowBasicPath';
import PT from 'prop-types';
import { cAnchorEdge } from '../constants';
import { anchorEdgeType, posType, XElementType } from '../privateTypes';
import { getShortestLine, isDigit, isPercentStr, isRelativeOrAbsStr, xStr2absRelative } from '../utils';
import { anchorCustomPositionType, anchorNamedType, anchorType, percentStr, relativeOrAbsStr } from '../types';
import _ from 'lodash';

const pAnchorPositionType = PT.oneOf(cAnchorEdge);
const pAnchorCustomPositionType = PT.exact({
  position: pAnchorPositionType,
  offset: PT.shape({
    x: PT.number,
    y: PT.number,
    inwards: PT.number,
    sidewards: PT.number,
  }),
});
const _pAnchorType = PT.oneOfType([pAnchorPositionType, pAnchorCustomPositionType]);
const pAnchorType = PT.oneOfType([_pAnchorType, PT.arrayOf(_pAnchorType)]);

// remove 'auto' as possible anchor from anchorCustomPositionType.position
interface parsedAnchorType extends Omit<Required<anchorCustomPositionType>, 'position'> {
  position: Exclude<typeof cAnchorEdge[number], 'auto'>;
}

const parseAnchor = (anchor: anchorType) => {
  // console.log('parseAnchor');
  // convert to array
  let anchorChoice = Array.isArray(anchor) ? anchor : [anchor];

  //convert to array of objects
  let anchorChoice2 = anchorChoice.map((anchorChoice) => {
    if (typeof anchorChoice !== 'object') {
      const obj: { position: anchorNamedType; offset?: { sidewards: relativeOrAbsStr } } = {
        position: anchorChoice as anchorNamedType,
      };
      if (isRelativeOrAbsStr(anchorChoice)) {
        console.log('isPercentStr');
        obj.position = 'auto';
        _.set(obj, 'offset.sidewards', anchorChoice);
        // obj.offset.sidewards = anchorChoice;
      }
      return obj;
    } else {
      // it's object
      if (!('position' in anchorChoice)) anchorChoice.position = 'auto';
      return anchorChoice;
    }
  });

  //remove any invalid anchor names
  anchorChoice2 = anchorChoice2.filter(
    (an) => (_.isString(an) && isPercentStr(an)) || (_.isObject(an) && cAnchorEdge.includes(an?.position))
  );
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
      anchorChoiceCustom.offset ||= { x: 0, y: 0 };
      anchorChoiceCustom.offset.y ||= 0;
      anchorChoiceCustom.offset.x ||= 0;
      anchorChoiceCustom.offset.inwards ||= 0;
      anchorChoiceCustom.offset.sidewards ||= 0;
      anchorChoiceCustom = anchorChoiceCustom as Required<anchorCustomPositionType>;
      return anchorChoiceCustom;
    } else return anchorChoice;
  }) as Required<anchorCustomPositionType>[];

  // console.log(anchorChoice3);

  return anchorChoice3 as parsedAnchorType[];
};

const defaultAnchorsOffsets = {
  middle: { x: 0.5, y: 0.5 },
  left: { x: 0, y: 0.5 },
  right: { x: 1, y: 0.5 },
  top: { x: 0.5, y: 0 },
  bottom: { x: 0.5, y: 1 },
};

const inwardOffset = {
  middle: { x: 0, y: 0 },
  left: { x: 1, y: 0 },
  right: { x: -1, y: 0 },
  top: { x: 0, y: 1 },
  bottom: { x: 0, y: -1 },
};
const sidewardsOffset = {
  middle: { x: 0, y: 0 },
  left: { x: 0, y: -1 },
  right: { x: 0, y: 1 },
  top: { x: 1, y: 0 },
  bottom: { x: -1, y: 0 },
};
const inwardsDimOffset = {
  middle: { x: 0, y: 0 },
  left: { x: 1, y: 0 },
  right: { x: -1, y: 0 },
  top: { x: 0, y: 1 },
  bottom: { x: 0, y: -1 },
};
const sidewardsDimOffset = {
  middle: { x: 0, y: 0 },
  left: { x: 0, y: -1 },
  right: { x: 0, y: 1 },
  top: { x: 1, y: 0 },
  bottom: { x: -1, y: 0 },
};

// calcs the offset per each possible anchor
const calcAnchors = (anchors: parsedAnchorType[], anchorPos: posType) => {
  // now prepare this list of anchors to object expected by the `getShortestLine` function
  // console.log(anchors);
  let newAnchors = anchors.map((anchor) => {
    //offsets based anchors names
    //user defined offsets
    const { position: posName } = anchor;
    let xDef = defaultAnchorsOffsets[posName].x * anchorPos.width;
    let yDef = defaultAnchorsOffsets[posName].y * anchorPos.height;
    let { abs: absInw, relative: relInw } = xStr2absRelative(anchor.offset.inwards);
    let xi = inwardOffset[posName].x * absInw + inwardsDimOffset[posName].x * anchorPos.width * relInw;
    let yi = inwardOffset[posName].y * absInw + inwardsDimOffset[posName].y * anchorPos.height * relInw;
    let { abs: absSidw, relative: relSidw } = xStr2absRelative(anchor.offset.sidewards);
    let xsi = sidewardsOffset[posName].x * absSidw + sidewardsDimOffset[posName].x * anchorPos.width * relSidw;
    let ysi = sidewardsOffset[posName].y * absSidw + sidewardsDimOffset[posName].y * anchorPos.height * relSidw;
    // console.log(anchor.position, xDef, yDef, anchorPos.x, anchorPos.y);
    return {
      x: anchorPos.x + anchor.offset.x + xi + xsi + xDef,
      y: anchorPos.y + anchor.offset.y + yi + ysi + yDef,
      anchor: anchor,
    };
  });
  return newAnchors;
};

export interface XarrowAnchorsAPIProps {
  startAnchor?: anchorType;
  endAnchor?: anchorType;
}

export interface XarrowAnchorsProps extends XarrowAnchorsAPIProps {
  startElem: XElementType;
  endElem: XElementType;
  rootElem: XElementType;
  getPath: getPathType;
}

/**
 * assumes that the provided path is on the center of start and end element
 * will smartly chose anchor based on given props and will calculate the offset.
 */
const XarrowAnchors: React.FC<XarrowAnchorsProps> = (props) => {
  const startAnchors = useMemo(() => parseAnchor(props.startAnchor), [props.startAnchor]);
  const endAnchors = useMemo(() => parseAnchor(props.endAnchor), [props.endAnchor]);
  const startPoints = calcAnchors(startAnchors, props.startElem.position);
  const endPoints = calcAnchors(endAnchors, props.endElem.position);

  let { chosenStart, chosenEnd } = getShortestLine(startPoints, endPoints);
  // console.log(chosenStart, chosenEnd);
  chosenStart.x -= props.startElem.position.x;
  chosenStart.y -= props.startElem.position.y;
  chosenEnd.x -= props.endElem.position.x;
  chosenEnd.y -= props.endElem.position.y;
  // console.log(chosenStart.x, chosenStart.y);
  // console.log(sp.x, sp.y);

  // alter the state - offset connection points to the selected anchors
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
XarrowAnchors.defaultProps = {
  startAnchor: 'auto',
  endAnchor: 'auto',
};

export default XarrowAnchors;

if (require.main === module) {
  const testAnchors = (anchor) => {
    const dumyPosition: posType = { x: 0, y: 0, width: 50, height: 50, right: 0, bottom: 0 };
    const parsedAnchors = parseAnchor(anchor);
    const points = calcAnchors(parsedAnchors, dumyPosition);
    return points;
  };
  console.log(testAnchors('30%'));
}

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
