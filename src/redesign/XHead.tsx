import React, { LegacyRef } from "react";
import { svgElemStrType } from "../types";
import { IDir, IPoint } from "./types/types";
import { getBBox } from "./NormalizedGSvg";
import { Dir } from "./path";
import { usePositionProvider } from "./PositionProvider";
import { BasicHeadShape1 } from "./shapes";
import { getLastValue } from "./utils";

export interface XHeadProps {
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
  pos?: IPoint;
}

const XHead = React.forwardRef<SVGGElement, XHeadProps>(function XEdge(props, forwardRef) {
  const { endPoint } = usePositionProvider();
  const headProvider = useHeadProvider();
  let {
    children = <BasicHeadShape1 />,
    containerRef,
    pos = endPoint ?? { x: 0, y: 0 },
    dir = headProvider?.dir ?? { x: 0, y: 0 },
    rotate = headProvider?.rotate ?? 0,
    color = headProvider?.color ?? "cornflowerblue",
    size = headProvider?.size ?? 30,
  } = props;
  // const

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

export const getXHeadSize = (ref: React.RefObject<any>) => {
  // const bbox = useGetBBox(ref);
  // console.log(bbox);
  return getBBox(ref.current);
};

export interface HeadProviderProps {
  children: React.ReactNode;
  value: {
    // override the given position of the start element, optional
    dir?: IDir | ((startDir: IDir) => IDir);
    pos?: IPoint | ((pos: IPoint) => IPoint);
    color?: string;
    rotate?: number | ((rotate: number) => number);
    size?: number | ((size: number) => number);
  };
}

export const HeadProvider = React.forwardRef(function HeadProvider({ children, value }: HeadProviderProps, forwardRef) {
  const prevVal = React.useContext(HeadProviderContext);
  const dir = getLastValue(value.dir, prevVal, "prevVal", (context) => context?.value.dir) ?? { x: 0, y: 0 };
  const pos = getLastValue(value.pos, prevVal, "prevVal", (context) => context?.value.pos) ?? { x: 0, y: 0 };
  const color = getLastValue(value.color, prevVal, "prevVal", (context) => context?.value.color) ?? "cornflowerblue";
  const rotate = getLastValue(value.rotate, prevVal, "prevVal", (context) => context?.value.rotate) ?? 0;
  const size = getLastValue(value.size, prevVal, "prevVal", (context) => context?.value.size) ?? 30;

  return (
    <HeadProviderContext.Provider value={{ value: { dir, pos, color, rotate, size }, prevVal }}>
      {(children && React.isValidElement(children) && React.cloneElement(children, { ref: forwardRef } as any)) || children}
    </HeadProviderContext.Provider>
  );
});

type HeadProviderContextProps = {
  value: { dir?: IDir; pos?: IPoint; color?: string; rotate?: number; size?: number };
  prevVal: HeadProviderContextProps | undefined;
};

const HeadProviderContext = React.createContext<HeadProviderContextProps>({
  value: {},
  prevVal: undefined,
});

export const useHeadProvider = () => {
  const val = React.useContext(HeadProviderContext);
  return val?.value;
};
