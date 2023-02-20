import React, { LegacyRef } from "react";
import usePassChildrenRef from "shared/hooks/usePassChildrenRef";
import { isReactForwardRef } from "shared/utils";

/**
 * receives a children(which can be jsx or react component) and props and returns jsx element.
 * if children is a function, it will be called with props and the result will be returned (render children pattern).
 */
export const childrenRenderer = <C extends React.ReactNode = React.ReactNode, Props extends any = any>(
  children: C | ((props: Props) => C) | React.ForwardRefExoticComponent<any>,
  props: Props = {} as any,
  ref?: LegacyRef<any>
): React.ReactNode => {
  // console.log("childrenRenderer");
  if (Array.isArray(children)) return children;

  if (typeof children === "function") {
    // console.log("childrenRenderer renders function");
    return childrenPassRef(children(props), ref);
  }
  // handle forwardRef components
  if (isReactForwardRef(children)) {
    // console.log("childrenRenderer renders isReactForwardRef");
    // @ts-ignore
    return children.render(props, ref);
  }

  return childrenPassRef(children, ref);
};

// pass ref to the inner children if possible (if a single ReactElement, and not array,string,number,etc)
export const childrenPassRef = (children: React.ReactNode, ref?: LegacyRef<any>) => {
  // console.log("childrenPassRef", children, isReactForwardRef(children));
  return (children && ref && React.isValidElement(children) && React.cloneElement(children, { ref } as any)) || children;
  // return children;
};

// interface ChildrenProps {
//   children?: React.ReactNode;
//
//   // [key: string]: any;
// }
//
// const Children = React.forwardRef(function Children({ children }: ChildrenProps, forwardRef) {
//   const childRef = usePassChildrenRef(children);
//
//   const c = childrenRenderer(children, forwardRef ?? childRef);
//   console.log(c);
//   return c as any;
//   // return <>{c}</>; // ts: why is this needed?
// });
//
// export default Children;
