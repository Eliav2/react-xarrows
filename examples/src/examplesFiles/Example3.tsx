import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { line, box, point } from "./types";
// import Xarrows from "../src/Xarrow";
import Xarrow from "react-xarrows";

const canvasStyle = {
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
  height: "30px"
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

const Example3: React.FC = () => {
  const [boxes, setBoxes] = useState<box[]>([
    //this initiazid values are precentage - next it will be pixels
    { id: "box1", x: 20, y: 20, ref: useRef(null) },
    { id: "box2", x: 20, y: 80, ref: useRef(null) }
  ]);

  const [boxes2, setBoxes2] = useState<box[]>([
    { id: "box3", x: 20, y: 20, ref: useRef(null) },
    { id: "box4", x: 20, y: 80, ref: useRef(null) }
  ]);

  const [lines, setLines] = useState<line[]>([
    { from: "box4", to: "box1" }
    // { from: "box3", to: "box2" }
  ]);
  const boxContainerRef = useRef(null); //boxContainerRef
  const boxContainer2Ref = useRef(null); //boxContainerRef

  const getRefById = Id => {
    var ref;
    [...boxes, ...boxes2].forEach(box => {
      if (box.id === Id) ref = box.ref;
    });
    return ref;
  };

  useEffect(() => {
    let { scrollHeight: h1, scrollWidth: w1 } = boxContainerRef.current;
    let { scrollHeight: h2, scrollWidth: w2 } = boxContainer2Ref.current;
    setBoxes(boxes => boxes.map(box => ({ ...box, x: 0.01 * box.x * w1, y: 0.01 * box.y * h1 })));
    setBoxes2(boxes => boxes.map(box => ({ ...box, x: 0.01 * box.x * w2, y: 0.01 * box.y * h2 })));
  }, []);

  return (
    <React.Fragment>
      <h3>
        <u>Example3:</u>
      </h3>
      <p> at will work any way! but look it the console...</p>
      <div style={canvasStyle} id="canvas">
        <div ref={boxContainerRef} style={boxContainerStyle} id="boxContainer">
          {boxes.map((box, i) => (
            <Box key={i} box={box} boxes={boxes} setBoxes={setBoxes} />
          ))}
        </div>
        <div style={boxContainerContainerStyle} id="boxContainerContainer2Container">
          <div style={boxContainerContainerStyle} id="boxContainerContainer2">
            <div style={boxContainerContainerStyle} id="boxContainerContainer2">
              <div ref={boxContainer2Ref} style={boxContainerStyle} id="boxContainer2">
                {boxes2.map((box, i) => (
                  <Box key={i} box={box} boxes={boxes2} setBoxes={setBoxes2} />
                ))}
              </div>
            </div>
            {lines.map((line, i) => (
              <Xarrow
                key={i}
                start={getRefById(line.from)}
                end={getRefById(line.to)}
                monitorDOMchanges={true}
              />
            ))}
          </div>
        </div>
      </div>
      <p>
        {" "}
        whenever Xarrow will detect not recommanded element to be placed in(relative to the anchors)
        it will console a warning. here we can see Xarrow recommands to move Xarrow under "canvas"
        element.
      </p>
    </React.Fragment>
  );
};

export default Example3;
