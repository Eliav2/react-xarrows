import { useXArrow } from "./XArrow";
import { RelativeSize } from "shared/types";
import { OneOrMore } from "./types/typeUtils";
import { getRelativeSizeValue } from "shared/utils";
import { Direction, IRect, NamedDirection, parseIRect, parsePossiblyDirectedVector } from "./types/types";
import { toArray } from "./utils";
import { Dir, getBestPath, Vector } from "./path";
import React from "react";
import { useEnsureContext } from "./internal/hooks";
import PositionProvider from "./PositionProvider";

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

function extractPointsFromAnchors(elemPos: IRect, anchor: Anchor, defaultAnchors: { [anchorName: string]: AnchorCustom } = {}) {
  const pElemPos = parseIRect(elemPos);
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
      x: getRelativeSizeValue(an.x ?? "50%", pElemPos.width) + pElemPos.left,
      y: getRelativeSizeValue(an.y ?? "50%", pElemPos.height) + pElemPos.top,
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
  let bestPoint = { startPoint: startPoints[0], endPoint: endPoints[0], distance: Infinity };
  for (const startPoint of startPoints) {
    for (const endPoint of endPoints) {
      const distance = Math.sqrt((startPoint.x - endPoint.x) ** 2 + (startPoint.y - endPoint.y) ** 2);
      // multiple with 0.9 so the next closer point is at least 10% closer
      if (distance < bestPoint.distance * 0.9) {
        bestPoint = { startPoint, endPoint, distance };
      }
    }
  }
  return bestPoint;
}

// function findBestEdgeDirections(startPoint: PossiblyDirectedVector, endPoint: PossiblyDirectedVector) {
//   const a = getBestPath( startPoint, endPoint );
//   // const startVector = parsePossiblyDirectedVector(startPoint);
//   // const endVector = parsePossiblyDirectedVector(endPoint);
//   // const startDirArr = toArray(startDir).map((dir)=> new Dir(parseDirection(dir)));
//   // const endDirArr = toArray(endDir).map((dir)=> new Dir(parseDirection(dir)));
//   //
// }

export const autoSelectAnchor = (
  startRect: IRect,
  endRect: IRect,
  {
    startAnchor = "auto",
    endAnchor = "auto",
  }: {
    startAnchor?: Anchor;
    endAnchor?: Anchor;
  } = {}
) => {
  const startPoints = extractPointsFromAnchors(startRect, startAnchor, cStartAnchorsMap);
  const endPoints = extractPointsFromAnchors(endRect, endAnchor, cEndAnchorsMap);
  const { startPoint, endPoint } = findBestPoint(startPoints, endPoints);
  return {
    startPoint: new Vector(parsePossiblyDirectedVector(startPoint)),
    endPoint: new Vector(parsePossiblyDirectedVector(endPoint)),
  };
};

export type AutoSelectAnchorProps = {
  children: React.ReactNode;
  startAnchor?: Anchor;
  endAnchor?: Anchor;
};

const AutoSelectAnchor = ({ startAnchor = "auto", endAnchor = "auto", children }: AutoSelectAnchorProps) => {
  const context = useXArrow();
  let { startRect, endRect } = context;
  if (!startRect || !endRect) return null;
  const v = autoSelectAnchor(startRect, endRect, { startAnchor, endAnchor });
  // const { points, endDir } = getBestPath(startPoint, endPoint, { zBreakPoint: breakPoint });

  return <PositionProvider value={v}>{children}</PositionProvider>;
};
export default AutoSelectAnchor;
