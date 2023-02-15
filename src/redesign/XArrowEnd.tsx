import React from "react";
import { Dir, Vector } from "./path";
import SvgManipulator, { SvgManipulatorProps } from "./SvgManipulator";

export interface XArrowEndProps extends SvgManipulatorProps {}

export interface XArrowEndPropsWithDefaults extends XArrowEndProps {
  rotation: Dir;
  pos: Vector;
}

/**
 * responsible for manipulating a svg shape
 */
const XArrowEnd = React.forwardRef<SVGGElement, XArrowEndProps>(function XArrowEnd(props, forwardRef) {
  // console.log("XArrowEnd");

  return <SvgManipulator {...props} ref={forwardRef} />;
});

export default XArrowEnd;
