import { ProvideXContext, XArrow, XArrowProps } from "../../../../src/redesign/XArrow";
import { range } from "shared/utils";
import { XLine } from "../../../../src/redesign/XLine";
import React from "react";

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
          const l = range(x1, x2, 50);
          const points: any = [];
          let len = x1;
          const last = l.at(-1) ?? 0;
          while (len < last) {
            points.push({ x1: len, y1: y1 ?? 0, x2: len + 50, y2: y1 });
            len += 50;
            if (len + 50 > last) {
              points.push({ x1: len, y1: y1 ?? 0, x2: len, y2: y2 });
              points.push({ x1: len, y1: y2 ?? 0, x2: x2, y2: y2 });
              break;
            }
            points.push({ x1: len, y1: y1 ?? 0, x2: len, y2: y2 });
            points.push({ x1: len, y1: y2 ?? 0, x2: len + 50, y2: y2 });
            len += 50;
            if (len + 50 > last) {
              points.push({ x1: len, y1: y2 ?? 0, x2: x2, y2: y2 });
              break;
            }
            points.push({ x1: len, y1: y2 ?? 0, x2: len, y2: y1 });
          }
          return points.map((p, i) => <XLine key={i} {...p} />);
        }}
      </ProvideXContext>
    </XArrow>
  );
};
