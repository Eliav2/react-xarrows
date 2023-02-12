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
import { assignDefaults, omit } from "shared/utils";

export interface XHeadProps {
  element?: JSX.Element; // a jsx element of type svg like <circle .../> or <path .../>

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

export interface XHeadPropsWithDefaults extends XHeadProps {
  dir: Dir;
  pos: Vector;
}

const XHead = React.forwardRef<SVGGElement, XHeadProps>(function XHead(props, forwardRef) {
  //todo: fix register functions does not work in first render

  // console.log("XHead");
  const headProvider = useHeadProvider();
  // const headProvider = useHeadProvider();
  // console.log("headProvider?.dir", headProvider?.dir);
  // const { endPoint } = usePositionProvider();
  const propsWithDefault = assignDefaults(props, {
    pos: new Vector(headProvider?.pos ?? { x: 0, y: 0 }),
    dir: new Dir(headProvider?.dir ?? { x: 0, y: 0 }),
    rotate: headProvider?.rotate ?? 0,
    color: headProvider?.color ?? "cornflowerblue",
    size: headProvider?.size ?? 30,
    props: {},
    containerRef: null,
  });
  //@ts-ignore
  let { element = (<DefaultChildren />) as any } = props;

  const elementWithProps = React.cloneElement(element, propsWithDefault);

  propsWithDefault.dir = new Dir(propsWithDefault.dir);
  const { dir, pos, rotate, color, size, containerRef } = propsWithDefault;

  // const offSet = propsWithDefault.size * 0.75; // this shape of arrow head has 25% of its size as a tail
  // usePositionProviderRegister(
  //   (pos) => {
  //     if (pos.endPoint) pos.endPoint = new Vector(pos.endPoint.sub(propsWithDefault.dir.mul(offSet)));
  //   },
  //   [propsWithDefault.dir.x, propsWithDefault.dir.y, propsWithDefault.size, propsWithDefault.pos.x, propsWithDefault.pos.y]
  // );

  // console.log(props.pos, propsWithDefault.pos);
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
          {childrenRenderer(elementWithProps, propsWithDefault, forwardRef)}
        </g>
      </g>
    </g>
  );
});

export default XHead;

// const DefaultChildren = (props: NonNullableProps<RemoveChildren<XHeadProps>>) => {
interface DefaultChildrenProps extends Omit<Required<XHeadProps>, "element"> {
  dir: Dir;
  pos: Vector;
}

const DefaultChildren = (props: DefaultChildrenProps) => {
  // console.log("DefaultChildren", props);
  const offSet = props.size * 0.75; // this shape of arrow head has 25% of its size as a tail
  usePositionProviderRegister(
    (pos) => {
      if (pos.endPoint) pos.endPoint = new Vector(pos.endPoint.sub(props.dir.mul(offSet)));
    },
    [props.dir.x, props.dir.y, props.size, props.pos.x, props.pos.y]
  );
  return <BasicHeadShape1 />;
};
