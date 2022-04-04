import { anchorCustomPositionType, anchorNamedType, anchorType, relativeOrAbsStr } from '../types';
import React, { useMemo } from 'react';
import { createFeature } from '../components/XarrowBuilder';
import { choosenAnchorType, getShortestLine, isPercentStr, isRelativeOrAbsStr, xStr2absRelative } from '../utils';
import { Vector } from '../classes/path';
import _ from 'lodash';
import { cAnchorEdge } from '../constants';
import { anchorEdgeType, containsPointType } from '../privateTypes';
import PT from 'prop-types';
import { CoreStateChange } from './Core';
import {
  anchorsDefaultOffsets,
  anchorsInwardOffset,
  anchorsInwardsDimOffset,
  anchorsSidewardsDimOffset,
  anchorsSidewardsOffset,
} from '../utils/XarrowUtils';

const pAnchorString = (props, propName, componentName) => {
  if (!/^\d+%?\d*$/.test(props[propName])) {
    return new Error('Invalid prop `' + propName + '` supplied to' + ' `' + componentName + '`. Validation failed.');
  }
};
const pAnchorPositionType = PT.oneOfType([PT.oneOf(cAnchorEdge), pAnchorString]);
const pAnchorCustomPositionType = PT.exact({
  position: pAnchorPositionType.isRequired,
  offset: PT.exact({
    x: PT.number,
    y: PT.number,
    inwards: PT.oneOfType([PT.string, PT.number] as any),
    sidewards: PT.oneOfType([PT.string, PT.number] as any),
  }),
});
const _pAnchorType = PT.oneOfType([pAnchorPositionType, pAnchorCustomPositionType]);
const pAnchorType = PT.oneOfType([_pAnchorType, PT.arrayOf(_pAnchorType)]);

export interface AnchorsStateChange {
  chosenStart: choosenAnchorType;
  chosenEnd: choosenAnchorType;
}

export interface AnchorsProps {
  startAnchor?: anchorType;
  endAnchor?: anchorType;
}

const Anchors = createFeature<
  AnchorsProps,
  CoreStateChange,
  AnchorsStateChange,
  { startAnchor: parsedAnchorType[]; endAnchor: parsedAnchorType[] }
>({
  name: 'Anchors',
  propTypes: {
    startAnchor: pAnchorType,
    endAnchor: pAnchorType,
  },
  parseProps: {
    startAnchor: (startAnchor) => useMemo(() => parseAnchor(startAnchor), [startAnchor]),
    endAnchor: (endAnchor) => useMemo(() => parseAnchor(endAnchor), [endAnchor]),
  },
  defaultProps: {
    startAnchor: 'auto',
    endAnchor: 'auto',
  },
  state: ({ state, props }) => {
    const { startAnchor, endAnchor } = props;
    const { startElem, endElem } = state;
    const startPoints = calcAnchors(startAnchor, startElem.position);
    const endPoints = calcAnchors(endAnchor, endElem.position);
    let { chosenStart, chosenEnd } = getShortestLine(startPoints, endPoints);
    state.posSt.start = new Vector(chosenStart);
    state.posSt.end = new Vector(chosenEnd);
    return { chosenStart, chosenEnd };
  },
  // jsx:...  is not needed because this feature does not change the jsx, it's just changing the state which the jsx uses
});

export interface parsedAnchorType extends Omit<Required<anchorCustomPositionType>, 'position'> {
  // position: anchorEdgeType;
  position: Exclude<anchorNamedType, 'auto'>;
}

const parseAnchor = (anchor: anchorType): parsedAnchorType[] => {
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
      anchorChoiceCustom.facingDir ||= ['auto'];
      if (!Array.isArray(anchorChoiceCustom.facingDir)) anchorChoiceCustom.facingDir = [anchorChoiceCustom.facingDir];

      anchorChoiceCustom = anchorChoiceCustom as Required<anchorCustomPositionType>;
      return anchorChoiceCustom;
    } else return anchorChoice;
  }) as Required<anchorCustomPositionType>[];

  // console.log(anchorChoice3);

  return anchorChoice3 as parsedAnchorType[];
};

// calcs the offset per each possible anchor
const calcAnchors = (anchors: parsedAnchorType[], anchorPos: containsPointType) => {
  // now prepare this list of anchors to object expected by the `getShortestLine` function
  // console.log(anchors);

  let newAnchors = anchors.map((anchor) => {
    //offsets based anchors names
    //user defined offsets
    const { position: posName } = anchor;
    anchorPos.width ||= 0;
    anchorPos.height ||= 0;
    let xDef = anchorsDefaultOffsets[posName].x * anchorPos.width;
    let yDef = anchorsDefaultOffsets[posName].y * anchorPos.height;
    let { abs: absInw, relative: relInw } = xStr2absRelative(anchor.offset.inwards);
    let xi = anchorsInwardOffset[posName].x * absInw + anchorsInwardsDimOffset[posName].x * anchorPos.width * relInw;
    let yi = anchorsInwardOffset[posName].y * absInw + anchorsInwardsDimOffset[posName].y * anchorPos.height * relInw;
    let { abs: absSidw, relative: relSidw } = xStr2absRelative(anchor.offset.sidewards);
    let xsi =
      anchorsSidewardsOffset[posName].x * absSidw + anchorsSidewardsDimOffset[posName].x * anchorPos.width * relSidw;
    let ysi =
      anchorsSidewardsOffset[posName].y * absSidw + anchorsSidewardsDimOffset[posName].y * anchorPos.height * relSidw;
    // console.log(anchor.position, xDef, yDef, anchorPos.x, anchorPos.y);
    return {
      x: anchorPos.x + anchor.offset.x + xi + xsi + xDef,
      y: anchorPos.y + anchor.offset.y + yi + ysi + yDef,
      anchor: anchor,
    };
  });
  return newAnchors;
};

export default Anchors;
