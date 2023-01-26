import React, { useImperativeHandle, useLayoutEffect, useRef } from "react";
import { IPoint } from "../types";
import { getLastValue } from "../utils";
import { useEnsureContext } from "../internal/hooks";
import { RegisteredManager, useRegisteredManager } from "../internal/RegisteredManager";
import { cloneDeepNoFunction } from "shared/utils";
import { childrenRenderer } from "../internal/Children";

type PositionProviderValueProp = {
  // override the given position of the start element, optional
  startPoint?: IPoint | ((startPoint: IPoint) => IPoint);
  // override the given position of the end element, optional
  endPoint?: IPoint | ((startPoint: IPoint) => IPoint);
};

export interface PositionProviderProps {
  children: React.ReactNode;
  value: PositionProviderValueProp | ((prevVal: PositionProviderValueProp) => PositionProviderValueProp);
  imperativeRef?: React.Ref<any>;
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
const PositionProvider = React.forwardRef(function PositionProvider(
  { children, value = {}, imperativeRef }: PositionProviderProps,
  ref: React.ForwardedRef<any>
) {
  // console.log("PositionProvider");
  const prevVal = React.useContext(PositionProviderContext);

  const val = getLastValue(value, prevVal, "prevVal", (context) => context?.value);

  const HeadsManager = useRef(new RegisteredManager<PositionProviderValChange>());
  // console.log(HeadsManager.current.registered);
  // clone only the startPoint and endPoint, and not the whole value because of performance concerns
  let alteredVal = { ...val };
  alteredVal.startPoint = cloneDeepNoFunction(val.startPoint);
  alteredVal.endPoint = cloneDeepNoFunction(val.endPoint);
  Object.values(HeadsManager.current.registered).forEach((change) => {
    alteredVal = change(alteredVal);
  });

  useImperativeHandle<any, PositionProviderImperativeProps>(
    imperativeRef,
    () => {
      return { sayHello: () => console.log("hello") };
    },
    []
  );

  return (
    <PositionProviderContext.Provider
      value={{
        value: { ...prevVal.value, ...alteredVal },
        prevVal,
        imperativeRef,
        __mounted: true,
        HeadsManager: HeadsManager.current,
      }}
    >
      {childrenRenderer(children, alteredVal, ref)}
      {/*{(children && React.isValidElement(children) && React.cloneElement(children, { ref } as any)) || children}*/}
    </PositionProviderContext.Provider>
  );
});
export default PositionProvider;

export type PositionProviderImperativeProps = {
  sayHello: () => void;
};

type PositionProviderValChange = (pos: PositionProviderVal) => PositionProviderVal;
type PositionProviderContextProps = {
  value: PositionProviderVal;
  prevVal?: PositionProviderContextProps;
  imperativeRef?: React.Ref<any>;
  __mounted: boolean;
  HeadsManager: RegisteredManager<PositionProviderValChange> | null;
};

type PosPoint = IPoint | ((startPoint: IPoint) => PosPoint);
export type PositionProviderVal = {
  startPoint: IPoint;
  endPoint: IPoint;
};

const PositionProviderContext = React.createContext<PositionProviderContextProps>({
  value: {
    startPoint: { x: 0, y: 0 },
    endPoint: { x: 0, y: 0 },
  },
  prevVal: undefined,
  imperativeRef: null,
  __mounted: false,
  HeadsManager: null,
});

export const usePositionProvider = () => {
  const val = React.useContext(PositionProviderContext);
  return val?.value;
};

export const usePositionProviderRegister = (func: (pos: PositionProviderVal) => PositionProviderVal, noWarn = false) => {
  const positionProvider = React.useContext(PositionProviderContext);
  const mounted = useEnsureContext(positionProvider, "PositionProvider", "usePositionProviderRegister", { noWarn });
  // const HeadId = useRef<number>(null as unknown as number); // the id would be received from the PositionProvider wrapper
  // useLayoutEffect(() => {
  //   if (!mounted) return;
  //   HeadId.current = positionProvider.HeadsManager!.register(func);
  //   return () => {
  //     if (!mounted) return;
  //     positionProvider.HeadsManager!.unregister(HeadId.current);
  //   };
  // }, []);
  const HeadId = useRegisteredManager(positionProvider.HeadsManager, mounted, func);
  return HeadId;
};
