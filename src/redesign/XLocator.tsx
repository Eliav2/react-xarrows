import React, { SVGProps } from "react";
import { RelativeSize } from "shared/types";
// import { useLocatorProvider } from "./providers/LocatorProvider";

export interface XLocatorProps extends SVGProps<SVGForeignObjectElement> {
  children: React.ReactNode;

  // if true, html elements will be allowed, otherwise only svg elements will be allowed
  foreignObject?: boolean;

  // where to place the locator relatively to the parent
  location?: RelativeSize;

  // the type of the component to use as the locator, default to 'foreignObject'
  component?: React.ElementType;
}

const XLocator = (props: XLocatorProps) => {
  // const {} = useLocatorProvider();
  const { foreignObject = false, component: Component = foreignObject ? "foreignObject" : "g", children, location, ...rest } = props;
  // return <Component {...rest}>{children}</Component>;
  return <Component {...rest}>{children}</Component>;
};
export default XLocator;
