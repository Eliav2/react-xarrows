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
  // console.log("val", val);
  // val.pos ??= endPoint;
  // const dir = getLastValue(value.dir, prevVal, "prevVal", (context) => context?.value.dir) ?? { x: 0, y: 0 };
  // const pos = getLastValue(value.pos, prevVal, "prevVal", (context) => context?.value.pos) ?? endPoint;
  // const color = getLastValue(value.color, prevVal, "prevVal", (context) => context?.value.color) ?? "cornflowerblue";
  // const rotate = getLastValue(value.rotate, prevVal, "prevVal", (context) => context?.value.rotate) ?? 0;
  // const size = getLastValue(value.size, prevVal, "prevVal", (context) => context?.value.size) ?? 30;

  useEffect(() => {
    // console.log("HeadProvider useEffect", locationProvider);
  }, []);

  return (
    <HeadProviderContext.Provider value={{ value: val, prevVal }}>
      {(children && React.isValidElement(children) && React.cloneElement(children, { ref: forwardRef } as any)) || children}
    </HeadProviderContext.Provider>
  );
});
export default HeadProvider;

type HeadProviderContextProps = {
  value: { dir?: IDir; pos?: IPoint; color?: string; rotate?: number; size?: number };
  prevVal: HeadProviderContextProps | undefined;
};
const HeadProviderContext = React.createContext<HeadProviderContextProps>({
  value: {},
  prevVal: undefined,
});
export const useHeadProvider = () => {
  const headProvider = React.useContext(HeadProviderContext);
  const posProvider = usePositionProvider();
  headProvider.value.pos ??= posProvider.endPoint;
  return headProvider?.value;
};
