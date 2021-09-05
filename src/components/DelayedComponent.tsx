import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useHookTruetyCompare } from '../hooks/useHookTruetyCompare';

// will render {delay} dumy memorized renders before actually rendering the given {componentCB} for each render
// used to delay component that relay on DOM properties of other component
export const DelayedComponent: React.FC<{ delay: number; children: () => JSX.Element }> = ({ delay = 1, children }) => {
  // console.log('DelayedXComponent');
  const count = useRef(0);

  const c = count.current;
  let deps = delay < 1 ? undefined : [c === delay - 1];

  const comp = useHookTruetyCompare(
    () => {
      return children();
    },
    deps,
    useMemo
  );
  // console.log(comp);

  const [, setRender] = useState({});
  const reRender = () => setRender({});
  useEffect(() => {
    if (count.current != delay) {
      reRender();
      count.current += 1;
    } else {
      count.current = 0;
    }
  });
  return comp;
};
