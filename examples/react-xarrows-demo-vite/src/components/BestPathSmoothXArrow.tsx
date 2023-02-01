import React from "react";
import { ArrowHead } from "./ArrowHead";
import { autoAnchor } from "react-xarrows/AutoAnchor";
import { XArrow, ProvideXArrow, getBestPath, pointsToCurves, useXArrow, Vector } from "react-xarrows";
import type { Anchor, XArrowProps } from "react-xarrows";

export interface SmoothPathProps {
  breakPoint?: number;
  headSize?: number;
  headSharpness?: number;
  startAnchor?: Anchor;
  endAnchor?: Anchor;
}

const SmoothPathWithHead = (props: SmoothPathProps) => {
  const { breakPoint = 0.5, headSize = 30, headSharpness = 0.25, startAnchor, endAnchor } = props;
  const headOffset = headSize * (1 - headSharpness);
  const context = useXArrow();
  let { startRect, endRect } = context;
  if (!startRect || !endRect) return null;
  endRect = endRect.expand(headOffset); // expand the endRect to make room for the arrow head
  const { startPoint, endPoint } = autoAnchor(startRect, endRect, { startAnchor, endAnchor });
  const { points, endDir } = getBestPath(startPoint, endPoint, { zBreakPoint: breakPoint });
  const v = pointsToCurves(points);
  return (
    <>
      <path d={v} stroke="white" strokeWidth={3} />
      {/*<ArrowHead sharpness={headSharpness} size={headSize} pos={endPoint.add(endDir.mul(headOffset))} dir={endDir} />*/}
    </>
  );
};

export interface BestPathSmoothXArrowProps extends Pick<XArrowProps, "start" | "end">, SmoothPathProps {}

export const BestPathSmoothXArrow = (props: BestPathSmoothXArrowProps) => {
  const { start, end, ...smoothPathProps } = props;
  return (
    <XArrow start={start} end={end}>
      <SmoothPathWithHead {...smoothPathProps} />
    </XArrow>
  );
};
// export const BestPathSmoothXArrow = (props: BestPathSmoothXArrowProps) => {
//   const { start, end, ...smoothPathProps } = props;
//   return (
//     <XArrow start={start} end={end}>
//       <AutoAnchor>
//          <BestPath>
//            <SmoothPathWithHead {...smoothPathProps} />
//          </BestPath>
//       </AutoAnchor>
//     </XArrow>
//   );
// };
