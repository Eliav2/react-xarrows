import React, { useLayoutEffect, useRef, useState } from "react";
import isEqual from "react-fast-compare";

const bboxDefault = { x: 0, y: 0, width: 0, height: 0 };
export const getBBox = (ref: SVGGraphicsElement | null) => {
  if (!ref) return bboxDefault;
  return ref.getBBox();
};
export const useGetBBox = (ref: React.RefObject<SVGGraphicsElement>, deps: any[] = []) => {
  // console.log("useGetBBox");
  const [bbox, setBbox] = useState(bboxDefault);
  useLayoutEffect(() => {
    setBbox(getBBox(ref.current));
  }, [ref.current, ...deps]);
  useLayoutEffect(() => {
    const v = getBBox(ref.current);
    if (!isEqual(bbox, v)) setBbox(v);
  });
  return bbox;
};

/**
 * takes svg react element as children and normalizes it to be centered and have a size of 1
 */
const NormalizedGSvg = ({ children }) => {
  const ref = useRef<SVGGElement>(null);
  const bbox = useGetBBox(ref, [ref.current]);
  let min = Math.min(bbox.height, bbox.width);
  return (
    <g
      ref={ref}
      style={{
        transform: `translate(${-bbox.x - bbox.width / 2}px,${-bbox.y - bbox.height / 2}px) scale(${1 / min}) `,
        transformBox: "fill-box",
        transformOrigin: "center",
      }}
    >
      {children}
    </g>
  );
};
export default NormalizedGSvg;
