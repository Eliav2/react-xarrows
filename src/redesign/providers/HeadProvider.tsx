import React, { useLayoutEffect, useRef } from "react";
import { PositionProviderImperativeProps, PositionProviderVal, usePositionProvider } from "./PositionProvider";
import { getLastValue } from "../utils";
import { IDir, IPoint } from "../types";
import { RegisteredManager, useRegisteredManager } from "../internal/RegisteredManager";
import { cloneDeepNoFunction } from "shared/utils";
import { useEnsureContext } from "../internal/hooks";
import usePassChildrenRef from "shared/hooks/usePassChildrenRef";
import Children, { childrenRenderer } from "../internal/Children";
import { Dir, Vector } from "../path";
import produce from "immer";

type HeadProviderVal = {
  dir?: Dir;
  pos?: Vector;
  color?: string;
  rotate?: number;
  size?: number;
};

export interface HeadProviderProps {
  children: React.ReactNode;
  value: HeadProviderVal | ((prevVal: HeadProviderVal) => HeadProviderVal);
  // locationProvider?: React.RefObject<PositionProviderImperativeProps>; // can be used to offset the target location
}

const HeadProvider = React.forwardRef(function HeadProvider({ children, value }: HeadProviderProps, forwardRef) {
  const prevVal = useInternalHeadProvider();
  const prevValWithDefault = prevVal.value;
  let val = { ...getLastValue(value, prevVal, "prevVal", (context) => context?.value), ...prevValWithDefault };
  if (val.pos) val.pos = new Vector(val.pos);
  if (val.dir) val.dir = new Dir(val.dir);

  // alteredVal.startPoint = cloneDeepNoFunction(val.startPoint);
  // alteredVal.endPoint = cloneDeepNoFunction(val.endPoint);
  // const posProvider = usePositionProvider();
  // console.log(posProvider);
  // console.log(val);
  // console.log(value.dir, val.dir);
  // Object.values(HeadsManager.current.registered).forEach((change) => {
  //   alteredVal = change(alteredVal as HeadProviderVal);
  // });
  const HeadsManager = useRef(new RegisteredManager<HeadProviderValChange>());
  console.log(HeadsManager.current.registered);
  // use immer to update the value with all registered functions
  let alteredVal = { ...val };
  alteredVal = produce(alteredVal, (draft) => {
    Object.values(HeadsManager.current.registered).forEach((change) => {
      // console.log("before change", alteredVal);
      alteredVal = change(draft as HeadProviderVal);
      // console.log("After change", alteredVal.dir);
    });
  });

  // console.log(alteredVal.dir.eq(value.dir));

  const finalVal = { ...prevVal.value, ...alteredVal };
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

const useInternalHeadProvider = () => {
  const headProvider = React.useContext(HeadProviderContext);
  const posProvider = usePositionProvider();
  const headProviderCopy = produce(headProvider, (draftState) => {
    draftState.value.pos ??= posProvider.endPoint;
    if (posProvider.endPoint && posProvider.startPoint) draftState.value.dir ??= posProvider.endPoint.sub(posProvider.startPoint).dir();
  });
  return headProviderCopy;
};

export const useHeadProvider = () => {
  const headProvider = useInternalHeadProvider();
  return headProvider?.value;
};

export const useHeadProviderRegister = (func: (pos: HeadProviderVal) => HeadProviderVal, noWarn = false) => {
  const headProvider = React.useContext(HeadProviderContext);
  const mounted = useEnsureContext(headProvider, "HeadProvider", "useHeadProviderRegister", { noWarn });
  const HeadId = useRegisteredManager(headProvider.HeadsManager, mounted, func);
  return HeadId;
};
