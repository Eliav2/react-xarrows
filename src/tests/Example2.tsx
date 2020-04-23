import React, { useState, useRef } from "react";
import Xarrow from "./../Xarrow";

const canvasStyle = {
  width: "100%",
  height: "80vh",
  background: "white",
  overflow: "auto",
  display: "flex"
};

const boxContainerStyle = {
  position: "relative",
  overflow: "auto",
  width: "120%",
  height: "120%",
  background: "white",
  color: "black",
  border: "black solid 1px"
};

const wideBox = {
  position: "absolute",
  border: "1px #999 solid",
  borderRadius: "10px",
  textAlign: "center",
  width: "100px",
  height: "30px"
};

const tallBox = {
  position: "absolute",
  border: "1px #999 solid",
  borderRadius: "10px",
  textAlign: "center",
  width: "30px",
  height: "100px",
  writingMode: "vertical-rl",
  textOrientation: "mixed"
};

const Example2: React.FC = () => {
  const [boxes, setBoxes] = useState<box[]>([
    { id: "box1", x: 100, y: 350, ref: useRef(null), shape: wideBox },
    { id: "box2", x: 400, y: 200, ref: useRef(null), shape: tallBox },
    { id: "box3", x: 500, y: 80, ref: useRef(null), shape: wideBox }
  ]);

  const getBoxById = boxId => boxes.find(b => b.id === boxId).ref;

  const [lines, setLines] = useState<line[]>([
    {
      start: getBoxById("box1"),
      end: getBoxById("box2"),
      headSize: 20,
      label: { end: { text: "endLable!", extra: { fill: "purple", dx: -30 } } },
      endAnchor: ["left", "right"],
      curveness: 1.5
    },
    {
      start: getBoxById("box2"),
      end: getBoxById("box3"),
      // startAnchor: "right",
      // endAnchor: "bottom",
      headSize: 10,
      curveness: 4,
      color: "red",
      label: { start: "startLabel", middle: "middleLable", end: "endLable" },
      dashness: { animation: 1 }
    },
    {
      start: getBoxById("box1"),
      end: getBoxById("box3"),
      // end: null,
      color: "green",
      label: { middle: { text: "I'm just a line", extra: { dy: -8 } } },
      // endAnchor: "top",
      headSize: 0,
      strokeWidth: 10
      // endAnchor: "middle",
      // startAnchor: "middle"
    }
  ]);

  const [lastPoint, setLastPoint] = useState<point>({ x: 0, y: 0 });

  const handlDragStart = (e: React.DragEvent) => {
    setLastPoint({ x: e.clientX, y: e.clientY });
  };

  const handleDragEnd = (e: React.DragEvent, boxId: string) => {
    let i = boxes.findIndex(box => box.id === boxId);
    let newBoxes = [...boxes];
    let newX = newBoxes[i].x + e.clientX - lastPoint.x,
      newY = newBoxes[i].y + e.clientY - lastPoint.y;
    if (newX < 0 || newY < 0) return;
    newBoxes[i].x = newX;
    newBoxes[i].y = newY;
    setBoxes(newBoxes);
  };

  return (
    <React.Fragment>
      <p>example2:</p>
      <div style={canvasStyle} id="canvas">
        <div style={boxContainerStyle} id="boxContainerConatinerStyle">
          <div style={boxContainerStyle} id="boxContainerStyle">
            {boxes.map((box, i) => (
              <div
                ref={box.ref}
                key={box.id}
                style={{ ...box.shape, left: box.x, top: box.y }}
                onDragStart={e => handlDragStart(e)}
                onDragEnd={e => handleDragEnd(e, box.id)}
                draggable
              >
                {box.id}
              </div>
            ))}
            {lines.map((line, i) => (
              <Xarrow key={i} {...line} />
            ))}
          </div>
        </div>
      </div>
      <br />
    </React.Fragment>
  );
};

export default Example2;
