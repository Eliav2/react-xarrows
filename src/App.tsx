import React, { useState, useRef } from "react";
import { line, box, point } from "./types";
// import { string } from "prop-types";
import Xarrows from "./Xarrow";

const titleStyle = {
  fontSize: "40px",
  margin: "20px 0 0 20px"
};

const canvasStyle = {
  position: "relative",
  width: "90vw",
  height: "70vh",
  background: "white",
  color: "black"
};

const boxStyle = {
  position: "absolute",
  border: "1px #999 solid",
  borderRadius: "10px",
  textAlign: "center",
  width: "100px",
  height: "30px"
};

const App: React.FC = () => {
  const [boxes, setBoxes] = useState<box[]>([
    { id: "box1", x: 50, y: 30, ref: useRef(null) },
    { id: "box2", x: 230, y: 70, ref: useRef(null) },
    { id: "box3", x: 230, y: 115, ref: useRef(null) }
  ]);
  useRef(null);

  const [lines, setLines] = useState<line[]>([
    { from: "box1", to: "box2" },
    { from: "box2", to: "box3" },
    { from: "box3", to: "box1" }
  ]);

  const [lastPoint, setLastPoint] = useState<point>({ x: 0, y: 0 });

  const handlDragStart = (e: React.DragEvent) => {
    setLastPoint({ x: e.clientX, y: e.clientY });
  };

  const handleDragEnd = (e: React.DragEvent, boxId: string) => {
    let i = boxes.findIndex(box => box.id === boxId);
    let newBoxes = [...boxes];
    newBoxes[i].x += e.clientX - lastPoint.x;
    newBoxes[i].y += e.clientY - lastPoint.y;
    setBoxes(newBoxes);
  };

  return (
    <div className="App">
      <header style={titleStyle}>react-xarrows</header>
      <hr />

      <div style={canvasStyle} id="canvas">
        {boxes.map((box, i) => (
          <div
            ref={box.ref}
            id={box.id}
            key={i}
            style={{ ...boxStyle, left: box.x, top: box.y }}
            // onMouseDown={() => console.log("mouseDown!")}
            onDragStart={e => handlDragStart(e)}
            onDragEnd={e => handleDragEnd(e, box.id)}
            draggable
          >
            {box.id}
          </div>
        ))}
        <Xarrows start={boxes[0]} end={boxes[1]} />
      </div>
    </div>
  );
};

export default App;
