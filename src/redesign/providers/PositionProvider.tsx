import React, { useImperativeHandle, useState } from "react";
import { IPoint } from "../types";
import { getLastValue } from "../utils";

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

  // const [startPoint, setStartPoint] = useState(
  //   getLastValue(value.startPoint, prevVal, "prevVal", (context) => context?.value.startPoint) ?? {
  //     x: 0,
  //     y: 0,
  //   }
  // );

  const startPoint = getLastValue(value.startPoint, prevVal, "prevVal", (context) => context?.value.startPoint) ?? {
    x: 0,
    y: 0,
  };

  const endPoint = getLastValue(value.endPoint, prevVal, "prevVal", (context) => context?.value.endPoint) ?? {
    x: 0,
    y: 0,
  };

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

type PositionProviderContextProps = {
  value: PositionProviderVal;
  prevVal?: PositionProviderContextProps;
  imperativeRef?: React.Ref<any>;
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
});

export const usePositionProvider = () => {
  const val = React.useContext(PositionProviderContext);
  return val?.value;
};
