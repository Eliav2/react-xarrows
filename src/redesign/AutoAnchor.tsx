import { useXArrow } from "./XArrow";
import { makeWriteable, RelativeSize, Writeable } from "shared/types";
import { OneOrMore } from "./types/typeUtils";
import { cloneDeepNoFunction, getRelativeSizeValue } from "shared/utils";
import { Direction, IRect, NamedDirection, parseIRect, parsePossiblyDirectedVector } from "./types/types";
import { toArray } from "./utils";
import { Dir, Vector } from "./path";
import React, { ForwardRefExoticComponent } from "react";
import PositionProvider, { usePositionProvider } from "./providers/PositionProvider";
import HeadProvider from "./providers/HeadProvider";
import PointsProvider from "./providers/PointsProvider";
import { childrenRenderer } from "./internal/Children";

export const xDirs = [
  { x: 1, y: 0 },
  { x: -1, y: 0 },
] as const;
export const yDirs = [
  { x: 0, y: 1 },
  { x: 0, y: -1 },
] as const;
export const xyDirs = [...xDirs, ...yDirs] as const;

const cStartAnchorsMap: { [key in AnchorName]: AnchorCustom } = {
  middle: { x: "50%", y: "50%", trailingDir: makeWriteable(xyDirs) },
  left: { x: "0%", y: "50%", trailingDir: makeWriteable(xDirs) },
  right: { x: "100%", y: "50%", trailingDir: makeWriteable(xDirs) },
  top: { x: "50%", y: "0%", trailingDir: makeWriteable(yDirs) },
  bottom: { x: "50%", y: "100%", trailingDir: makeWriteable(yDirs) },
};
const cEndAnchorsMap: { [key in AnchorName]: AnchorCustom } = {
  middle: { x: "50%", y: "50%", trailingDir: makeWriteable(xyDirs) },
  left: { x: "0%", y: "50%", trailingDir: makeWriteable(xDirs) },
  right: { x: "100%", y: "50%", trailingDir: makeWriteable(xDirs) },
  top: { x: "50%", y: "0%", trailingDir: makeWriteable(yDirs) },
  bottom: { x: "50%", y: "100%", trailingDir: makeWriteable(yDirs) },
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
  let bestPoint = {
    startPoint: startPoints[0],
    endPoint: endPoints[0],
    distance: Infinity,
  };
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

export const autoAnchor = (
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
    startAnchors: startPoints,
    endAnchors: endPoints,
  };
};

export type AutoAnchorProps = {
  children: React.ReactNode | ForwardRefExoticComponent<any>;
  startAnchor?: Anchor;
  endAnchor?: Anchor;
};

const AutoAnchor = React.forwardRef(function AutoAnchor(
  { startAnchor = "auto", endAnchor = "auto", children }: AutoAnchorProps,
  ref: React.ForwardedRef<SVGElement>
) {
  // console.log(usePositionProvider());
  // console.log("AutoAnchor");
  const context = useXArrow();
  let { startRect, endRect } = context;
  if (!startRect || !endRect) return null;
  const v = autoAnchor(startRect, endRect, { startAnchor, endAnchor });
  // const { points, endDir } = getBestPath(startPoint, endPoint, { zBreakPoint: breakPoint });
  // console.log(!!(children && React.isValidElement(children)));
  // const child = ;
  // console.log(child);

  // return (children && React.isValidElement(children) && React.cloneElement(children, { ref } as any)) || children;
  // console.log(v.endPoint);

  return (
    <AutoAnchorProvider value={v}>
      <PositionProvider value={v}>
        <PointsProvider>
          <HeadProvider value={{ pos: v.endPoint, dir: v.endPoint?.sub(v.startPoint).dir() }}>
            {/*{children}*/}
            {/*{(children && ref && React.isValidElement(children) && React.cloneElement(children, { ref })) || children}*/}
            {childrenRenderer(children, context, ref)}
          </HeadProvider>
        </PointsProvider>
      </PositionProvider>
    </AutoAnchorProvider>
  );
});
export default AutoAnchor;

interface AutoAnchorProviderProps {
  children: React.ReactNode;
  value: {
    startPoint: Vector<Dir[]>;
    endPoint: Vector<Dir[]>;
    startAnchors: Required<AnchorCustom>[];
    endAnchors: Required<AnchorCustom>[];
  } | null;
}

const AutoAnchorProvider = React.forwardRef(function AutoAnchorProvider(
  { children, value }: AutoAnchorProviderProps,
  ref: React.ForwardedRef<any>
) {
  return <AutoAnchorProviderContext.Provider value={value}>{childrenRenderer(children, value, ref)}</AutoAnchorProviderContext.Provider>;
});

const AutoAnchorProviderContext = React.createContext<AutoAnchorProviderProps["value"] | null>(null);

export const useAutoAnchorProvider = () => {
  const context = React.useContext(AutoAnchorProviderContext);
  if (context === undefined) {
    throw new Error("useAutoAnchorProvider must be used within a AutoAnchor");
  }
  return context;
};
