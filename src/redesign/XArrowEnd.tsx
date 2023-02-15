import React from "react";
import { Dir, Vector } from "./path";
import { BasicHeadShape1 } from "./shapes";
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
  //todo: fix register functions does not work in first render

  console.log("XArrowEnd");

  return <SvgManipulator {...props} ref={forwardRef} />;
});

export default XArrowEnd;

// const DefaultChildren = (props: NonNullableProps<RemoveChildren<XArrowEndProps>>) => {
interface DefaultChildrenProps extends Omit<Required<XArrowEndProps>, "element"> {
  rotation: Dir;
  pos: Vector;
}

const DefaultChildren = (props: DefaultChildrenProps) => {
  // console.log("DefaultChildren", props);
  const offSet = props.size * 0.75; // this shape of arrow head has 25% of its size as a tail
  // usePositionProviderRegister(
  //   (pos) => {
  //     if (pos.endPoint) pos.endPoint = new Vector(pos.endPoint.sub(props.rotation.mul(offSet)));
  //   },
  //   [props.rotation.x, props.rotation.y, props.size, props.pos.x, props.pos.y]
  // );
  return <BasicHeadShape1 />;
};
