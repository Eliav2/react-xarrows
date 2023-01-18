import React from "react";
import { IPoint } from "./types";

interface PositionProviderProps {
  children: React.ReactNode;
  value: {
    // override the given position of the start element, optional
    startPoint?: IPoint;
    // override the given position of the end element, optional
    endPoint?: IPoint;
  };
}

const PositionProvider = ({ children, value }: PositionProviderProps) => {
  return <PositionProviderContext.Provider value={value}>{children}</PositionProviderContext.Provider>;
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
