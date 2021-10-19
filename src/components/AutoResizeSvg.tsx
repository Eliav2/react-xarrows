// smart svg that auto resizes based on children element. always renders twice
import React, { SVGProps, useEffect, useLayoutEffect, useRef, useState } from 'react';
import _ from 'lodash';
import { useTruetyHook } from '../hooks/useTruetyHook';
import { useCallOnNextRender, useMultipleRenders } from '../hooks/useMultipleRenders';
import { useDoesUpdateIsScheduled } from '../hooks/useDoesUpdateIsScheduled';
import { appendPropsToChildren } from '../utils/reactUtils';

export interface AutoResizeSvgProps extends SVGProps<SVGSVGElement> {
  effectPhase?: typeof useEffect;
  padding?: number;
}

export const AutoResizeSvg: React.FC<AutoResizeSvgProps> = ({
  children,
  effectPhase = useLayoutEffect,
  padding = 1,
  style,
  ...props
}) => {
  console.log('AutoResizeSvg');
  const svgInnersRef = useRef<SVGGElement>(null);
  const [st, setSt] = useState({ width: 0, height: 0, x: 0, y: 0 });
  const [, setRender] = useState({});
  const forceRerender = () => setRender({});
  const [initialized, setInitialized] = useState(false);

  // rerender on mount until proper DOM dimensions are set
  let curSt = svgInnersRef.current?.getBBox() ?? {
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  };

  if (!_.isNil(curSt.height)) curSt.height += padding;
  if (!_.isNil(curSt.width)) curSt.width += padding;
  useTruetyHook(
    effectPhase,
    () => {
      if (!curSt.width) setSt(curSt);
      else setInitialized(true);
    },
    [!initialized]
  );

  if (_.isEqual(st, curSt)) setSt(curSt);
  // useCallOnNextRender(() => {
  //   if (_.isEqual(st, curSt)) setSt(curSt);
  // }, 4);

  let newChildren;
  if (_.isFunction(children)) {
    newChildren = children(forceRerender);
  } else {
    // newChildren = React.Children.map(children, (child) => {
    //   if (React.isValidElement(child)) {
    //     return React.cloneElement(child, { updateSvg: forceRerender });
    //   }
    //   return child;
    // });
    newChildren = appendPropsToChildren(children, { updateSvg: forceRerender });
  }
  console.log(curSt);

  return (
    <svg
      height={curSt.height}
      width={curSt.width}
      // height={200}
      // width={200}
      style={{
        border: 'solid yellow 1px',
        // position: 'relative',
        // left: -st.x,
        // top: -st.y,
        ...style,
      }}
      overflow="visible"
      {...props}>
      <g
        ref={svgInnersRef}
        // transform={`translate(-10,${-st.y})`}
        transform={`translate(${-st.x},${-st.y})`}>
        {newChildren}
      </g>
    </svg>
  );
};

export default AutoResizeSvg;
