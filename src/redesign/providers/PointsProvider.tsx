import React from "react";
import { IVector } from "../types";
import { PositionProviderVal, usePositionProvider } from "./PositionProvider";

export type PointsProps = {
  children?: React.ReactNode;
  value?: { points?: IVector[] };
};

const PointsProvider = React.forwardRef(function PointsProvider(props: PointsProps, forwardedRef) {
  // let { startPoint, endPoint } = usePositionProvider();
  // console.log("PointsProvider", startPoint, endPoint);
  // if (props.positionProviderVal) startPoint = props.positionProviderVal.startPoint;
  // if (props.positionProviderVal) endPoint = props.positionProviderVal.endPoint;
  const { children, value: { points = [] } = {} } = props;
  return (
    <PointsProviderContext.Provider value={{ points }}>
      {(children && React.isValidElement(children) && React.cloneElement(children, { ref: forwardedRef } as any)) || children}
    </PointsProviderContext.Provider>
  );
});

interface PointsProviderContextProps {
  points: IVector[];
}

const PointsProviderContext = React.createContext<PointsProviderContextProps>({ points: [] });

export const usePointsProvider = () => {
  let { startPoint, endPoint } = usePositionProvider();
  const pointsProvider = React.useContext(PointsProviderContext);
  pointsProvider.points[0] ||= startPoint;
  pointsProvider.points[1] ||= endPoint;
  // console.log("usePointsProvider", pointsProvider.points);
  return pointsProvider;
};

export default PointsProvider;
