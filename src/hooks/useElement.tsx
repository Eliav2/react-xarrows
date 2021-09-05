import { refType } from '../types';
import { useLayoutEffect, useState } from 'react';
import { getElementByPropGiven, getElemPos } from '../utils';
import { posType, XElementType } from '../privateTypes';
import _ from 'lodash';
import { useDeepCompareEffect } from './useDeepCompareEffect';

/**
 * would return current position and reference of a given element.
 * if the element does not exists anymore returns the last remembered position
 * @param elemProp element reference or id
 */
export const useElement = (elemProp: refType): XElementType => {
  // console.log('useElement');
  const [elem, setElem] = useState(() => getElementByPropGiven(elemProp));
  const [pos, setPos] = useState<posType>({ x: 0, y: 0, right: 0, bottom: 0 });
  const elemRef = getElementByPropGiven(elemProp);
  useLayoutEffect(() => {
    // console.log('elemProp changed!');
    setElem(getElementByPropGiven(elemProp));
  }, [elemProp, elemRef]);

  // // sample DOM while render(it's ok if the sample is being delayed upper in the tree)
  // const newPos = getElemPos(elem);
  // useDeepCompareEffect(
  //   () => {
  //     setPos(newPos);
  //   },
  //   [newPos],
  //   useLayoutEffect
  // );
  // or
  // sample dom at effects stage (triggers another render but takes more updated DOM sample)
  useLayoutEffect(() => {
    // console.log('elem', elem);
    if (elemRef) {
      const newPos = getElemPos(elem);
      if (!_.isEqual(newPos, pos)) {
        // console.log('elem update pos!', newPos);
        setPos(newPos);
      }
    }
  });
  return {
    position: pos,
    element: elem,
  };
};
