import { anchorCustomPositionType } from '../types';
import { dimensionType } from '../privateTypes';

const getAnchorsDefaultOffsets = (width: number, height: number) => {
  return {
    middle: { x: width * 0.5, y: height * 0.5 },
    left: { x: 0, y: height * 0.5 },
    right: { x: width, y: height * 0.5 },
    top: { x: width * 0.5, y: 0 },
    bottom: { x: width * 0.5, y: height },
  };
};

export const calcAnchors = (anchors: anchorCustomPositionType[], anchorPos: dimensionType) => {
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

if (require.main === module) {
  // const res = parseAnchor(['auto'], {
  //   x: 0,
  //   y: 0,
  //   bottom: 10,
  //   right: 20,
  // });
  // console.log(res);
}
