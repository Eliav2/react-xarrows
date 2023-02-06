import React from "react";
import { createProvider } from "./createProvider";
import { IPoint } from "../types";
import { Vector } from "../path";

interface PositionProviderVal {
  startPoint?: IPoint;
  endPoint?: IPoint;
}

interface PositionProviderValPrepared {
  startVector?: Vector;
  endPoint?: Vector;
}

const {
  /**
   * This component is used to provide the start and end points of the arrow.
   *
   * It is used internally by XArrow and other internal components,
   * but can be used by the user to override the start and end points of the arrow.
   *
   * the start and end points can be provided as absolute positions (x,y) or as a function that receives the previous
   * position and returns the new position.
   */
  Provider: PositionProvider,

  /**
   * This hook is used to get the start and end points of the arrow.
   */
  useProvider: usePositionProvider,

  /**
   * This hook is used to register a function that will be called in order to change the start and end points of the arrow.
   */
  useProviderRegister: usePositionProviderRegister,
} = createProvider<PositionProviderVal, PositionProviderValPrepared>("PositionProvider", {
  prepareValue: (val) => {
    if (val.startPoint) val.startPoint = new Vector(val.startPoint);
    if (val.endPoint) val.endPoint = new Vector(val.endPoint);
    return val as PositionProviderValPrepared;
  },
  debug: true,
});

export { PositionProvider, usePositionProvider, usePositionProviderRegister };
export default PositionProvider;

// type PositionProviderValueProp = {
//   startPoint?: IPoint;
//   endPoint?: IPoint;
// };
//
// export interface PositionProviderProps {
//   children: React.ReactNode;
//   value?: PositionProviderValueProp | ((prevVal: PositionProviderVal) => PositionProviderVal);
// }
//
// /**
//  * This component is used to provide the start and end points of the arrow.
//  *
//  * It is used internally by XArrow and other internal components,
//  * but can be used by the user to override the start and end points of the arrow.
//  *
//  * the start and end points can be provided as absolute positions (x,y) or as a function that receives the previous
//  * position and returns the new position.
//  */
// const PositionProvider = React.forwardRef(function PositionProvider(
//   { children, value = {} }: PositionProviderProps,
//   ref: React.ForwardedRef<any>
// ) {
//   // console.log("PositionProvider");
//   const prevContext = React.useContext(PositionProviderContext);
//
//   const val = aggregateValues(value, prevContext, "prevVal", (context) => context?.value);
//   // const val = produce(value, (draft) => {
//   //   aggregateValues(draft, prevContext, "prevVal", (context) => context?.value);
//   // }) as PositionProviderVal;
//   // console.log("val", val);
//   // console.log("val", prevContext.value, val);
//
//   const HeadsManager = useRef(new RegisteredManager<PositionProviderValChange>());
//   // console.log("registered functions", HeadsManager.current.registered);
//
//   // clone only the startPoint and endPoint, and not the whole value because of performance concerns
//   let alteredVal = { ...prevContext.value, ...val };
//   if (val.startPoint) alteredVal.startPoint = new Vector(val.startPoint);
//   if (val.endPoint) alteredVal.endPoint = new Vector(val.endPoint);
//   // console.log("before change", val.endPoint?.x);
//
//   alteredVal = produce(alteredVal, (draft) => {
//     Object.values(HeadsManager.current.registered).forEach((change) => {
//       // console.log("executing change", draft.endPoint?.x, draft.endPoint?.y);
//       alteredVal = change(draft);
//       // console.log("after executing change", draft.endPoint?.x, draft.endPoint?.y);
//     });
//   });
//
//   // console.log("after change", HeadsManager.current.registered, alteredVal.endPoint?.x);
//   // console.log(val, alteredVal);
//   // Object.values(HeadsManager.current.registered).forEach((change) => {
//   //   alteredVal = change(alteredVal);
//   // });
//
//   // useImperativeHandle<any, PositionProviderImperativeProps>(
//   //   imperativeRef,
//   //   () => {
//   //     return { sayHello: () => console.log("hello") };
//   //   },
//   //   []
//   // );
//
//   const finalVal = alteredVal;
//   // console.log("after change", finalVal.endPoint?.x);
//   // console.log(finalVal.endPoint?.x);
//   // console.log(finalVal);
//
//   // console.log("PositionProvider END");
//
//   return (
//     <PositionProviderContext.Provider
//       value={{
//         value: finalVal,
//         prevVal: prevContext,
//         __mounted: true,
//         HeadsManager: HeadsManager.current,
//       }}
//     >
//       {childrenRenderer(children, alteredVal, ref)}
//       {/*{(children && React.isValidElement(children) && React.cloneElement(children, { ref } as any)) || children}*/}
//     </PositionProviderContext.Provider>
//   );
// });
// export default PositionProvider;
//
// export type PositionProviderImperativeProps = {
//   sayHello: () => void;
// };
//
// type PositionProviderValChange = (pos: PositionProviderVal) => PositionProviderVal;
// type PositionProviderContextProps = {
//   value: PositionProviderVal;
//   prevVal?: PositionProviderContextProps;
//   imperativeRef?: React.Ref<any>;
//   __mounted: boolean;
//   HeadsManager: RegisteredManager<PositionProviderValChange> | null;
// };
//
// type PosPoint = IPoint | ((startPoint: IPoint) => PosPoint);
// export type PositionProviderVal = {
//   startPoint: Vector | undefined;
//   endPoint: Vector | undefined;
// };
//
// const PositionProviderContext = React.createContext<PositionProviderContextProps>({
//   value: {
//     startPoint: undefined,
//     endPoint: undefined,
//     // startPoint: new Vector({ x: 0, y: 0 }),
//     // endPoint: new Vector({ x: 0, y: 0 }),
//   },
//   prevVal: undefined,
//   imperativeRef: null,
//   __mounted: false,
//   HeadsManager: null,
// });
//
// export const usePositionProvider = () => {
//   const val = React.useContext(PositionProviderContext);
//   // console.log("usePositionProvider", val.value.endPoint?.x);
//   return val?.value;
// };
//
// export const usePositionProviderRegister = (
//   func: (pos: PositionProviderVal) => PositionProviderVal,
//   noWarn = false,
//   dependencies: any[] = []
// ) => {
//   const positionProvider = React.useContext(PositionProviderContext);
//   const mounted = useEnsureContext(positionProvider, "PositionProvider", "usePositionProviderRegister", { noWarn });
//   // const HeadId = useRef<number>(null as unknown as number); // the id would be received from the PositionProvider wrapper
//   // useLayoutEffect(() => {
//   //   if (!mounted) return;
//   //   HeadId.current = positionProvider.HeadsManager!.register(func);
//   //   return () => {
//   //     if (!mounted) return;
//   //     positionProvider.HeadsManager!.unregister(HeadId.current);
//   //   };
//   // }, []);
//   // const HeadId = useRegisteredManager(positionProvider.HeadsManager, mounted, func, dependencies);
//   const HeadId = useRegisteredManager(positionProvider.HeadsManager, func, dependencies);
//   return HeadId;
// };
