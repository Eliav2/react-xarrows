import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { line, box, point } from "./types";
import Xarrows from "../src/Xarrow";
// var Xarrows = require("../src/Xarrow");

const canvasStyle: React.CSSProperties = {
  width: "100%",
  height: "40vh",
  background: "white",
  overflow: "auto",
  display: "flex",
  position: "relative"
};

const boxStyle = {
  position: "absolute",
  border: "1px #999 solid",
  borderRadius: "10px",
  textAlign: "center",
  width: "100px",
  height: "30px",
  color: "black"
};

const Box: React.FC = props => {
  const [lastPoint, setLastPoint] = useState<point>({ x: 0, y: 0 });

  const handlDragStart = (e: React.DragEvent) => {
    setLastPoint({ x: e.clientX, y: e.clientY });
  };

  const handleDragEnd = (e: React.DragEvent, boxId: string) => {
    let i = props.boxes.findIndex(box => box.id === boxId);
    let newBoxes = [...props.boxes];
    let newX = newBoxes[i].x + e.clientX - lastPoint.x,
      newY = newBoxes[i].y + e.clientY - lastPoint.y;
    if (newX < 0 || newY < 0) return;
    newBoxes[i].x = newX;
    newBoxes[i].y = newY;
    props.setBoxes(newBoxes);
  };

  return (
    <div
      ref={props.box.ref}
      id={props.box.id}
      style={{ ...boxStyle, left: props.box.x, top: props.box.y }}
      onDragStart={e => handlDragStart(e)}
      onDragEnd={e => handleDragEnd(e, props.box.id)}
      draggable
    >
      {props.box.id}
    </div>
  );
};

const Example5: React.FC = () => {
  const [box, setBox] = useState<box>({ id: "box1", x: 20, y: 20, ref: useRef(null) });
  const [box2, setBox2] = useState<box>({ id: "box2", x: 50, y: 30, ref: useRef(null) });
  const [lines, setLines] = useState<line[]>([
    { from: "box1", to: "box2" }
    // { from: "box3", to: "box2" }
  ]);

  return (
    <React.Fragment>
      <h3>
        <u>Example4:</u>
      </h3>
      <p> in debug stage</p>
      <div style={canvasStyle} id="canvas" />
      <div>
        <Box box={box} boxes={box} setBoxes={setBox} />
        <Box box={box2} boxes={box2} setBoxes={setBox2} />
      </div>
      {lines.map((line, i) => (
        <Xarrows key={i} start={box} end={box2.ref} />
      ))}
    </React.Fragment>
  );
};

export default Example5;
