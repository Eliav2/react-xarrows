import React, { LegacyRef, ReactNode, useEffect } from "react";
import { svgElemStrType } from "../types";
import { IDir, IPoint } from "./types/types";
import { getBBox } from "./NormalizedGSvg";
import { Dir, Vector } from "./path";
import { BasicHeadShape1 } from "./shapes";
import { useHeadProvider, useHeadProviderRegister } from "./providers/HeadProvider";
import { usePositionProvider, usePositionProviderRegister } from "./providers";
import { MapNonNullable, RemoveChildren } from "shared/types";
import { childrenRenderer } from "./internal/Children";

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
  // console.log("XHead render");
  const headProvider = useHeadProvider();
  // const { endPoint } = usePositionProvider();
  let { children, ...propsNoChildren } = props;
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
  const { dir, pos, rotate, color, size, containerRef } = propsWithDefault;

  // console.log("XHead", headProvider?.dir);
  // let children = <DefaultChildren />;
  children ??= childrenRenderer(DefaultChildren, propsWithDefault, forwardRef);

  // const

  // console.log(dir);

  // useEffect(() => {
  //   console.log("XHead useEffect");
  //   return () => console.log("XHead useEffect clean");
  // }, []);
  // console.log(_dir);

  // const dir = pos._chosenFaceDir;
  // const endEdgeRef = useRef();
  // let edgeBbox = useGetBBox(endEdgeRef, deps);
  // let offset = dir.reverse().mul((edgeBbox?.width ?? 0) * svgElem.offsetForward);
  // props.state[`${vName}Offset`] = offset;
  // if (!show) offset = offset.mul(0);

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
          {children}
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
  // console.log("DefaultChildren render", props);
  const offSet = props.size * 0.75;
  // const _props = { ...props };
  // console.log(props.dir.mul(offSet));
  // const dir = { ...props.dir };
  // console.log("render", dir);
  // const myVal = 10;
  // console.log("myVal", myVal);
  // const { dir } = useHeadProvider();
  useHeadProviderRegister((val) => {
    if (val.dir) val.pos = val.pos?.add(val.dir?.mul(offSet));
    return val;
    // const newPos = { ...pos, endPoint: { x: pos.endPoint.x, y: pos.endPoint.y - 30 } };
    // return newPos;
  });

  // console.log(offSet);

  usePositionProviderRegister(
    (pos) => {
      // console.log(props.dir);
      // console.log(offSet);

      if (pos.endPoint) pos.endPoint = new Vector(pos.endPoint.sub(props.dir.mul(offSet)));
      // console.log(pos.endPoint, pos.endPoint.add(30));
      return pos;
      // const newPos = { ...pos, endPoint: { x: pos.endPoint.x, y: pos.endPoint.y - 30 } };
      // return newPos;
    },
    false,
    [props.dir.x, props.dir.y]
  );

  return <BasicHeadShape1 />;
};

export const getXHeadSize = (ref: React.RefObject<any>) => {
  // const bbox = useGetBBox(ref);
  // console.log(bbox);
  return getBBox(ref.current);
};
