import React, { LegacyRef, ReactNode, useEffect } from "react";
import { svgElemStrType } from "../types";
import { IDir, IPoint } from "./types/types";
import { getBBox } from "./NormalizedGSvg";
import { Dir, Vector } from "./path";
import { BasicHeadShape1 } from "./shapes";
import { useHeadProvider, useHeadProviderRegister } from "./providers/HeadProvider";
import { MapNonNullable, RemoveChildren } from "shared/types";
import { childrenRenderer } from "./internal/Children";
import { usePositionProviderRegister } from "./providers";

export interface XHeadProps {
  children?: React.ReactNode; // a jsx element of type svg like <circle .../> or <path .../>

  dir?: IDir;

  // the color of the svg shape
  // default to use always 'fill' and not 'stroke' so svg normalization would work as expected
  color?: string;

  // the size (width X height) in pixels
  size?: number;

  // props that will be passed to top level <g/> element wrapping the svg shape
  props?: JSX.IntrinsicElements[svgElemStrType];

  // rotate in degrees after normal positioning
  rotate?: number;

  containerRef?: LegacyRef<SVGGElement>; // internal
  pos?: IPoint;
}

const XHead = React.forwardRef<SVGGElement, XHeadProps>(function XHead(props, forwardRef) {
  // console.log("XHead");
  const headProvider = useHeadProvider();
  // const headProvider = useHeadProvider();
  // console.log("headProvider?.dir", headProvider?.dir);
  // const { endPoint } = usePositionProvider();
  let { children = DefaultChildren, ...propsNoChildren } = props;
  const propsWithDefault = Object.assign(
    {
      pos: new Vector(headProvider?.pos ?? { x: 0, y: 0 }),
      dir: new Dir(headProvider?.dir ?? { x: 0, y: 0 }),
      rotate: headProvider?.rotate ?? 0,
      color: headProvider?.color ?? "cornflowerblue",
      size: headProvider?.size ?? 30,
      props: {},
      containerRef: null,
    },
    propsNoChildren
  );
  propsWithDefault.dir = new Dir(propsWithDefault.dir);
  const { dir, pos, rotate, color, size, containerRef } = propsWithDefault;
  // the reason there are 3 nested g elements is to allow the user to override props of the inner children svg element

  return (
    <g {...props.props} ref={forwardRef}>
      <g
        ref={containerRef}
        style={{
          transformBox: "fill-box",
          transformOrigin: "center",
          transform: `translate(${-dir.x * 50}%,${-dir.y * 50}%) rotate(${dir.toDegree() + rotate}deg) `,
          fill: color,
          pointerEvents: "auto",
        }}
      >
        <g
          style={{
            transform: `translate(${pos.x}px,${pos.y}px) scale(${size})`,
            pointerEvents: "auto",
          }}
        >
          {childrenRenderer(DefaultChildren, propsWithDefault, forwardRef)}
        </g>
      </g>
    </g>
  );
});
// XHead.defaultProps = {
//   size: 30,
//   // children: arrowShapes.arrow1.svgElem,
//   color: "cornflowerBlue",
//   rotate: 0,
// };

export default XHead;

// const DefaultChildren = (props: NonNullableProps<RemoveChildren<XHeadProps>>) => {
interface DefaultChildrenProps extends RemoveChildren<Required<XHeadProps>> {
  dir: Dir;
  pos: Vector;
}

const DefaultChildren = (props: DefaultChildrenProps) => {
  // console.log("DefaultChildren");
  const offSet = props.size * 0.75; // this shape of arrow head has 25% of its size as a tail
  // console.log("props.dir", props.dir);
  // console.log("props.pos.x", props.pos.x);
  usePositionProviderRegister(
    (pos) => {
      // console.log("registered function");
      // console.log("props.dir", props.dir);
      // console.log(pos);
      if (pos.endPoint) {
        // console.log("making change to pos.endPoint");
        pos.endPoint = new Vector(pos.endPoint.sub(props.dir.mul(offSet)));
      }
      return pos;
    },
    false,
    // [props.dir]
    [props.dir.x, props.dir.y, props.size]
  );
  // usePositionProviderRegister(
  //   (pos) => {
  //     console.log("registered function");
  //     console.log("props.dir", props.dir);
  //     if (pos.endPoint) {
  //       console.log("making change to pos.endPoint");
  //       pos.endPoint = new Vector(pos.endPoint.sub(props.dir.mul(offSet)));
  //     }
  //     return pos;
  //   },
  //   false,
  //   // [props.dir]
  //   [props.dir.x, props.dir.y, props.size]
  // );
  // useHeadProviderRegister((head) => {
  //   head.pos = new Vector(head.pos.sub(props.dir.mul(offSet)));
  //   return head;
  // });

  return <BasicHeadShape1 />;
};
