import React from 'react';
import { useLayoutEffect, useRef, useState } from 'react';
import { useCompareEffect } from '../hooks/useCompareEffect';

export const useGetBBox = (ref, jsx?) => {
  const [bbox, setBbox] = useState({ x: 0, y: 0, width: 0, height: 0 });
  useLayoutEffect(() => {
    setBbox(ref.current?.getBBox());
  }, [ref.current]);
  useCompareEffect(() => {
    setBbox(ref.current?.getBBox());
  }, [jsx?.props]);
  return bbox;
};

const NormalizedGSvg = ({ children }) => {
  const ref = useRef<SVGGElement>(null);
  const bbox = useGetBBox(ref);
  let min = Math.min(bbox.height, bbox.width);
  return (
    <g
      ref={ref}
      style={{
        transform: `translate(${-bbox.x - bbox.width / 2}px,${-bbox.y - bbox.height / 2}px) scale(${1 / min}) `,
        transformBox: 'fill-box',
        transformOrigin: 'center',
      }}>
      {children}
    </g>
  );
};
export default NormalizedGSvg;
