import React, { useLayoutEffect, useRef } from "react";
import { PositionProviderImperativeProps, PositionProviderVal, usePositionProvider } from "./PositionProvider";
import { getLastValue } from "../utils";
import { IDir, IPoint } from "../types";
import { RegisteredManager, useRegisteredManager } from "../internal/RegisteredManager";
import { cloneDeepNoFunction } from "shared/utils";
import { useEnsureContext } from "../internal/hooks";
import usePassChildrenRef from "shared/hooks/usePassChildrenRef";
import Children, { childrenRenderer } from "../internal/Children";

type HeadProviderVal = {
  dir?: IDir;
  pos?: IPoint;
  color?: string;
  rotate?: number;
  size?: number;
};

export interface HeadProviderProps {
  children: React.ReactNode;
  value: HeadProviderVal | ((prevVal: HeadProviderVal) => HeadProviderVal);
  // locationProvider?: React.RefObject<PositionProviderImperativeProps>; // can be used to offset the target location
  // HeadsManager?: RegisteredManager<HeadProviderValChange> | null;
}

const HeadProvider = React.forwardRef(function HeadProvider({ children, value }: HeadProviderProps, forwardRef) {
  const prevVal = React.useContext(HeadProviderContext);
  // const { endPoint } = usePositionProvider();
  const val = getLastValue(value, prevVal, "prevVal", (context) => context?.value);

  const HeadsManager = useRef(new RegisteredManager<HeadProviderValChange>());
  // clone only the startPoint and endPoint, and not the whole value because of performance concerns
  let alteredVal = { ...val };
  // alteredVal.startPoint = cloneDeepNoFunction(val.startPoint);
  // alteredVal.endPoint = cloneDeepNoFunction(val.endPoint);
  // console.log(val);
  // todo: consider using immer instead of cloneDeepNoFunction
  Object.values(HeadsManager.current.registered).forEach((change) => {
    alteredVal = change(alteredVal);
  });
  const finalVal = { ...prevVal.value, ...alteredVal };
  // const childRef = usePassChildrenRef(children);
  // console.log("HeadProvider", childRef, forwardRef);
  // console.log("HeadProvider", children, React.isValidElement(children));
  return (
    <HeadProviderContext.Provider
      value={{
        value: finalVal,
        prevVal,
        __mounted: true,
        HeadsManager: HeadsManager.current,
      }}
    >
      {childrenRenderer(children, alteredVal, forwardRef)}
      {/*{(children && React.isValidElement(children) && React.cloneElement(children, { ref: forwardRef } as any)) || children}*/}
      {/*<Children>*/}
      {/*{children}*/}
      {/*</Children>*/}
    </HeadProviderContext.Provider>
  );
});
export default HeadProvider;

type HeadProviderValChange = (pos: HeadProviderVal) => HeadProviderVal;
type HeadProviderContextProps = {
  value: { dir?: IDir; pos?: IPoint; color?: string; rotate?: number; size?: number };
  prevVal: HeadProviderContextProps | undefined;
  __mounted: boolean;
  HeadsManager: RegisteredManager<HeadProviderValChange> | null;
};
const HeadProviderContext = React.createContext<HeadProviderContextProps>({
  value: {},
  prevVal: undefined,
  __mounted: false,
  HeadsManager: null,
});
export const useHeadProvider = () => {
  const headProvider = React.useContext(HeadProviderContext);
  const posProvider = usePositionProvider();
  // console.log("posProvider", posProvider);
  headProvider.value.pos ??= posProvider.endPoint;
  return headProvider?.value;
};

export const useHeadProviderRegister = (func: (pos: HeadProviderVal) => HeadProviderVal, noWarn = false) => {
  const headProvider = React.useContext(HeadProviderContext);
  const mounted = useEnsureContext(headProvider, "HeadProvider", "useHeadProviderRegister", { noWarn });
  const HeadId = useRegisteredManager(headProvider.HeadsManager, mounted, func);
  return HeadId;
};
