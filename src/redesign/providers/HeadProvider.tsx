import React, { useEffect } from "react";
import { PositionProviderImperativeProps, usePositionProvider } from "./PositionProvider";
import { getLastValue } from "../utils";
import { IDir, IPoint } from "../types";

type HeadProviderValueProp = {
  dir?: IDir;
  pos?: IPoint;
  color?: string;
  rotate?: number;
  size?: number;
};

export interface HeadProviderProps {
  children: React.ReactNode;
  value: HeadProviderValueProp | ((prevVal: HeadProviderValueProp) => HeadProviderValueProp);
  // value: {
  //   // override the given position of the start element, optional
  //   dir?: IDir | ((startDir: IDir) => IDir);
  //   pos?: IPoint | ((pos: IPoint) => IPoint);
  //   color?: string;
  //   rotate?: number | ((rotate: number) => number);
  //   size?: number | ((size: number) => number);
  // };
  locationProvider?: React.RefObject<PositionProviderImperativeProps>; // can be used to offset the target location
}

const HeadProvider = React.forwardRef(function HeadProvider({ children, value, locationProvider }: HeadProviderProps, forwardRef) {
  const prevVal = React.useContext(HeadProviderContext);
  // const { endPoint } = usePositionProvider();
  const val = getLastValue(value, prevVal, "prevVal", (context) => context?.value);

  return (
    <HeadProviderContext.Provider value={{ value: { ...prevVal.value, ...val }, prevVal, __mounted: true }}>
      {(children && React.isValidElement(children) && React.cloneElement(children, { ref: forwardRef } as any)) || children}
    </HeadProviderContext.Provider>
  );
});
export default HeadProvider;

type HeadProviderContextProps = {
  value: { dir?: IDir; pos?: IPoint; color?: string; rotate?: number; size?: number };
  prevVal: HeadProviderContextProps | undefined;
  __mounted: boolean;
};
const HeadProviderContext = React.createContext<HeadProviderContextProps>({
  value: {},
  prevVal: undefined,
  __mounted: false,
});
export const useHeadProvider = () => {
  const headProvider = React.useContext(HeadProviderContext);
  const posProvider = usePositionProvider();
  headProvider.value.pos ??= posProvider.endPoint;
  return headProvider?.value;
};
