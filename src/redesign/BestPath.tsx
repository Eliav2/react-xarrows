import React from "react";
import { getBestPath, pointsToCurves } from "./path";
import { IDir, IVector } from "./types";
import { usePositionProvider } from "./providers/PositionProvider";
import PointsProvider from "./providers/PointsProvider";
import PathProvider from "./providers/PathProvider";
import HeadProvider from "./providers/HeadProvider";

export type BestPathProps = {
  children?: React.ReactNode;
  pointToPath?: (points: IVector[]) => string;
  points?: IVector[];
  endDir?: IDir;
};

const BestPath = React.forwardRef(function BestPath(props: BestPathProps, forwardedRef) {
  const { children, pointToPath = pointsToCurves } = props;
  const { startPoint, endPoint } = usePositionProvider();
  const { points, endDir } = getBestPath(startPoint, endPoint);
  // console.log(endDir);
  return (
    <PointsProvider value={{ points }}>
      <PathProvider value={{ pointsToPath: pointToPath }}>
        <HeadProvider value={{ dir: endDir, pos: endPoint }}>
          {(children && React.isValidElement(children) && React.cloneElement(children, { ref: forwardedRef } as any)) || children}
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
