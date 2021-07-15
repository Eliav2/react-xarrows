/**
 * utility functions for preparing `startAnchor` and `endAnchor` to accept the diffrent types that can be passed.
 */

import { anchorCustomPositionType, anchorEdgeType, anchorType, dimensionType, tAnchorEdge } from '../types';
import { getElemPos } from '../utils';

const getAnchorsDefaultOffsets = (width: number, height: number) => {
  return {
    middle: { rightness: width * 0.5, bottomness: height * 0.5 },
    left: { rightness: 0, bottomness: height * 0.5 },
    right: { rightness: width, bottomness: height * 0.5 },
    top: { rightness: width * 0.5, bottomness: 0 },
    bottom: { rightness: width * 0.5, bottomness: height },
  };
};

export const calcAnchors = (anchors: anchorCustomPositionType[], propAnchor: HTMLElement) => {
  const anchorPos = getElemPos(propAnchor);
  // // convert to array
  // let anchorChoice = Array.isArray(anchor) ? anchor : [anchor];
  //
  // //convert to array of objects
  // let anchorChoice2 = anchorChoice.map((anchorChoice) => {
  //   if (typeof anchorChoice === 'string') {
  //     return { position: anchorChoice };
  //   } else return anchorChoice;
  // });
  //
  // //remove any invalid anchor names
  // anchorChoice2 = anchorChoice2.filter((an) => tAnchorEdge.includes(an.position));
  // if (anchorChoice2.length == 0) anchorChoice2 = [{ position: 'auto' }];
  //
  // //replace any 'auto' with ['left','right','bottom','top']
  // let autosAncs = anchorChoice2.filter((an) => an.position === 'auto');
  // if (autosAncs.length > 0) {
  //   anchorChoice2 = anchorChoice2.filter((an) => an.position !== 'auto');
  //   anchorChoice2.push(
  //     ...autosAncs.flatMap((anchorObj) => {
  //       return (['left', 'right', 'top', 'bottom'] as anchorEdgeType[]).map((anchorName) => {
  //         return { ...anchorObj, position: anchorName };
  //       });
  //     })
  //   );
  // }
  //
  // // default values
  // let anchorChoice3 = anchorChoice2.map((anchorChoice) => {
  //   if (typeof anchorChoice === 'object') {
  //     let anchorChoiceCustom = anchorChoice as anchorCustomPositionType;
  //     if (!anchorChoiceCustom.position) anchorChoiceCustom.position = 'auto';
  //     if (!anchorChoiceCustom.offset) anchorChoiceCustom.offset = { rightness: 0, bottomness: 0 };
  //     if (!anchorChoiceCustom.offset.bottomness) anchorChoiceCustom.offset.bottomness = 0;
  //     if (!anchorChoiceCustom.offset.rightness) anchorChoiceCustom.offset.rightness = 0;
  //     anchorChoiceCustom = anchorChoiceCustom as Required<anchorCustomPositionType>;
  //     return anchorChoiceCustom;
  //   } else return anchorChoice;
  // }) as Required<anchorCustomPositionType>[];
  //
  // let anchorChoice4 = anchorChoice3 as anchorCustomPositionType2[];

  // let anchorPossibilities: Required<anchorCustomPositionType>[] = [];
  // if (anchorChoice.map((a) => a.position).includes('auto')) {
  //   let autoAnchor = anchorChoice.find((a) => a.position === 'auto');

  // now prepare this list of anchors to object expected by the `getShortestLine` function
  return anchors.map((anchor) => {
    let defsOffsets = getAnchorsDefaultOffsets(anchorPos.right - anchorPos.x, anchorPos.bottom - anchorPos.y);
    let { rightness, bottomness } = defsOffsets[anchor.position];
    return {
      x: anchorPos.x + rightness + anchor.offset.rightness,
      y: anchorPos.y + bottomness + anchor.offset.bottomness,
      anchor: anchor,
    };
  });
};

if (require.main === module) {
  // const res = parseAnchor(['auto'], {
  //   x: 0,
  //   y: 0,
  //   bottom: 10,
  //   right: 20,
  // });
  // console.log(res);
}
