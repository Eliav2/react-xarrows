import React, { LegacyRef } from "react";
import { svgElemStrType } from "../types";
import { IDir, IPoint } from "./types/types";
import { getBBox } from "./components/NormalizedGSvg";
import { Dir } from "./path";

export interface XEdgeProps {
  children?: React.ReactNode; // a jsx element of type svg like <circle .../> or <path .../>

  dir?: IDir;

  // the color of the svg shape
  // default to use always 'fill' and not 'stroke' so svg normalization would work as expected
  color?: string;

  // show the svg ?
  show?: boolean;

  // the size (width X height) in pixels
  size?: number;

  // props that will be passed to top level <g/> element wrapping the svg shape
  props?: JSX.IntrinsicElements[svgElemStrType];

  // rotate in degrees after normal positioning
  rotate?: number;

  containerRef?: LegacyRef<SVGGElement>; // internal
  pos: IPoint;
}

const XEdge = React.forwardRef<SVGGElement, XEdgeProps>(function XEdge(props, forwardRef) {
  let { children, containerRef, pos, dir = new Dir(0, 0), rotate = 0 } = props;
  const _dir = new Dir(dir);
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
          transform: `translate(${-_dir.x * 50}%,${-_dir.y * 50}%) rotate(${_dir.toDegree() + rotate}deg) `,
          fill: props.color,
          pointerEvents: "auto",
        }}
      >
        <g
          style={{
            transform: `translate(${pos.x}px,${pos.y}px) scale(${props.size})`,
            pointerEvents: "auto",
          }}
        >
          {children}
        </g>
      </g>
    </g>
  );
});
XEdge.defaultProps = {
  size: 30,
  // children: arrowShapes.arrow1.svgElem,
  color: "cornflowerBlue",
  rotate: 0,
};

export default XEdge;

export const getXEdgeSize = (ref: React.RefObject<any>) => {
  // const bbox = useGetBBox(ref);
  // console.log(bbox);
  return getBBox(ref.current);
};
