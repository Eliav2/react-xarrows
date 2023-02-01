import React from "react";
import { ArrowHead } from "./ArrowHead";
import { autoAnchor } from "react-xarrows/useAutoSelectAnchor";
import { XArrow, ProvideXContext, getBestPath, pointsToCurves, useXContext, Vector, pointsToLines } from "react-xarrows";
import type { Anchor, XArrowProps } from "react-xarrows";

export interface GridPathProps {
  breakPoint?: number;
  headSize?: number;
  headSharpness?: number;
  startAnchor?: Anchor;
  endAnchor?: Anchor;
}

const GridPathWithHead = (props: GridPathProps) => {
  const { breakPoint = 0.5, headSize = 30, headSharpness = 0.25, startAnchor, endAnchor } = props;
  const headOffset = headSize * (1 - headSharpness);
  const context = useXContext();
  let { startRect, endRect } = context;
  if (!startRect || !endRect) return null;
  endRect = endRect.expand(headOffset); // expand the endRect to make room for the arrow head
  const { startPoint, endPoint } = autoAnchor(startRect, endRect, { startAnchor, endAnchor });
  const { points, endDir } = getBestPath(startPoint, endPoint, { breakPoint });
  const v = pointsToLines(points);
  return (
    <>
      <path d={v} stroke="white" strokeWidth={3} />
      <ArrowHead sharpness={headSharpness} size={headSize} pos={endPoint.add(endDir.mul(headOffset))} dir={endDir} />
    </>
  );
};

export interface BestPathSmoothXArrowProps extends Pick<XArrowProps, "start" | "end">, GridPathProps {}

export const BestPathGridXArrow = (props: BestPathSmoothXArrowProps) => {
  const { start, end, ...smoothPathProps } = props;
  return (
    <XArrow start={start} end={end}>
      <GridPathWithHead {...smoothPathProps} />
    </XArrow>
  );
};
