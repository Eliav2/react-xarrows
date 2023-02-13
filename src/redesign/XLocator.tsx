import React, { SVGProps } from "react";
import type { RelativeSize } from "shared/types";
import { useLocatorProvider } from "./providers/LocatorProvider";
import { Dir, Vector } from "./path";

export interface XLocatorProps extends SVGProps<SVGForeignObjectElement> {
  children: React.ReactNode;

  // where to place the locator relatively to the parent
  location: RelativeSize;

  // if true, html elements will be allowed, otherwise only svg elements will be allowed
  allowHtmlElements?: boolean;

  // the type of the component to use as the locator, default to 'foreignObject'
  component?: React.ElementType;

  //if true, the locator will be rotated to match the direction provided by the locator provider
  enableRotation?: boolean;
}

const XLocator = (props: XLocatorProps) => {
  const { getLocation } = useLocatorProvider();
  let posOffset: Vector = new Vector({ x: 0, y: 0 });
  let dirOffset: Dir = new Dir({ x: 0, y: 0 });
  if (getLocation) {
    ({ pos: posOffset, dir: dirOffset } = getLocation?.(props.location));
  }
  const {
    allowHtmlElements = false,
    component: Component = allowHtmlElements ? "foreignObject" : "g",
    children,
    location,
    enableRotation = true,
    ...rest
  } = props;
  let transform = `translate(${posOffset.x}px,${posOffset.y}px)`;
  if (enableRotation) {
    transform += ` rotate(${dirOffset.toDegree()}deg)`;
  }
  return (
    <Component style={{ transform }} {...rest}>
      {children}
    </Component>
  );
};
export default XLocator;
