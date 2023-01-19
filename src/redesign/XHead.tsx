import React, { LegacyRef } from "react";
import { svgElemStrType } from "../types";
import { IDir, IPoint } from "./types/types";
import { getBBox } from "./NormalizedGSvg";
import { Dir } from "./path";
import { usePositionProvider } from "./PositionProvider";
import { BasicHeadShape1 } from "./shapes";

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
  const { startPoint, endPoint } = usePositionProvider();
  let {
    children = <BasicHeadShape1 />,
    containerRef,
    pos = endPoint ?? { x: 0, y: 0 },
    dir = new Dir((endPoint?.x ?? 0) - (startPoint?.x ?? 0), (endPoint?.y ?? 0) - (startPoint?.y ?? 0)),
    rotate = 0,
  } = props;

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
XHead.defaultProps = {
  size: 30,
  // children: arrowShapes.arrow1.svgElem,
  color: "cornflowerBlue",
  rotate: 0,
};

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
  };
}

const HeadProvider = React.forwardRef(function HeadProvider({ children }: HeadProviderProps, forwardRef) {
  return (
    <HeadProviderContext.Provider value={{}}>
      {(children && React.isValidElement(children) && React.cloneElement(children, { ref: forwardRef } as any)) || children}
    </HeadProviderContext.Provider>
  );
});

type HeadProviderContextProps = {
  dir?: IDir;
};
const HeadProviderContext = React.createContext<HeadProviderContextProps>({});

export const useHeadProvider = () => {
  const val = React.useContext(HeadProviderContext);
  return val;
};
