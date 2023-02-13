import React, { SVGProps } from "react";
import type { RelativeSize } from "shared/types";
import { useLocatorProvider } from "./providers/LocatorProvider";

export interface XLocatorProps extends SVGProps<SVGForeignObjectElement> {
  children: React.ReactNode;

  // where to place the locator relatively to the parent
  location: RelativeSize;

  // if true, html elements will be allowed, otherwise only svg elements will be allowed
  foreignObject?: boolean;

  // the type of the component to use as the locator, default to 'foreignObject'
  component?: React.ElementType;
}

const XLocator = (props: XLocatorProps) => {
  const { getLocation } = useLocatorProvider();
  let posOffset = { x: 0, y: 0 };
  if (props.location && getLocation) {
    posOffset = getLocation?.(props.location).pos;
  }
  const { foreignObject = false, component: Component = foreignObject ? "foreignObject" : "g", children, location, ...rest } = props;
  // return <Component {...rest}>{children}</Component>;
  return (
    <Component style={{ transform: `translate(${posOffset.x}px,${posOffset.y}px)` }} {...rest}>
      {children}
    </Component>
  );
};
export default XLocator;
