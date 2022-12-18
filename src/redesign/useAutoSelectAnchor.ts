import { positionType } from "shared/hooks/usePosition";
import { useXArrowContext } from "./XArrow";
import { RelativeSize } from "shared/types";
import { OneOrMore } from "./typeUtils";
import { getRelativeSizeValue } from "shared/utils";

const cAnchorsMap = {
  middle: { x: "50%", y: "50%" },
  left: { x: "0%", y: "50%" },
  right: { x: "100%", y: "50%" },
  top: { x: "50%", y: "0%" },
  bottom: { x: "50%", y: "100%" },
} as const;

type AnchorsEdges = keyof typeof cAnchorsMap;
type AnchorsOptions = AnchorsEdges | "auto";
type AnchorsCustom = { x: RelativeSize; y: RelativeSize };
export type Anchor = OneOrMore<AnchorsOptions | AnchorsCustom>;

function extractPointsFromAnchors(elemPos: NonNullable<positionType>, anchor: Anchor) {
  // convert to array
  let anchorArr = Array.isArray(anchor) ? anchor : [anchor];

  // replace any 'auto' with ['left','right','bottom','top']
  if (anchorArr.some((an) => an === "auto")) {
    anchorArr = [...anchorArr.filter((an) => an !== "auto"), "left", "right", "top", "bottom"];
  }
  //remove any invalid anchor names
  anchorArr = anchorArr.filter((an) => typeof an !== "string" || an in cAnchorsMap);

  // convert named anchors to custom anchors
  const anchorCustomArr: Array<AnchorsCustom> = anchorArr.map((an) => {
    if (typeof an === "string") return cAnchorsMap[an];
    return an;
  });

  // convert to points
  const points = anchorCustomArr.map((an) => {
    return {
      x: getRelativeSizeValue(an.x, elemPos.width) + elemPos.left,
      y: getRelativeSizeValue(an.y, elemPos.height) + elemPos.top,
    };
  });

  return points;
}

function findBestPoint(startPoints: { x: number; y: number }[], endPoints: { x: number; y: number }[]) {
  // find the shortest distance between the start and end points
  let bestPoint = { start: startPoints[0], end: endPoints[0], distance: Infinity };
  for (const start of startPoints) {
    for (const end of endPoints) {
      const distance = Math.sqrt((start.x - end.x) ** 2 + (start.y - end.y) ** 2);
      // multiple with 0.95 so the next closer point is at least 5% closer
      if (distance < bestPoint.distance * 0.95) {
        bestPoint = { start, end, distance };
      }
    }
  }
  return bestPoint;
}

const autoSelectAnchor = (
  startElem: NonNullable<positionType>,
  endElem: NonNullable<positionType>,
  startAnchor: Anchor,
  endAnchor: Anchor
) => {
  const startPoints = extractPointsFromAnchors(startElem, startAnchor);
  const endPoints = extractPointsFromAnchors(endElem, endAnchor);
  const bestPoint = findBestPoint(startPoints, endPoints);
  return { x1: bestPoint.start.x, y1: bestPoint.start.y, x2: bestPoint.end.x, y2: bestPoint.end.y };
};

export const useAutoSelectAnchor = ({ startAnchor = "auto", endAnchor = "auto" }: { startAnchor?: Anchor; endAnchor?: Anchor } = {}) => {
  const context = useXArrowContext();
  const { startElem, endElem } = context;
  if (!startElem || !endElem) return null;
  return () => autoSelectAnchor(startElem, endElem, startAnchor, endAnchor);
};
