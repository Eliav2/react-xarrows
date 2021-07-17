import { anchorCustomPositionType, dimensionType } from '../types';
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

export const calcAnchors = (anchors: anchorCustomPositionType[], anchorPos: dimensionType) => {
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
