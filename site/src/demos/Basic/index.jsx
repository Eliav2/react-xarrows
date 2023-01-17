import React, { useRef } from "react";
import XArrow from "react-xarrows/XArrow";
import XLine from "react-xarrows/XLine";

export default function BasicExample() {
  const box1Ref = useRef(null);
  const box2Ref = useRef(null);
  return (
    <div style={{ display: "flex", justifyContent: "space-evenly" }}>
      <div ref={box1Ref} style={BoxStyle}>
        Box1
      </div>
      <div ref={box2Ref} style={BoxStyle}>
        Box2
      </div>
      <XArrow start={box1Ref} end={box2Ref}>
        <XLine />
      </XArrow>
    </div>
  );
}

export const BoxStyle = {
  border: "solid",
  borderRadius: 12,
  width: 120,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
};
