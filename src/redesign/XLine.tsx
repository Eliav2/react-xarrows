import React from "react";
import { useXArrow } from "./XArrow";
import { RelativeSize } from "shared/types";
import { getRelativeSizeValue } from "shared/utils";
import { Vector } from "./path/vector";
import { Line } from "./path/line";
import { usePositionProvider } from "./PositionProvider";

export interface XLineProps extends React.SVGProps<SVGLineElement> {
  stripEnd?: RelativeSize; // how much of the end of the line should be removed
  stripStart?: RelativeSize; // how much of the start of the line should be removed
  component?: React.ElementType<XLineProps>;
  color?: string;
  strokeWidth?: number;
}

export const XLine = (props: XLineProps) => {
  const val = useXArrow();
  let {
    component: Component = "line" as const,
    stripEnd,
    stripStart,
    x1,
    y1,
    x2,
    y2,
    color = "cornflowerblue",
    strokeWidth = 3,
    ...p
  } = props;

  const { startPoint, endPoint } = usePositionProvider();
  if (startPoint) {
    x1 = startPoint.x;
    y1 = startPoint.y;
  }
  if (endPoint) {
    x2 = endPoint.x;
    y2 = endPoint.y;
  }
  if (props.stripEnd || props.stripStart) {
    let l = new Line(new Vector(Number(x1), Number(y1)), new Vector(Number(x2), Number(y2)));
    if (props.stripEnd) {
      l = l.stripEnd(getRelativeSizeValue(props.stripEnd, l.diff().size()));
      x2 = l.end.x;
      y2 = l.end.y;
    }
    if (props.stripStart) {
      l = l.stripStart(getRelativeSizeValue(props.stripStart, l.diff().size()));
      x1 = l.root.x;
      y1 = l.root.y;
    }
  }

  return <Component x1={x1} y1={y1} x2={x2} y2={y2} fill="transparent" stroke={color} strokeWidth={strokeWidth} {...p} />;
};
export default XLine;

XLine.defaultProps = {
  component: "line",
  color: "cornflowerblue",
  strokeWidth: 3,
};
