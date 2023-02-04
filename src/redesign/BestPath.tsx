import React from "react";
import { Dir, getBestPath, pointsToCurves, Vector } from "./path";
import { IDir, IVector } from "./types";
import { usePositionProvider } from "./providers/PositionProvider";
import PointsProvider from "./providers/PointsProvider";
import PathProvider from "./providers/PathProvider";
import HeadProvider from "./providers/HeadProvider";
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
  const { children, pointToPath = pointsToCurves } = props;
  const { startPoint, endPoint } = usePositionProvider();
  if (!startPoint || !endPoint) return null;
  // const { points, endDir } = getBestPath({ ...startPoint, trailingDir: xyDirs }, { ...endPoint, trailingDir: xyDirs });
  const { points, endDir } = getBestPath(startPoint, endPoint);
  // console.log(endDir);
  return (
    <PointsProvider value={{ points }}>
      <PathProvider value={{ pointsToPath: pointToPath }}>
        <HeadProvider value={{ dir: endDir }}>
          {/*{(children && React.isValidElement(children) && React.cloneElement(children, { ref: forwardedRef } as any)) || children}*/}
          {childrenRenderer(children, { points, endDir }, forwardedRef)}
        </HeadProvider>
      </PathProvider>
    </PointsProvider>
  );
});

const BestPathContext = React.createContext<BestPathProps>({ pointToPath: pointsToCurves });

export const useBestPath = () => {
  return React.useContext(BestPathContext);
};

export default BestPath;
