import React, { useLayoutEffect, useRef } from "react";
import { PositionProviderImperativeProps, PositionProviderVal, usePositionProvider } from "./PositionProvider";
import { aggregateValues } from "../utils";
import { IDir, IPoint } from "../types";
import { RegisteredManager, useRegisteredManager } from "../internal/RegisteredManager";
import { cloneDeepNoFunction } from "shared/utils";
import { useEnsureContext } from "../internal/hooks";
import usePassChildrenRef from "shared/hooks/usePassChildrenRef";
import Children, { childrenRenderer } from "../internal/Children";
import { Dir, Vector } from "../path";
import produce from "immer";

interface HeadProviderVal {
  dir?: IDir;
  pos?: IPoint;
  color?: string;
  rotate?: number;
  size?: number;
}

interface HeadProviderValPrepared extends HeadProviderVal {
  dir: Dir;
  pos: Vector;
}

export interface HeadProviderProps {
  children: React.ReactNode;
  value: HeadProviderVal | HeadProviderValChange;
  // locationProvider?: React.RefObject<PositionProviderImperativeProps>; // can be used to offset the target location
}

const HeadProvider = React.forwardRef(function HeadProvider({ children, value }: HeadProviderProps, forwardRef) {
  // console.log("HeadProvider");
  const HeadsManager = useRef(new RegisteredManager<HeadProviderValChangePrepared>());
  // let prevValWithDefault = useHeadProvider();
  // console.log(prevValWithDefault.value);
  const prevVal = React.useContext(HeadProviderContext);
  // console.log(Object.keys(HeadsManager.current.registered).length);
  // const finalPrevVal =
  //   typeof value === "function" || Object.keys(HeadsManager.current.registered).length > 0 ? prevValWithDefault : prevVal;
  // const finalPrevVal = prevValWithDefault;
  // console.log(finalPrevVal);
  // let val = { ...prevVal.value, ...aggregateValues(value, prevVal, "prevVal", (context) => context?.value) };
  let val = aggregateValues(value, prevVal, "prevVal", (context) => context?.value);

  val = produce(val, (draft) => {
    if (draft.pos) draft.pos = new Vector(draft.pos);
    if (draft.dir) draft.dir = new Dir(draft.dir);
  });

  // use immer to update the value with all registered functions
  let alteredVal = { ...val };
  alteredVal = produce(alteredVal, (draft) => {
    Object.values(HeadsManager.current.registered).forEach((change) => {
      alteredVal = change(draft as any);
    });
  });
  // console.log(val, alteredVal);

  const finalVal = alteredVal;
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
    </HeadProviderContext.Provider>
  );
});
export default HeadProvider;

type HeadProviderValChange = (pos: HeadProviderVal) => HeadProviderVal;
type HeadProviderValChangePrepared = (pos: HeadProviderValPrepared) => HeadProviderValPrepared;
type HeadProviderContextProps = {
  value: { dir?: Dir; pos?: Vector; color?: string; rotate?: number; size?: number };
  prevVal: HeadProviderContextProps | undefined;
  __mounted: boolean;
  HeadsManager: RegisteredManager<HeadProviderValChangePrepared> | null;
};

const HeadProviderContext = React.createContext<HeadProviderContextProps>({
  value: {},
  prevVal: undefined,
  __mounted: false,
  HeadsManager: null,
});

// const useInternalHeadProvider = () => {
//   const headProvider = React.useContext(HeadProviderContext);
//   return headProvider;
//
//   // const posProvider = usePositionProvider();
//   // const headProviderCopy = produce(headProvider, (draftState) => {
//   //   if (posProvider.endPoint) {
//   //     draftState.value.pos ??= new Vector(posProvider.endPoint);
//   //     if (posProvider.startPoint) draftState.value.dir ??= posProvider.endPoint.sub(posProvider.startPoint).dir();
//   //   }
//   // });
//   // console.log(headProviderCopy.value.pos?.y);
//   // return headProviderCopy;
// };

export const useHeadProvider = () => {
  // const headProvider = useInternalHeadProvider();
  const headProvider = React.useContext(HeadProviderContext);

  return headProvider?.value;
};

export const useHeadProviderRegister = (func: HeadProviderValChangePrepared, noWarn = false) => {
  const headProvider = React.useContext(HeadProviderContext);
  const mounted = useEnsureContext(headProvider, "HeadProvider", "useHeadProviderRegister", { noWarn });
  // const HeadId = useRegisteredManager(headProvider.HeadsManager, mounted, func);
  const HeadId = useRegisteredManager(headProvider.HeadsManager, func);
  return HeadId;
};
