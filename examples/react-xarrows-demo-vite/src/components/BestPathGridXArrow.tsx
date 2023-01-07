import { XArrowProps, XArrow, autoSelectAnchor, ProvideXContext, getBestPath } from "react-xarrows";
import React from "react";

export interface BestPathGridXArrowProps extends Pick<XArrowProps, "start" | "end"> {
  breakPoint?: number;
}

export const BestPathGridXArrow = (props: BestPathGridXArrowProps) => {
  const { start, end } = props;
  return (
    <XArrow start={start} end={end}>
      <ProvideXContext>
        {(context) => {
          const { startElem, endElem } = context;
          if (!startElem || !endElem) return null;
          const { startPoint, endPoint } = autoSelectAnchor({
            startElem: startPosition,
            endElem: endPosition,
            // startAnchor: "right",
            // endAnchor: "top",
          });
          // const points = [startPoint, endPoint];
          // const points = zTurn(startPoint, endPoint);
          const points = getBestPath({ startPoint, endPoint, options: { breakPoint: props.breakPoint } });
          const points_s = points.map((p) => p.x + "," + p.y).join(" ");
          return <polyline points={points_s} stroke="white" strokeWidth={3} />;
        }}
      </ProvideXContext>
    </XArrow>
  );
};
BestPathGridXArrow.defaultProps = {
  grid: 0.5,
};
