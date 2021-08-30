import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useHookTruetyCompare } from './useHookTruetyCompare';

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
