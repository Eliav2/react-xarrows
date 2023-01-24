import React, { useImperativeHandle, useLayoutEffect, useRef, useState } from "react";
import { IPoint } from "../types";
import { getLastValue } from "../utils";
import { useEnsureContext } from "../internal/hooks";
import { useXWrapperContext } from "../XWrapper";
import { RegisteredManager } from "../internal/RegisteredManager";

export interface PositionProviderProps {
  children: React.ReactNode;
  value: {
    // override the given position of the start element, optional
    startPoint?: IPoint | ((startPoint: IPoint) => IPoint);
    // override the given position of the end element, optional
    endPoint?: IPoint | ((startPoint: IPoint) => IPoint);
  };
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
  const prevVal = React.useContext(PositionProviderContext);

  const startPoint = getLastValue(value.startPoint, prevVal, "prevVal", (context) => context?.value.startPoint) ?? {
    x: 0,
    y: 0,
  };

  const endPoint = getLastValue(value.endPoint, prevVal, "prevVal", (context) => context?.value.endPoint) ?? {
    x: 0,
    y: 0,
  };

  const HeadsManager = useRef(new RegisteredManager<PositionChange>());
  console.log(HeadsManager.current.registered);

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
        value: {
          startPoint: { ...prevVal.value.startPoint, ...startPoint },
          endPoint: { ...prevVal.value.endPoint, ...endPoint },
        },
        prevVal,
        imperativeRef,
        __mounted: true,
        HeadsManager: HeadsManager.current,
      }}
    >
      {(children && React.isValidElement(children) && React.cloneElement(children, { ref } as any)) || children}
    </PositionProviderContext.Provider>
  );
});
export default PositionProvider;

export type PositionProviderImperativeProps = {
  sayHello: () => void;
};

type PositionChange = (pos: PositionProviderVal) => PositionProviderVal;
type PositionProviderContextProps = {
  value: PositionProviderVal;
  prevVal?: PositionProviderContextProps;
  imperativeRef?: React.Ref<any>;
  __mounted: boolean;
  HeadsManager: RegisteredManager<PositionChange> | null;
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
  const HeadId = useRef<number>(null as unknown as number); // the id would be received from the PositionProvider wrapper
  const mounted = useEnsureContext(positionProvider, "PositionProvider", "usePositionProviderRegister", { noWarn });
  // console.log(positionProvider, mounted);
  useLayoutEffect(() => {
    if (!mounted) return;
    HeadId.current = positionProvider.HeadsManager!.register(func);
    console.log("usePositionProviderRegister effect", HeadId.current);
    return () => {
      if (!mounted) return;
      console.log("usePositionProviderRegister exit effect", HeadId.current);
      positionProvider.HeadsManager!.unregister(HeadId.current);
    };
  }, []);
};
