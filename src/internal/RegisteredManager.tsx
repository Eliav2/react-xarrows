import { useLayoutEffect, useRef } from "react";

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
    // todo: consider using useId hook provided by react instead of this.
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
  registeredFunc,
  dependencies: any[] = [],
  afterRegister?: () => void
) => {
  const id = useRef<number>(null as unknown as number); // the id would be received from the Provider wrapper
  // const reRender = useRerender();
  useLayoutEffect(() => {
    if (!manager) return;
    id.current = manager.register(registeredFunc, id.current);
    // console.log("registering", id.current);
    afterRegister?.();
    return () => {
      if (!manager) return;
      // console.log("unregistering", id.current);
      afterRegister?.();

      // reRender();
      manager.unregister(id.current);
    };
  }, dependencies);

  return id;
};
