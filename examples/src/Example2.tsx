import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { line, box, point } from "./types";
// import Xarrows, { xarrowPropsType, anchorType } from "../src/Xarrow";
import Xarrow, { xarrowPropsType, anchorType } from "react-xarrows";
import { Color } from "csstype";

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

const canvasStyle = {
  width: "100%",
  height: "40vh",
  background: "white",
  overflow: "auto",
  display: "flex",
  position: "relative"
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

const Example2: React.FC = () => {
  const [box, setBox] = useState<box>({ id: "box1", x: 20, y: 20, ref: useRef(null) });
  const [box2, setBox2] = useState<box>({ id: "box2", x: 120, y: 120, ref: useRef(null) });

  const [color, setColor] = useState("red");
  const [strokeColor, setStrokeColor] = useState(null);
  const [headColor, setHeadColor] = useState(null);
  const [curveness, setCurveness] = useState(0.8);
  const [strokeWidth, setStrokeWidth] = useState(4);
  const [headSize, setHeadSize] = useState(6);
  const [startAnchor, setStartAnchor] = useState<anchorType[]>(["middle"]);
  const [endAnchor, setEndAnchor] = useState<anchorType>(["middle"]);

  const colorOptions = ["red", "BurlyWood", "CadetBlue", "Coral"];
  const bodyColorOptions = [null, ...colorOptions];
  const anchorsTypes = ["left", "right", "top", "bottom", "middle", "auto"];

  var props: xarrowPropsType = {
    start: "box1", //  can be string
    end: box2.ref, //  or reference
    startAnchor: startAnchor,
    endAnchor: endAnchor,
    arrowStyle: {
      curveness: curveness,
      color: color,
      strokeColor: strokeColor,
      headColor: headColor,
      strokeWidth: strokeWidth,
      headSize: headSize
    },
    monitorDOMchanges: false,
    registerEvents: [],
    consoleWarning: false
  };

  useEffect(() => {
    // console.log(document.getElementById("strokeWidthInput"));
    // document.getElementById("strokeWidthInput").addEventListener("change", () => {
    //   console.log("changed!");
    // });
  }, []);

  return (
    <React.Fragment>
      <div>
        <h3>
          <u>Example2:</u>
        </h3>
        <p>
          {" "}
          This example shows some of the API options. give the arrow diffrent properties to
          customize his look.
        </p>

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

        <table align="center" style={{ marginRight: "auto", marginLeft: "auto" }}>
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
                  <select onChange={e => setStrokeColor(e.target.value)}>
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
          </tbody>
        </table>

        <br />

        <div style={canvasStyle}>
          <Box box={box} setBox={setBox} />
          <Box box={box2} setBox={setBox2} />
        </div>
        <Xarrow {...props} />
      </div>
    </React.Fragment>
  );
};

export default Example2;
