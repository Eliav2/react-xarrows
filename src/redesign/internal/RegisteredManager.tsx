import { useLayoutEffect, useRef } from "react";
import { useEnsureContext } from "./hooks";
import { useXWrapperContext } from "../XWrapper";
import useRerender from "shared/hooks/useRerender";

/**
 * this class holds the registered components and their registered functions, usually render functions.
 */
export class RegisteredManager<Func = () => void> {
  registered: { [key: string]: Func } = {};
  private missingIndexes = new Set<number>();
  private countRegistered = 0;

  constructor() {
    this.registered = {};
  }

  //returns the first available index.
  private getAvailableIndex(): number {
    //returns the next available index.
    if (this.missingIndexes.size === 0) return this.countRegistered;
    else return this.missingIndexes.values().next().value;
  }

  //returns the id of the registered component.
  register(render): number {
    const id = this.getAvailableIndex();
    this.missingIndexes.delete(id);
    this.registered[id] = render;
    this.countRegistered++;
    return id;
  }

  //unregisters the component with the given id.
  unregister(id: number) {
    delete this.registered[id];
    this.missingIndexes.add(id);
    this.countRegistered--;
  }
}

/**
 *  registers a function to a manager, and unregisters it when the component is unmounted.
 *  once a function is registered, it can be called by the parent component.
 */
export const useRegisteredManager = <T extends any>(manager: RegisteredManager<T> | null, isProviderMounted: boolean, func) => {
  const id = useRef<number>(null as unknown as number); // the id would be received from the Provider wrapper
  const reRender = useRerender();
  useLayoutEffect(() => {
    reRender(); // this is needed to make sure any function that is registered on first render will accessible.
    if (!isProviderMounted) return;
    id.current = manager!.register(func);
    return () => {
      if (!isProviderMounted) return;
      manager!.unregister(id.current);
    };
  }, []);
  return id;
};

// export const useRegisteredManager = (useContextHook,render, noWarn = false) => {
//   const xWrapperContext = useContextHook({ noWarn });
//   const XArrowId = useRef<number>(null as unknown as number); // the id would be received from the XWrapper wrapper
//   const mounted = useEnsureContext(xWrapperContext, "XWrapper", "useXWrapperRegister", { noWarn });
//   useLayoutEffect(() => {
//     if (!mounted) return;
//     XArrowId.current = xWrapperContext.xWrapperXArrowsManager!.register(render);
//     return () => {
//       if (!mounted) return;
//       xWrapperContext.xWrapperXArrowsManager!.unregister(XArrowId.current);
//     };
//   }, []);
// };
//
