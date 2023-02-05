import React from "react";
import useRerender from "shared/hooks/useRerender";
import { useUpdateXWrapper } from "react-xarrows/XWrapper";
import { usePassRef } from "shared/hooks/usePassChildrenRef";
import Draggable from "react-draggable";

interface BoxProps extends React.HTMLProps<HTMLDivElement> {
  children?: React.ReactNode;
  small?: boolean;
}

export const Box = React.forwardRef(function Box({ children, style, small, ...props }: BoxProps, forwardRef) {
  const updateXArrows = useUpdateXWrapper();
  const ref = usePassRef<HTMLDivElement>(forwardRef);
  return (
    <Draggable
      nodeRef={ref}
      onDrag={() => {
        updateXArrows();
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
          width: small ? 50 : 80,
          padding: small ? 10 : 30,
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    </Draggable>
  );
});
