import React, { useRef } from "react";
import { XArrow, XLine, XWrapper, useUpdateXWrapper } from "react-xarrows";
import Draggable from "react-draggable";

export default function DraggableExample() {
  const box1Ref = useRef(null);
  const box2Ref = useRef(null);
  return (
    <XWrapper>
      <div style={{ display: "flex", justifyContent: "space-evenly" }}>
        <DraggableBox ref={box1Ref}>Box1</DraggableBox>
        <DraggableBox ref={box2Ref}>Box2</DraggableBox>
        <XArrow start={box1Ref} end={box2Ref}>
          <XLine />
        </XArrow>
      </div>
    </XWrapper>
  );
}

export const DraggableBox = React.forwardRef(function Box({ children, ...props }, forwardRef) {
  const updateXArrow = useUpdateXWrapper();
  return (
    <Draggable
      onDrag={() => {
        updateXArrow();
      }}
    >
      <div ref={forwardRef} style={BoxStyle} {...props}>
        {children}
      </div>
    </Draggable>
  );
});

export const BoxStyle = {
  border: "solid",
  borderRadius: 12,
  width: 120,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
};
