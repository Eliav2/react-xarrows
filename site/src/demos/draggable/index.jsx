import React, { useRef } from "react";
import Resizable from "react-true-resizable";
import Draggable from "react-draggable";

export const BoxStyle = {
  border: "solid",
  borderRadius: 12,
  width: 120,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  position: "absolute",
};

export default function ResizableAndDraggable() {
  const divRef = useRef(null);

  return (
    <div style={{ height: 50 }}>
      <Resizable nodeRef={divRef} enableRelativeOffset>
        <Draggable>
          <div style={BoxStyle} ref={divRef}>
            Resizable
          </div>
        </Draggable>
      </Resizable>
    </div>
  );
}
