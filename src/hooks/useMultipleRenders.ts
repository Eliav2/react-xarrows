import { useLayoutEffect, useRef, useState } from 'react';

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
