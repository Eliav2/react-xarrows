import React from "react";
import { Dir, getBestPath, pointsToCurves, Vector } from "./path";
import { IDir, IVector } from "./types";
import { PositionProvider, usePositionProvider } from "./providers/PositionProvider";
import PointsProvider from "./providers/PointsProvider";
import PathProvider from "./providers/PathProvider";
import HeadProvider, { useHeadProvider } from "./providers/HeadProvider";
import { childrenRenderer } from "./internal/Children";
import { xyDirs } from "./AutoAnchor";
import { makeWriteable, makeWriteableDeep } from "shared/types";

export type BestPathProps = {
  children?: React.ReactNode;
  pointToPath?: (points: IVector[]) => string;
  points?: IVector[];
  endDir?: IDir;
};

const BestPath = React.forwardRef(function BestPath(props: BestPathProps, forwardedRef) {
  // console.log("BestPath");
  const { children, pointToPath = pointsToCurves } = props;
  const { startPoint, endPoint } = usePositionProvider();
  const { pos: HeadPos } = useHeadProvider();
  if (!startPoint || !endPoint) return null;
  const { points, endDir } = getBestPath(startPoint, endPoint, { endDirPoint: HeadPos });
  points[points.length - 1] = endPoint;
  // console.log("endDir", endDir);
  return (
    // <PositionProvider value={{ startPoint: points[0], endPoint: points.at(-1) }}>
    <PointsProvider value={{ points }}>
      <PathProvider value={{ pointsToPath: pointToPath }}>
        <HeadProvider value={{ dir: endDir }}>{childrenRenderer(children, { points, endDir }, forwardedRef)}</HeadProvider>
      </PathProvider>
    </PointsProvider>
    // </PositionProvider>
  );
});

const BestPathContext = React.createContext<BestPathProps>({ pointToPath: pointsToCurves });

export const useBestPath = () => {
  return React.useContext(BestPathContext);
};

export default BestPath;
