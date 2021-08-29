import _ from 'lodash';
import { useLayoutEffect, useRef } from 'react';

const deepCompareEquals = (curVal, refVal) => {
  return _.isEqual(curVal, refVal);
};

function useDeepCompareMemoize(value, condFunc) {
  const ref = useRef();
  // it can be done by using useMemo as well
  // but useRef is rather cleaner and easier

  if (!condFunc(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
}

export function useDeepCompareEffect(callback, dependencies, effect = useLayoutEffect, condFunc = deepCompareEquals) {
  effect(
    callback,
    dependencies.map((dep) => useDeepCompareMemoize(dep, condFunc))
  );
}
