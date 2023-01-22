import React from "react";
import { IVector } from "../types";
import { pointsToCurves } from "../path";

export type PathProps = {
  children?: React.ReactNode;
  value: { pointsToPath?: (points: IVector[]) => string };
};

const PathProvider = React.forwardRef(function PathProvider(props: PathProps, forwardedRef) {
  const {
    children,
    value: { pointsToPath = pointsToCurves },
  } = props;
  return (
    <PathProviderContext.Provider value={{ pointsToPath }}>
      {(children && React.isValidElement(children) && React.cloneElement(children, { ref: forwardedRef } as any)) || children}
    </PathProviderContext.Provider>
  );
});

type PathProviderContextProps = {
  pointsToPath: (points: IVector[]) => string;
};
const PathProviderContext = React.createContext<PathProviderContextProps>({ pointsToPath: () => "" });

export const usePathProvider = () => {
  return React.useContext(PathProviderContext);
};

export default PathProvider;
