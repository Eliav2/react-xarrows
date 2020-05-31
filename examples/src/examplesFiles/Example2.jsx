import React, { useState, useRef } from "react";
import Xarrow from "react-xarrows";
import Draggable from "react-draggable";

const boxStyle = {
  position: "absolute",
  background: "white",
  border: "1px #999 solid",
  borderRadius: "10px",
  textAlign: "center",
  width: "100px",
  height: "30px",
  color: "black",
};

const canvasStyle = {
  width: "100%",
  height: "40vh",
  background: "white",
  overflow: "auto",
  display: "flex",
  position: "relative",
};

const Box = (props) => {
  return (
    <Draggable onDrag={() => props.setBox({ ...props.box })}>
      <div ref={props.box.ref} id={props.box.id} style={{ ...boxStyle, left: props.box.x, top: props.box.y }}>
        {props.box.id}
      </div>
    </Draggable>
  );
};

const Example2 = () => {
  const [showMe, setShowMe] = useState(true);

  const [box, setBox] = useState({ id: "box1", x: 20, y: 20, ref: useRef(null) });
  const [box2, setBox2] = useState({ id: "box2", x: 320, y: 120, ref: useRef(null) });

  const [color, setColor] = useState("red");
  const [lineColor, setLineColor] = useState(null);
  const [headColor, setHeadColor] = useState(null);
  const [curveness, setCurveness] = useState(0.8);
  const [strokeWidth, setStrokeWidth] = useState(4);
  const [headSize, setHeadSize] = useState(6);
  const [startAnchor, setStartAnchor] = useState(["auto"]);
  const [endAnchor, setEndAnchor] = useState(["auto"]);
  const [dashed, setDashed] = useState(true);
  const [animation, setAnimation] = useState(1);

  const colorOptions = ["red", "BurlyWood", "CadetBlue", "Coral"];
  const bodyColorOptions = [null, ...colorOptions];
  const anchorsTypes = ["left", "right", "top", "bottom", "middle", "auto"];

  // this is the importent part of the example! play with the props to undestand better the API options
  var props = {
    start: "box1", //  can be string
    end: box2.ref, //  or reference
    startAnchor: startAnchor,
    endAnchor: endAnchor,
    curveness: Number(curveness),
    color: color,
    lineColor: lineColor,
    headColor: headColor,
    strokeWidth: Number(strokeWidth),
    headSize: Number(headSize),
    // dashness: true   // can be simply boolean or object:
    dashness: dashed ? { animation: Number(animation) } : false,
    // label: "middle"  //can be simply string of middle label or object:
    label: {
      start: "startLabel",
      end: { text: "endLabel", extra: { fill: "blue", dy: -10 } },
    },
    monitorDOMchanges: false,
    registerEvents: [],
    consoleWarning: true,
    advanced: { extendSVGcanvas: 20 },
    path: "smooth",
  };

  return (
    <div>
      <h3>
        <u>Example2:</u>
      </h3>
      <p>
        {" "}
        This example shows some of the main API options. give the arrow diffrent properties to customize his look. note
        that some options are cannot be changed though this GUI(like custom lables or advande dashness and more) play
        with them directly at this codesandbox!.
      </p>

      <button onClick={() => setShowMe(!showMe)}>toggle</button>
      {showMe ? (
        <div>
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
                      onChange={(e) => {
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
                      onChange={(e) => {
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
                    <select onChange={(e) => setColor(e.target.value)}>
                      {colorOptions.map((o, i) => (
                        <option key={i}>{o}</option>
                      ))}
                    </select>
                  </div>
                </td>
                <td>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <p>stroke color: </p>
                    <select onChange={(e) => setLineColor(e.target.value)}>
                      {bodyColorOptions.map((o, i) => (
                        <option key={i}>{o}</option>
                      ))}
                    </select>
                  </div>
                </td>
                <td>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <p>head color: </p>
                    <select onChange={(e) => setHeadColor(e.target.value)}>
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
                      onChange={(e) => setCurveness(e.target.value)}
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
                      onChange={(e) => setStrokeWidth(e.target.value)}
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
                      onChange={(e) => setHeadSize(e.target.value)}
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
                      onChange={(e) => setDashed(e.target.checked ? true : false)}
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
                      onChange={(e) => setAnimation(e.target.value)}
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
          {/*what will heppen if you will move Xarrow here? try!*/}
        </div>
      ) : null}
    </div>
  );
};

export default Example2;
