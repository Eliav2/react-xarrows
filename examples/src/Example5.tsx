import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { line, box, point } from "./types";
// import Xarrows from "../src/Xarrow";
import Xarrow from "react-xarrows";

const canvasStyle: React.CSSProperties = {
  width: "100%",
  height: "40vh",
  background: "white",
  overflow: "auto",
  display: "flex",
  position: "relative"
  // overflowY: "scroll",
  // overflowX: "hidden"
};

const boxContainerStyle = {
  position: "relative",
  // overflow: "scroll",
  width: "120%",
  height: "140%",
  background: "white",
  color: "black",
  border: "black solid 1px"
};

const boxContainerContainerStyle = {
  overflow: "scroll",
  width: "150%",
  height: "120%",
  border: "black solid 1px"
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
    let newBox = { ...props.box };
    let newX = newBox.x + e.clientX - lastPoint.x,
      newY = newBox.y + e.clientY - lastPoint.y;
    if (newX < 0 || newY < 0) return;
    newBox.x = newX;
    newBox.y = newY;
    props.setBox(newBox);
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
  // console.log(Xarrows.)

  return (
    <React.Fragment>
      <h3>
        <u>Example5:</u>
      </h3>
      <p> in debug stage</p>
      <div style={canvasStyle} id="canvas">
        <Box box={box} boxes={box} setBox={setBox} />
        <Box box={box2} boxes={box2} setBox={setBox2} />
        {lines.map((line, i) => (
          <Xarrow key={i} start={box.ref} end={box2.ref} />
        ))}
      </div>
    </React.Fragment>
  );
};

export default Example5;
