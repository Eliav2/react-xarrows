import { positionType } from "shared/hooks/usePosition";
import { useXContext } from "./XArrow";
import { RelativeSize } from "shared/types";
import { OneOrMore } from "./typeUtils";
import { getRelativeSizeValue } from "shared/utils";
import { Direction, NamedDirection } from "./types";
import { toArray } from "./utils";

const cStartAnchorsMap: { [key in AnchorName]: AnchorCustom } = {
  middle: { x: "50%", y: "50%", trailingDir: [{ x: 0, y: 0 }] },
  left: { x: "0%", y: "50%", trailingDir: [{ x: -1, y: 0 }] },
  right: { x: "100%", y: "50%", trailingDir: [{ x: 1, y: 0 }] },
  top: { x: "50%", y: "0%", trailingDir: [{ x: 0, y: -1 }] },
  bottom: { x: "50%", y: "100%", trailingDir: [{ x: 0, y: 1 }] },
};
const cEndAnchorsMap: { [key in AnchorName]: AnchorCustom } = {
  middle: { x: "50%", y: "50%", trailingDir: [{ x: 0, y: 0 }] },
  left: { x: "0%", y: "50%", trailingDir: [{ x: 1, y: 0 }] },
  right: { x: "100%", y: "50%", trailingDir: [{ x: -1, y: 0 }] },
  top: { x: "50%", y: "0%", trailingDir: [{ x: 0, y: 1 }] },
  bottom: { x: "50%", y: "100%", trailingDir: [{ x: 0, y: -1 }] },
};

export type AnchorName = "middle" | NamedDirection;
export type AnchorsOptions = AnchorName | "auto";
export type AnchorDirection = OneOrMore<Direction>;
export type AnchorCustom = {
  // the x position of the anchor relative to the element
  x?: RelativeSize;
  // the y position of the anchor relative to the element
  y?: RelativeSize;
  // the allowed directions out of this anchor
  trailingDir?: AnchorDirection;
};
export type Anchor = OneOrMore<AnchorsOptions | AnchorCustom>;

function extractPointsFromAnchors(
  elemPos: NonNullable<positionType>,
  anchor: Anchor,
  defaultAnchors: { [anchorName: string]: AnchorCustom } = {}
) {
  // convert to array
  let anchorArr = toArray(anchor);

  // replace any 'auto' with ['left','right','bottom','top']
  if (anchorArr.some((an) => an === "auto")) {
    anchorArr = [...anchorArr.filter((an) => an !== "auto"), "left", "right", "top", "bottom"];
  }
  //remove any invalid anchor names
  anchorArr = anchorArr.filter((an) => typeof an !== "string" || an in defaultAnchors);

  // convert named anchors to custom anchors
  const anchorCustomArr: Array<AnchorCustom> = anchorArr.map((an) => {
    if (typeof an === "string") return defaultAnchors[an];
    return an;
  });

  // make sure any given custom anchor has all the needed properties
  const anchorCustomArrWithDefaults = anchorCustomArr.map((an) => {
    const { x = "50%", y = "50%", trailingDir = [{ x: 0, y: 0 }] } = an;
    return { x, y, trailingDir: trailingDir };
  });

  // convert to points
  const points = anchorCustomArrWithDefaults.map((an) => {
    return {
      x: getRelativeSizeValue(an.x ?? "50%", elemPos.width) + elemPos.left,
      y: getRelativeSizeValue(an.y ?? "50%", elemPos.height) + elemPos.top,
      trailingDir: an.trailingDir,
    };
  });

  return points;
}

function findBestPoint(
  startPoints: { x: number; y: number; trailingDir: AnchorDirection }[],
  endPoints: { x: number; y: number; trailingDir: AnchorDirection }[]
) {
  // find the shortest distance between the start and end points
  let bestPoint = { start: startPoints[0], end: endPoints[0], distance: Infinity };
  for (const start of startPoints) {
    for (const end of endPoints) {
      const distance = Math.sqrt((start.x - end.x) ** 2 + (start.y - end.y) ** 2);
      // multiple with 0.9 so the next closer point is at least 10% closer
      if (distance < bestPoint.distance * 0.9) {
        bestPoint = { start, end, distance };
      }
    }
  }
  return bestPoint;
}

export const autoSelectAnchor = ({
  startElem,
  endElem,
  startAnchor = "auto",
  endAnchor = "auto",
}: {
  startElem: NonNullable<positionType>;
  endElem: NonNullable<positionType>;
  startAnchor?: Anchor;
  endAnchor?: Anchor;
}) => {
  const startPoints = extractPointsFromAnchors(startElem, startAnchor, cStartAnchorsMap);
  const endPoints = extractPointsFromAnchors(endElem, endAnchor, cEndAnchorsMap);
  const bestPoint = findBestPoint(startPoints, endPoints);
  return {
    startPoint: bestPoint.start,
    endPoint: bestPoint.end,
  };
};

export const useAutoSelectAnchor = ({ startAnchor = "auto", endAnchor = "auto" }: { startAnchor?: Anchor; endAnchor?: Anchor } = {}) => {
  const context = useXContext();
  const { startElem, endElem } = context;
  if (!startElem || !endElem) return null;
  return () => autoSelectAnchor({ startElem, endElem, startAnchor, endAnchor });
};
