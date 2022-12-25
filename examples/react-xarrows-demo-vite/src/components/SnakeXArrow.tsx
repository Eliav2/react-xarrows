import { ProvideXContext, XArrow, XArrowProps } from "react-xarrows/XArrow";
import React from "react";
import { zigZag, zTurn } from "react-xarrows/path";

interface SnakeXArrowProps extends Pick<XArrowProps, "start" | "end"> {}

const SnakeXArrow = (props: SnakeXArrowProps) => {
  return (
    <XArrow {...props}>
      <ProvideXContext>
        {(context) => {
          const {
            startPoint: { x: x1, y: y1 },
            endPoint: { x: x2, y: y2 },
          } = context;
          let len = x2 - x1;
          const maxLen = 100 * (len > 0 ? 1 : -1);
          const points: [number, number][] = [];
          let [x] = [x1, y1];
          if (Math.abs(len) > Math.abs(maxLen)) {
            while (Math.abs(len) > Math.abs(maxLen)) {
              points.push(...zTurn({ x, y: y1 }, { x: x + maxLen, y: y2 }, { dir: "x" }));
              len -= maxLen;
              x += maxLen;
            }
          } else {
            points.push(...zTurn({ x: x1, y: y1 }, { x: x2, y: y2 }, { dir: "x" }));
          }
          points.push([x2, y2]);
          return <polyline points={points.join(" ")} fill="transparent" stroke="white" strokeWidth={3} />;
        }}
      </ProvideXContext>
    </XArrow>
  );
};
export default SnakeXArrow;
