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
  register(render, id): number {
    id ??= this.getAvailableIndex();
    if (id in this.registered) {
      // if id is already registered, update with the new render function.
      this.registered[id] = render;
    } else {
      this.registered[id] = render;
      this.missingIndexes.delete(id);
      this.countRegistered++;
    }
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
export const useRegisteredManager = <T extends any>(
  manager: RegisteredManager<T> | null,
  // isProviderMounted: boolean,
  func,
  dependencies: any[] = []
) => {
  const id = useRef<number>(null as unknown as number); // the id would be received from the Provider wrapper
  const reRender = useRerender();
  useLayoutEffect(() => {
    reRender(); // this is needed to make sure any function that is registered will be accessible.
    if (!manager) return;
    id.current = manager.register(func, id.current);
    return () => {
      if (!manager) return;
      manager.unregister(id.current);
    };
  }, dependencies);

  return id;
};
