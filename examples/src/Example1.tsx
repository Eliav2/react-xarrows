import React, { useState, useRef } from "react";
import Xarrow from "react-xarrows";

const canvasStyle = {
  width: "100%",
  height: "40vh",
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

const boxStyle = {
  position: "absolute",
  border: "1px #999 solid",
  borderRadius: "10px",
  textAlign: "center",
  width: "100px",
  height: "30px"
};

const Example1: React.FC = () => {
  const [boxes, setBoxes] = useState([
    { id: "box1", x: 50, y: 20, ref: useRef(null) },
    { id: "box2", x: 20, y: 150, ref: useRef(null) },
    { id: "box3", x: 250, y: 80, ref: useRef(null) }
  ]);

  const [lines, setLines] = useState([
    {
      from: "box1",
      to: "box2",
      props: { headSize: 14, label: { end: { text: "endLable!", extra: { fill: "orange" } } } }
    },
    { from: "box2", to: "box3", props: { color: "red", label: "I am a line!", headSize: 0 } },
    {
      from: "box3",
      to: "box1",
      props: { color: "green", dashness: { animation: 1 }, startAnchor: "top" }
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
      <h3>
        <u>Example1:</u>
      </h3>
      <p>automatic anchoring to the minimal length. works also when inside scrollable window</p>
      <div style={canvasStyle} id="canvas">
        <div style={boxContainerStyle} id="boxContainerConatinerStyle">
          <div style={boxContainerStyle} id="boxContainerStyle">
            {boxes.map((box, i) => (
              <div
                ref={box.ref}
                key={i}
                style={{ ...boxStyle, left: box.x, top: box.y }}
                onDragStart={e => handlDragStart(e)}
                onDragEnd={e => handleDragEnd(e, box.id)}
                draggable
              >
                {box.id}
              </div>
            ))}
            {lines.map((line, i) => (
              <Xarrow
                key={i}
                start={boxes.find(box => box.id === line.from).ref}
                end={boxes.find(box => box.id === line.to).ref}
                {...line.props}
              />
            ))}
          </div>
        </div>
      </div>
      <br />
    </React.Fragment>
  );
};

export default Example1;
