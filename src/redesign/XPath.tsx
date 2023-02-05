import React, { useEffect } from "react";
import { RelativeSize } from "shared/types";
import { getRelativeSizeValue } from "shared/utils";
import { Dir, Vector } from "./path/vector";
import { PositionProviderImperativeProps, usePositionProvider } from "./providers/PositionProvider";
import { useBestPath } from "./BestPath";
import { PositionProvider, useHeadProvider, usePathProvider } from "./index";
import { usePointsProvider } from "./providers/PointsProvider";
import HeadProvider from "./providers/HeadProvider";

export interface XPathProps extends React.SVGProps<SVGPathElement> {
  children?: React.ReactNode;
  // stripEnd?: RelativeSize; // how much of the end of the line should be removed
  // stripStart?: RelativeSize; // how much of the start of the line should be removed
  component?: React.ElementType<XPathProps>;
  color?: string;
}

export const XPath = React.forwardRef((props: XPathProps, ref: React.ForwardedRef<SVGElement>) => {
  // console.log("XPath");
  let {
    component: Component = "path" as const,
    // stripEnd,
    // stripStart,
    color = "cornflowerblue",
    strokeWidth = 3,
    ...p
  } = props;
  // const positionProvider = usePositionProvider();
  const { points } = usePointsProvider();
  const { pointsToPath } = usePathProvider();
  // console.log(points?.at(-1)?.x);
  // const headProvider = useHeadProvider();
  // console.log(headProvider?.size);
  // let { points = pointsProvider.points, pointToPath, endDir } = useBestPath();
  // console.log(points);

  const d = pointsToPath?.(points);

  // const positionProviderRef = React.useRef<PositionProviderImperativeProps>(null);
  // // console.log(positionProviderRef);
  //
  // useEffect(() => {
  //   // console.log("XPath useEffect");
  //   positionProviderRef?.current?.sayHello();
  // }, []);

  return (
    <>
      <Component
        ref={ref as React.ForwardedRef<SVGPathElement>}
        d={d}
        color={color}
        fill="transparent"
        stroke={color}
        strokeWidth={strokeWidth}
        {...p}
      />
      {/*<HeadProvider*/}
      {/*  // value={{*/}
      {/*  //   dir: endDir,*/}
      {/*  //   color,*/}
      {/*  //   // pos: (pos) => {*/}
      {/*  //   //   // console.log("XPath HeadProvider pos", pos);*/}
      {/*  //   //   return { ...pos, x: pos.x - 37.5 };*/}
      {/*  //   // },*/}
      {/*  // }}*/}
      {/*  value={(val) => {*/}
      {/*    // console.log(val);*/}
      {/*    // if (val.pos) val.pos.y += 10;*/}
      {/*    // val.dir = { x: pos?.endPoint.x - pos?.startPoint.x, y: pos?.endPoint.y - pos?.startPoint.y };*/}
      {/*    val.dir = endDir;*/}
      {/*    // if (endDir) val.pos = new Vector(val.pos).sub(new Dir(endDir).mul(30));*/}
      {/*    return val;*/}
      {/*  }}*/}
      {/*  // locationProvider={positionProviderRef}*/}
      {/*>*/}
      {props.children}
      {/*</HeadProvider>*/}
      {/*</PositionProvider>*/}
    </>
  );
});
export default XPath;
