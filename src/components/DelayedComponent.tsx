import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useHookTruetyCompare } from '../hooks/useHookTruetyCompare';

export interface DelayedComponentPropsAPI {
  // the number of idle renders (cached result is returned) before running the actual expensive render that sample the DOM.
  // can be used to sample the DOM after other components updated, that your xarrow maybe depends on.
  _delayRenders?: number;
}
export interface DelayedComponentProps extends DelayedComponentPropsAPI {
  children: (...any: any[]) => JSX.Element;
}

// will render {delay} dumy memorized renders before actually rendering the given for each render
// used to delay component that relay on DOM properties of other component
export const DelayedComponent: React.FC<DelayedComponentProps> = ({ _delayRenders = 1, children }) => {
  console.log('DelayedXComponent');
  const count = useRef(0);

  const c = count.current;
  let deps = _delayRenders < 1 ? undefined : [c === _delayRenders - 1];

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
    if (count.current != _delayRenders) {
      reRender();
      count.current += 1;
    } else {
      count.current = 0;
    }
  });
  return comp;
};
