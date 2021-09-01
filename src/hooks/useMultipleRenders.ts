import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useHookTruetyCompare } from './useHookTruetyCompare';

/**
 * will cause the consuming component to render <renders>
 * @param renders
 * @param effect
 */
export const useMultipleRenders = (renders = 2, effect = useLayoutEffect) => {
  const [, setRender] = useState({});
  const reRender = () => setRender({});
  const count = useRef(0);

  effect(() => {
    if (count.current != renders) {
      reRender();
      count.current += 1;
    } else {
      count.current = 0;
    }
  });

  return count.current;
};

/**
 * will call a function on a later render
 * @param func - a callback to execute
 * @param renders - number of renders ao wait until calling func
 */
export const useCallOnNextRender = (func, renders = 2) => {
  const count = useMultipleRenders(renders);
  const val = useHookTruetyCompare(
    () => {
      return func();
    },
    [count == renders - 1],
    useMemo
  );

  return val;
};
