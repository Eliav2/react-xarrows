// smart svg that auto resizes based on children element. always renders twice
import React, { SVGProps, useEffect, useLayoutEffect, useRef, useState } from 'react';
import _ from 'lodash';
import { useHookTruetyCompare } from '../hooks/useHookTruetyCompare';
import { useCallOnNextRender, useMultipleRenders } from '../hooks/useMultipleRenders';
import { useDoesUpdateIsScheduled } from '../hooks/useDoesUpdateIsScheduled';
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
  // console.log('AutoResizeSvg');
  const svgInnersRef = useRef<SVGGElement>(null);
  const [svgGSize, setSVGSize] = useState({ width: 0, height: 0 });

  const [initialized, setInitialized] = useState(false);

  // rerender on mount until proper DOM dimensions are set
  let curSvgSize = _.pick(svgInnersRef.current?.getBoundingClientRect(), 'width', 'height') ?? {
    width: 0,
    height: 0,
  };

  if (!_.isNil(curSvgSize.height)) curSvgSize.height += padding;
  if (!_.isNil(curSvgSize.width)) curSvgSize.width += padding;
  useHookTruetyCompare(
    () => {
      if (!curSvgSize.width) setSVGSize(curSvgSize);
      else setInitialized(true);
    },
    [!initialized],
    effectPhase
  );

  effectPhase(() => {});

  useCallOnNextRender(() => {
    if (_.isEqual(svgGSize, curSvgSize)) setSVGSize(curSvgSize);
  }, 4);

  return (
    <svg
      height={curSvgSize.height}
      width={curSvgSize.width}
      vectorEffect="non-scaling-stroke"
      style={{ ...style }}
      {...props}>
      <g ref={svgInnersRef}>{children}</g>
    </svg>
  );
};

export default AutoResizeSvg;
