import React from "react";
import { useXContext } from "./XArrow";
import { RelativeSize } from "shared/types";
import { getRelativeSizeValue } from "shared/utils";
import { Vector } from "./path/vector";
import { Line } from "./path/line";

export interface XLineProps extends React.SVGProps<SVGLineElement> {
  stripEnd?: RelativeSize; // how much of the end of the line should be removed
  stripStart?: RelativeSize; // how much of the start of the line should be removed
  component?: React.ElementType<XLineProps>;
  color?: string;
  strokeWidth?: number;
}

export const XLine = (props: XLineProps) => {
  const val = useXContext();
  let {
    component: Component = "line" as const,
    stripEnd,
    stripStart,
    x1 = val.startPoint.x,
    y1 = val.startPoint.y,
    x2 = val.endPoint.x,
    y2 = val.endPoint.y,
    color = "cornflowerblue",
    strokeWidth = 3,
    ...p
  } = props;
  x1 = Number(x1);
  y1 = Number(y1);
  x2 = Number(x2);
  y2 = Number(y2);
  let l = new Line(new Vector(x1, y1), new Vector(x2, y2));
  if (props.stripEnd) {
    l = l.stripEnd(getRelativeSizeValue(props.stripEnd, l.diff.size()));
  }
  return (
    <Component
      x1={l.root.x}
      y1={l.root.y}
      x2={l.end.x}
      y2={l.end.y}
      // x1={val.startPoint.x}
      // y1={val.startPoint.y}
      // x2={val.endPoint.x}
      // y2={val.endPoint.y}
      fill="transparent"
      stroke={color}
      strokeWidth={strokeWidth}
      {...p}
    />
  );
};
export default XLine;

XLine.defaultProps = {
  component: "line",
  color: "cornflowerblue",
  strokeWidth: 3,
};
