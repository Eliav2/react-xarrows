import React from 'react';
import { useLayoutEffect, useRef, useState } from 'react';

const NormalizedGSvg = ({ children }) => {
  const ref = useRef<SVGGElement>(null);
  const [bbox, setBbox] = useState({ x: 0, y: 0, width: 0, height: 0 });
  let min = Math.min(bbox.height, bbox.width);
  useLayoutEffect(() => {
    setBbox(ref.current?.getBBox());
  }, [children]);
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
