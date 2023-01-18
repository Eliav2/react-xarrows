import React from "react";
import { IPoint } from "./types";

interface PositionProviderProps {
  children: React.ReactNode;
  value: {
    // override the given position of the start element, optional
    startPoint?: IPoint | ((startPoint: IPoint) => IPoint);
    // override the given position of the end element, optional
    endPoint?: IPoint | ((startPoint: IPoint) => IPoint);
  };
}

/**
 * This component is used to provide the start and end points of the arrow.
 *
 * It is used internally by XArrow and other internal components,
 * but can be used by the user to override the start and end points of the arrow.
 *
 * the start and end points can be provided as absolute positions (x,y) or as a function that receives the previous
 * position and returns the new position.
 */
const PositionProvider = ({ children, value }: PositionProviderProps) => {
  let pos = value;
  const prevPos = usePositionProvider();
  let startPoint = { x: 0, y: 0 },
    endPoint = { x: 0, y: 0 };
  if (typeof prevPos.startPoint == "object") startPoint = prevPos.startPoint;
  if (typeof prevPos.endPoint == "object") endPoint = prevPos.endPoint;

  //check if start point is a function
  if (typeof pos.startPoint === "function") {
    if (prevPos.startPoint) {
      startPoint = pos.startPoint(prevPos.startPoint);
    }
  } else if (pos.startPoint) startPoint = pos.startPoint;
  //check if end point is a function
  if (typeof pos.endPoint === "function") {
    if (prevPos.endPoint) {
      endPoint = pos.endPoint(prevPos.endPoint);
    }
  } else if (pos.endPoint) endPoint = pos.endPoint;
  return <PositionProviderContext.Provider value={{ startPoint, endPoint }}>{children}</PositionProviderContext.Provider>;
};
export default PositionProvider;

type PositionProviderContextProps = {
  startPoint?: IPoint;
  endPoint?: IPoint;
};

const PositionProviderContext = React.createContext<PositionProviderContextProps>({});
export const usePositionProvider = () => {
  const val = React.useContext(PositionProviderContext);
  return val;
};
