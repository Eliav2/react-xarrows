import { useLayoutEffect, useRef } from 'react';

/**
 * any hook,just with dependency list of booleans, if the dependency list includes true the callback would be executed by the provided hook
 * @param hook - like useEffect,useCallback ,etc
 * @param callback - () => console.log('hello world')
 * @param conditions - like [false,true,false]
 */
export const useTruetyHook = (hook = useLayoutEffect as any, callback: Function, conditions: boolean[]) => {
  const shouldUpdate = useRef(false);
  useLayoutEffect(() => {
    if (typeof conditions === 'undefined' || conditions.some((cond) => cond))
      shouldUpdate.current = !shouldUpdate.current;
  });
  // console.log('useHookTruetyCompare', shouldUpdate.current);
  return hook(callback, [shouldUpdate.current]);
};
