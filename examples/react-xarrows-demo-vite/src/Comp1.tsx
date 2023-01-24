import React from "react";
import { RelativeSize } from "shared/types";
import { getRelativeSizeValue } from "shared/utils";

export interface Comp1Props extends React.SVGProps<SVGLineElement> {
  children?: React.ReactNode;
  stripEnd?: RelativeSize; // how much of the end of the line should be removed
  stripStart?: RelativeSize; // how much of the start of the line should be removed
  component?: React.ElementType<Comp1Props>;
  color?: string;
}

export const Comp1 = (props: Comp1Props) => {
  let {
    component: Component = "div" as const,
    children,
    ...p
  } = props;

  return (
    <>
      <Component
        {...p}
      />
        {children}
    </>
  );
};
export default Comp1;

Comp1.defaultProps = {
  component: "line",
  color: "cornflowerblue",
  strokeWidth: 3,
};
