import React, { useRef, useState } from "react";
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

export default function handleStyles() {
  return (
    <Resizable
      handlesStyle={{
        top: { background: "red" },
        topLeft: { background: "green" },
        bottomLeft: { background: "green" },
        topRight: { background: "green" },
        bottomRight: { background: "green" },
      }}
      handleStyle={{ background: "blue" }}
      enabledHandles={["top", "left", "bottom", "right", "topLeft", "bottomLeft", "bottomRight", "topRight"]}
    >
      <div style={BoxStyle}>Resizable</div>
    </Resizable>
  );
}
