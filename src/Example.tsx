import React, { useState, useRef, useEffect } from "react";
import Xarrow, { xarrowPropsType, anchorType } from "./Xarrow";
import PlayGround from "./PlayGround/PlayGround";

const Box: React.FC = props => {
  const boxStyle = {
    position: "absolute",
    background: "white",
    border: "1px #999 solid",
    borderRadius: "10px",
    textAlign: "center",
    width: "100px",
    height: "30px",
    color: "black"
  };

  const [lastPoint, setLastPoint] = useState({ x: 0, y: 0 });

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

const Example1: React.FC = () => {
  const canvasStyle = {
    width: "100%",
    height: "40vh",
    background: "white",
    overflow: "auto",
    display: "flex",
    position: "relative"
  };

  const [box, setBox] = useState({ id: "box1", x: 20, y: 20, ref: useRef(null) });
  const [box2, setBox2] = useState({ id: "box2", x: 120, y: 120, ref: useRef(null) });

  const [color, setColor] = useState("red");
  const [lineColor, setLineColor] = useState(null);
  const [headColor, setHeadColor] = useState(null);
  const [curveness, setCurveness] = useState(0.8);
  const [strokeWidth, setStrokeWidth] = useState(4);
  const [headSize, setHeadSize] = useState(6);
  const [startAnchor, setStartAnchor] = useState<anchorType[]>(["auto"]);
  const [endAnchor, setEndAnchor] = useState<anchorType>(["auto"]);
  const [dashed, setDashed] = useState(false);
  const [animation, setAnimation] = useState(0);

  const colorOptions = ["red", "BurlyWood", "CadetBlue", "Coral"];
  const bodyColorOptions = [null, ...colorOptions];
  const anchorsTypes = ["left", "right", "top", "bottom", "middle", "auto"];

  var props: xarrowPropsType = {
    start: "box1", //  can be string
    end: box2.ref, //  or reference
    startAnchor: startAnchor,
    endAnchor: endAnchor,
    curveness: curveness,
    color: color,
    lineColor: lineColor,
    headColor: headColor,
    strokeWidth: strokeWidth,
    headSize: headSize,
    // dashness: true   // cab be simply boolean or object
    dashness: dashed ? { animation } : false,
    // label: "middle"  //can be simply string of middle label
    label: {
      start: "start",
      end: { text: "end", extra: { fill: "blue", dy: -10 } }
    },
    monitorDOMchanges: false,
    registerEvents: [],
    consoleWarning: true,
    advanced: { extendSVGcanvas: 0 }
  };

  useEffect(() => {}, []);

  return (
    <div>
      <p>example1:</p>
      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", marginRight: 20 }}>
          <p>startAnchor: </p>
          <div>
            {anchorsTypes.map((anchor, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", height: 25 }}>
                <p>{anchor}</p>
                <input
                  style={{ height: "15px", width: "15px" }}
                  type="checkBox"
                  checked={startAnchor.includes(anchor) ? true : false}
                  // value={}
                  onChange={e => {
                    if (e.target.checked) {
                      setStartAnchor([...startAnchor, anchor]);
                    } else {
                      let a = [...startAnchor];
                      a.splice(startAnchor.indexOf(anchor), 1);
                      setStartAnchor(a);
                    }
                  }}
                />
              </div>
            ))}
          </div>
        </div>{" "}
        <div style={{ display: "flex", alignItems: "center", marginLeft: 20 }}>
          <p>endAnchor: </p>
          <div>
            {anchorsTypes.map((anchor, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", height: 25 }}>
                <p>{anchor}</p>
                <input
                  style={{ height: "15px", width: "15px" }}
                  type="checkBox"
                  checked={endAnchor.includes(anchor) ? true : false}
                  // value={}
                  onChange={e => {
                    if (e.target.checked) {
                      setEndAnchor([...endAnchor, anchor]);
                    } else {
                      let a = [...endAnchor];
                      a.splice(endAnchor.indexOf(anchor), 1);
                      setEndAnchor(a);
                    }
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <table style={{ marginRight: "auto", marginLeft: "auto" }}>
        <tbody>
          <tr>
            <td>
              <div style={{ display: "flex", alignItems: "center" }}>
                <p>arrow color(all): </p>
                <select onChange={e => setColor(e.target.value)}>
                  {colorOptions.map((o, i) => (
                    <option key={i}>{o}</option>
                  ))}
                </select>
              </div>
            </td>
            <td>
              <div style={{ display: "flex", alignItems: "center" }}>
                <p>stroke color: </p>
                <select onChange={e => setLineColor(e.target.value)}>
                  {bodyColorOptions.map((o, i) => (
                    <option key={i}>{o}</option>
                  ))}
                </select>
              </div>
            </td>
            <td>
              <div style={{ display: "flex", alignItems: "center" }}>
                <p>head color: </p>
                <select onChange={e => setHeadColor(e.target.value)}>
                  {bodyColorOptions.map((o, i) => (
                    <option key={i}>{o}</option>
                  ))}
                </select>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div style={{ display: "flex", alignItems: "center" }}>
                <p>curveness: </p>
                <input
                  style={{ width: "30px" }}
                  type="text"
                  value={curveness}
                  onChange={e => setCurveness(e.target.value)}
                />
              </div>
            </td>
            <td>
              <div style={{ display: "flex", alignItems: "center" }}>
                <p>strokeWidth: </p>
                <input
                  style={{ width: "30px" }}
                  type="text"
                  value={strokeWidth}
                  onChange={e => setStrokeWidth(e.target.value)}
                />
              </div>
            </td>
            <td>
              <div style={{ display: "flex", alignItems: "center" }}>
                <p>headSize: </p>
                <input
                  style={{ width: "30px" }}
                  type="text"
                  value={headSize}
                  onChange={e => setHeadSize(e.target.value)}
                />
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div style={{ display: "flex", alignItems: "center" }}>
                <p>dashed: </p>
                <input
                  style={{ height: "15px", width: "15px" }}
                  type="checkBox"
                  checked={dashed}
                  onChange={e => setDashed(e.target.checked ? true : false)}
                />
              </div>
            </td>
            <td>
              <div style={{ display: "flex", alignItems: "center" }}>
                <p>animation: </p>
                <input
                  style={{ width: "30px" }}
                  type="text"
                  value={animation}
                  onChange={e => setAnimation(e.target.value)}
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <br />
      <div style={canvasStyle} id="canvas">
        <Box box={box} setBox={setBox} />
        <Box box={box2} setBox={setBox2} />
        <Xarrow {...props} />
      </div>
    </div>
  );
};

const Example2: React.FC = () => {
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

  const [boxes, setBoxes] = useState<box[]>([
    { id: "box1", x: 100, y: 80, ref: useRef(null), shape: wideBox },
    { id: "box2", x: 300, y: 300, ref: useRef(null), shape: tallBox },
    { id: "box3", x: 500, y: 180, ref: useRef(null), shape: wideBox }
  ]);

  const getBoxById = boxId => boxes.find(b => b.id === boxId).ref;

  const [lines, setLines] = useState<line[]>([
    {
      start: getBoxById("box1"),
      end: getBoxById("box2"),
      headSize: 20,
      label: { end: { text: "endLable!", extra: { fill: "purple", dx: -30 } } },
      endAnchor: "left",
      curveness: 1.5
    },
    {
      start: getBoxById("box2"),
      end: getBoxById("box3"),
      startAnchor: "right",
      endAnchor: "bottom",
      curveness: 3,
      color: "red",
      label: { start: "startLabel", middle: "middleLable", end: "endLable" },
      dashness: { animation: 1 }
    },
    {
      start: getBoxById("box1"),
      end: getBoxById("box3"),
      color: "green",
      label: { middle: { text: "I'm just a line", extra: { dy: -8 } } },
      endAnchor: "top",
      headSize: 1
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

const Example: React.FC = () => {
  const [showMe, setShowMe] = useState(true);

  const [showExample1, setShowExample1] = useState(false);
  const [showExample2, setShowExample2] = useState(false);
  const [showPlayGround, setShowPlayGround] = useState(false);

  return (
    <div>
      <button style={{ margin: "auto", display: "block" }} onClick={() => setShowMe(!showMe)}>
        toggle
      </button>
      {showMe ? (
        <div>
          <button onClick={() => setShowExample1(!showExample1)}>Example1</button>
          <button onClick={() => setShowExample2(!showExample2)}>Example2</button>
          <button onClick={() => setShowPlayGround(!showPlayGround)}>PlayGround</button>

          <div>
            {showExample1 ? <Example1 /> : null}
            {showExample2 ? <Example2 /> : null}
            {showPlayGround ? <PlayGround /> : null}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Example;