import React, { useState, useRef } from "react";
import Xarrow from "react-xarrows";
import Draggable from "react-draggable";

const canvasStyle = {
  width: "100%",
  height: "40vh",
  background: "white",
  overflow: "auto",
  display: "flex",
  position: "relative",
  color: "black",
};

const boxStyle = {
  position: "absolute",
  border: "1px #999 solid",
  borderRadius: "10px",
  textAlign: "center",
  width: "100px",
  height: "30px",
  // color: "black",
};

const Example1 = () => {
  const [boxes, setBoxes] = useState([
    { id: "box1", x: 50, y: 20, ref: useRef(null) },
    { id: "box2", x: 20, y: 250, ref: useRef(null) },
    { id: "box3", x: 350, y: 80, ref: useRef(null) },
  ]);

  const [lines] = useState([
    {
      from: "box1",
      to: "box2",
      headSize: 14,
      label: { end: "endLable" },
    },
    {
      from: "box2",
      to: "box3",
      color: "red",
      label: {
        middle: (
          <div contenteditable="true" style={{ font: "italic 1.5em serif", color: "purple" }}>
            Editable label
          </div>
        ),
      },
      headSize: 0,
      strokeWidth: 15,
    },
    {
      from: "box3",
      to: "box1",
      color: "green",
      dashness: { animation: 1 },
      path: "grid",
    },
  ]);

  return (
    <React.Fragment>
      <h3>
        <u>Example1:</u>
      </h3>
      <p>
        automatic anchoring to the minimal length. works also when inside scrollable window. drag the boxes to play
        around.
      </p>
      <div style={canvasStyle} id="canvas">
        {boxes.map((box, i) => (
          <Draggable onDrag={() => setBoxes([...boxes])} key={i}>
            <div ref={box.ref} style={{ ...boxStyle, left: box.x, top: box.y }}>
              {box.id}
            </div>
          </Draggable>
        ))}
        {lines.map((line, i) => (
          <Xarrow
            key={i}
            start={boxes.find((box) => box.id === line.from).ref}
            end={boxes.find((box) => box.id === line.to).ref}
            {...line}
          />
        ))}
      </div>
      <br />
    </React.Fragment>
  );
};

export default Example1;
