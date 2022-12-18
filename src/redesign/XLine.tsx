import React from "react";
import { useXArrowContext } from "./XArrow";

interface XLineProps extends React.SVGProps<SVGLineElement> {}

export const XLine = (props: XLineProps) => {
  const val = useXArrowContext();
  return (
    <line
      x1={val.startPoint.x}
      y1={val.startPoint.y}
      x2={val.endPoint.x}
      y2={val.endPoint.y}
      {...props}
      fill="transparent"
      stroke="white"
      strokeWidth={3}
    />
  );
};
