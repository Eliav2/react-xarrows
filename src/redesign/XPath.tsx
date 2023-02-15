import React, { useEffect, useLayoutEffect, useState } from "react";
import { RelativeSize } from "shared/types";
import { getRelativeSizeValue, pick } from "shared/utils";
import { Dir, Vector } from "./path/vector";
import { usePositionProvider } from "./providers/PositionProvider";
import { useBestPath } from "./BestPath";
import { PositionProvider, useHeadProvider, usePathProvider, useXArrow } from "./index";
import { usePointsProvider } from "./providers/PointsProvider";
import HeadProvider from "./providers/HeadProvider";
import LocatorProvider from "./providers/LocatorProvider";
import { usePassRef } from "shared/hooks/usePassChildrenRef";
import useRerender from "shared/hooks/useRerender";
import isEqual from "react-fast-compare";
import { positionType } from "shared/hooks/usePosition";

export interface XPathProps extends React.SVGProps<SVGPathElement> {
  children?: React.ReactNode;
  // stripEnd?: RelativeSize; // how much of the end of the line should be removed
  // stripStart?: RelativeSize; // how much of the start of the line should be removed
  component?: React.ElementType<XPathProps>;
  color?: string;
}

export const XPath = React.forwardRef((props: XPathProps, forwardRef: React.ForwardedRef<SVGElement>) => {
  console.log("XPath");
  let {
    component: Component = "path" as const,
    // stripEnd,
    // stripStart,
    color = "cornflowerblue",
    strokeWidth = 3,
    ...p
  } = props;
  // const positionProvider = usePositionProvider();

  const reRender = useRerender();
  const { points } = usePointsProvider();
  const { pointsToPath } = usePathProvider();
  // console.log(points?.at(-1)?.x);
  // const headProvider = useHeadProvider();
  // console.log(headProvider?.size);
  // let { points = pointsProvider.points, pointToPath, endDir } = useBestPath();
  // console.log(points);

  const d = pointsToPath?.(points);

  // console.log("Xpath");
  const pathRef = usePassRef(forwardRef);
  useLayoutEffect(() => {
    reRender();
    console.log(pathRef.current?.getTotalLength());
  }, [pathRef.current]);

  // const [pathLength, setPathLength] = useState<number | null>(null);
  const prevPathLength = React.useRef<number | null>(null);

  // useLayoutEffect(() => {
  //   const currentLength = pathRef.current?.getTotalLength();
  //
  //   // console.log(currentPos);
  //   if (!isEqual(pathLength, currentLength)) {
  //     setPathLength(currentLength);
  //   }
  // }, [pathRef.current, pathLength]);

  // const { render: renderXArrow } = useXArrow();

  // useLayoutEffect(() => {
  //   renderXArrow();
  // }, [pathRef.current?.getTotalLength()]);

  const getLocation = (location: RelativeSize) => {
    const currentLength = pathRef.current?.getTotalLength() ?? 0;
    // if (prevPathLength.current !== currentLength) {
    //   prevPathLength.current = currentLength;
    //   // renderXArrow();
    // }
    console.log("getLocation", currentLength);
    const l = getRelativeSizeValue(location, currentLength ?? 0);
    return { pos: pathRef.current?.getPointAtLength(l) };
  };

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
        ref={pathRef as React.ForwardedRef<SVGPathElement>}
        d={d}
        color={color}
        fill="transparent"
        stroke={color}
        strokeWidth={strokeWidth}
        {...p}
      />
      <LocatorProvider value={{ getLocation: getLocation }}>{props.children}</LocatorProvider>
    </>
  );
});
export default XPath;
