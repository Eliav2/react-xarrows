import React from "react";
import useRerender from "shared/hooks/useRerender";
import { useUpdateXWrapper } from "../../../../src/redesign/XWrapper";
import { usePassRef } from "shared/hooks/usePassChildrenRef";
import Draggable from "react-draggable";

interface BoxProps extends React.HTMLProps<HTMLDivElement> {
  children?: React.ReactNode;
}

export const Box = React.forwardRef(({ children, style, ...props }: BoxProps, forwardRef) => {
  // console.log(children, "render!");
  const render = useRerender();

  const updateXArrow = useUpdateXWrapper();
  // console.log(updateXArrow);
  // const ref = useRef<HTMLDivElement>(null);
  const ref = usePassRef<HTMLDivElement>(forwardRef);
  return (
    <Draggable
      nodeRef={ref}
      // grid={[20, 20]}
      onDrag={() => {
        // console.log(children, "onDrag!");
        updateXArrow();
      }}
    >
      <div
        ref={ref}
        style={{
          border: "1px solid",
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 80,
          padding: 30,
          ...style,
        }}
        {...props}
      >
        {/*<button onClick={render}>render</button>*/}
        {children}
      </div>
    </Draggable>
  );
});
