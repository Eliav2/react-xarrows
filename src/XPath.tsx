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
import useStableUIValue from "shared/hooks/useStableUIValue";

export interface XPathProps extends React.SVGProps<SVGPathElement> {
  children?: React.ReactNode;
  offsetEnd?: RelativeSize; // how much of the end of the line should be removed
  offsetStart?: RelativeSize; // how much of the start of the line should be removed
  component?: React.ElementType<XPathProps>;
  color?: string;
}

export const XPath = React.forwardRef((props: XPathProps, forwardRef: React.ForwardedRef<SVGElement>) => {
  // console.log("XPath");
  let {
    component: Component = "path" as const,
    // stripEnd,
    // stripStart,
    color = "cornflowerblue",
    strokeWidth = 3,
    offsetEnd = 0,
    offsetStart = 0,
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

  const [pathLength, setPathLength] = useState<number | null>(null);
  useLayoutEffect(() => {
    const currentLength = pathRef.current?.getTotalLength();
    if (!isEqual(pathLength, currentLength)) {
      setPathLength(currentLength);
    }
  });

  function getDirectionOnPath(length, delta = 1) {
    const point = pathRef.current.getPointAtLength(length);
    const nextPoint = pathRef.current.getPointAtLength(length + delta);
    const deltaX = nextPoint.x - point.x;
    const deltaY = nextPoint.y - point.y;
    const angleInDegrees = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;
    return new Dir(`${angleInDegrees}deg`);
  }

  const getLocation = (location: RelativeSize) => {
    if (!pathRef.current) return { pos: undefined, dir: new Dir("0deg") };
    const currentLength = pathRef.current?.getTotalLength() ?? 0;
    const l = getRelativeSizeValue(location, currentLength ?? 0);
    return {
      pos: pathRef.current?.getPointAtLength(l),
      dir: getDirectionOnPath(l),
    };
  };

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
