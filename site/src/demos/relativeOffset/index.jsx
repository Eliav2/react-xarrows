import React from "react";
import Resizable from "react-true-resizable";

export const BoxStyle = {
  border: "solid",
  borderRadius: 12,
  width: 120,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
};

export default function RelativeOffset() {
  return (
    <Resizable enableRelativeOffset>
      <div style={{ ...BoxStyle, position: "relative" }}>Resizable</div>
    </Resizable>
  );
}
