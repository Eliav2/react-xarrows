import React, { useState, useRef } from "react";
import Xarrow from "react-xarrows";
import Draggable from "react-draggable";
import NumericInput from "react-numeric-input";
import Collapsible from "react-collapsible";

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
  height: "60vh",
  background: "white",
  overflow: "auto",
  display: "flex",
  position: "relative",
  color: "black",
};

const colorOptions = ["red", "BurlyWood", "CadetBlue", "Coral"];
const bodyColorOptions = [null, ...colorOptions];
const anchorsTypes = ["left", "right", "top", "bottom", "middle", "auto"];

// one row div with elements centered
const Div = ({ children, style, ...props }) => {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

const MyCollapsible = ({ children, style, title = "title", ...props }) => {
  // console.log(children);
  return (
    <Collapsible
      open={false}
      trigger={title}
      transitionTime={100}
      containerElementProps={{
        style: {
          border: "1px #999 solid",
        },
      }}
      triggerStyle={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      {...props}
    >
      {children}
    </Collapsible>
  );
};

// not in single line
const CollapsibleDiv = ({ children, style, title = "title", ...props }) => {
  //  noo
  return (
    <Collapsible
      open={false}
      trigger={title}
      transitionTime={100}
      containerElementProps={{
        style: {
          border: "1px #999 solid",
        },
      }}
      triggerStyle={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Div {...{ children, style, ...props }}>{children}</Div>
    </Collapsible>
  );
};

const Box = (props) => {
  return (
    <Draggable onDrag={props.forceRerender} onStop={props.forceRerender}>
      <div
        ref={props.box.ref}
        id={props.box.id}
        style={{ ...boxStyle, left: props.box.x, top: props.box.y }}
      >
        {props.box.id}
      </div>
    </Draggable>
  );
};

const ArrowAnchor = ({ anchorName, sideAnchor, setAnchor }) => {
  return (
    <div style={{ display: "flex", alignItems: "center", marginRight: 20 }}>
      <p>{anchorName}: </p>
      <div>
        {anchorsTypes.map((anchor, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              height: 25,
            }}
          >
            <p>{anchor}</p>
            <input
              style={{ height: "15px", width: "15px" }}
              type="checkBox"
              checked={sideAnchor.includes(anchor)}
              // value={}
              onChange={(e) => {
                if (e.target.checked) {
                  setAnchor([...sideAnchor, anchor]);
                } else {
                  let a = [...sideAnchor];
                  a.splice(sideAnchor.indexOf(anchor), 1);
                  setAnchor(a);
                }
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const ArrowSide = ({
  sideName,
  setSide,
  sideSize,
  setSideSize,
  sideOffset,
  setSideOffset,
  showSide,
  setShowSide,
}) => {
  return (
    <Div title={"arrow " + sideName}>
      <p>show {sideName}: </p>
      <input
        style={{ height: "15px", width: "15px" }}
        type="checkBox"
        checked={showSide}
        onChange={(e) => {
          setShowSide(e.target.checked);
        }}
      />
      <p>{sideName} color: </p>
      <select
        style={{ marginRight: 10 }}
        onChange={(e) => setSide(e.target.value)}
      >
        {bodyColorOptions.map((o, i) => (
          <option key={i}>{o}</option>
        ))}
      </select>
      <p>{sideName}Size: </p>
      <NumericInput
        value={sideSize}
        onChange={(val) => setSideSize(val)}
        style={{ input: { width: 60 } }}
      />
      <p>{sideName}Offset: </p>
      <NumericInput
        value={sideOffset}
        onChange={(val) => setSideOffset(val)}
        style={{ input: { width: 70 } }}
        step={0.01}
      />
    </Div>
  );
};

const ArrowLabel = ({ labelName, label, setLabel }) => {
  return (
    <Div>
      <p>{labelName} label:</p>
      <input
        style={{ width: "120px" }}
        type="text"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
      />
    </Div>
  );
};

const CustomizeArrow = () => {
  const [, setRender] = useState({});
  const forceRerender = () => setRender({});

  const [showMe, setShowMe] = useState(true);

  const box = {
    id: "box1",
    x: 20,
    y: 20,
    ref: useRef(null),
  };

  const box2 = {
    id: "box2",
    x: 320,
    y: 120,
    ref: useRef(null),
  };

  const [color, setColor] = useState("red");
  const [lineColor, setLineColor] = useState(null);
  const [showArrow, setShowArrow] = useState(true);
  const [showHead, setShowHead] = useState(true);
  const [headColor, setHeadColor] = useState(null);
  const [headSize, setHeadSize] = useState(6);
  const [headOffset, setHeadOffset] = useState(0.25);
  const [tailOffset, setTailOffset] = useState(0.25);
  const [showTail, setShowTail] = useState(false);
  const [tailColor, setTailColor] = useState(null);
  const [tailSize, setTailSize] = useState(6);
  const [curveness, setCurveness] = useState(0.8);
  const [strokeWidth, setStrokeWidth] = useState(4);
  const [startAnchor, setStartAnchor] = useState(["auto"]);
  const [endAnchor, setEndAnchor] = useState(["auto"]);
  const [dashed, setDashed] = useState(false);
  const [animation, setAnimation] = useState(1);
  const [pathGrid, setPathGrid] = useState("smooth");
  const [startLabel, setStartLabel] = useState("I'm start label");
  const [middleLabel, setMiddleLabel] = useState("middleLabel");
  const [endLabel, setEndLabel] = useState("fancy end label");
  const [_extendSVGcanvas, setExtendSVGcanvas] = useState(0);
  const [_debug, set_Debug] = useState(false);
  const [_cpx1Offset, set_Cpx1] = useState(0);
  const [_cpy1Offset, set_Cpy1] = useState(0);
  const [_cpx2Offset, set_Cpx2] = useState(0);
  const [_cpy2Offset, set_Cpy2] = useState(0);

  // this is the important part of the example! play with the props to understand better the API options
  const props = {
    start: "box1", //  can be string
    end: box2.ref, //  or reference
    startAnchor: startAnchor,
    endAnchor: endAnchor,
    curveness: Number(curveness),
    color: color,
    lineColor: lineColor,
    strokeWidth: Number(strokeWidth),
    dashness: dashed ? { animation: Number(animation) } : false,
    path: pathGrid,
    showHead: showHead,
    headColor: headColor,
    headSize: Number(headSize),
    showTail,
    tailColor,
    tailSize: Number(tailSize),

    label: {
      start: startLabel,
      middle: middleLabel,
      end: (
        <div
          style={{
            fontSize: "1.3em",
            fontFamily: "fantasy",
            fontStyle: "italic",
            color: "purple",
          }}
        >
          {endLabel}
        </div>
      ),
    },
    _extendSVGcanvas,
    _debug,
    _cpx1Offset: _cpx1Offset,
    _cpy1Offset: _cpy1Offset,
    _cpx2Offset: _cpx2Offset,
    _cpy2Offset: _cpy2Offset,
  };

  return (
    <div>
      <h3>
        <u>Example2:</u>
      </h3>
      <p>
        {" "}
        This example shows some of the main API options. give the arrow diffrent
        properties to customize his look. note that some options are cannot be
        changed though this GUI(like custom lables or advande dashness and more)
        play with them directly at this codesandbox!.
      </p>

      {/*<button onClick={() => setShowMe(!showMe)}>toggle</button>*/}
      {showMe ? (
        <div>
          <CollapsibleDiv title={"anchors"}>
            <ArrowAnchor
              sideAnchor={startAnchor}
              anchorName={"startAnchor"}
              setAnchor={setStartAnchor}
            />
            <ArrowAnchor
              sideAnchor={endAnchor}
              anchorName={"endAnchor"}
              setAnchor={setEndAnchor}
            />
          </CollapsibleDiv>
          <MyCollapsible title={"arrow apearance"} open={true}>
            <Div>
              <p>arrow color(all): </p>
              <select
                style={{ height: "20px", marginRight: 10 }}
                onChange={(e) => setColor(e.target.value)}
              >
                {colorOptions.map((o, i) => (
                  <option key={i}>{o}</option>
                ))}
              </select>
              <p>line color: </p>
              <select onChange={(e) => setLineColor(e.target.value)}>
                {bodyColorOptions.map((o, i) => (
                  <option key={i}>{o}</option>
                ))}
              </select>
              <p>strokeWidth: </p>
              <NumericInput
                value={strokeWidth}
                onChange={(val) => setStrokeWidth(val)}
                style={{ input: { width: 60 } }}
              />
            </Div>
            <Div>
              <p>curveness: </p>
              <NumericInput
                value={curveness}
                onChange={(val) => setCurveness(val)}
                step={0.1}
                style={{ input: { width: 60 } }}
              />
              <p>animation: </p>
              <NumericInput
                value={animation}
                onChange={(val) => setAnimation(val)}
                style={{ input: { width: 60 } }}
              />
              <p>dashed: </p>
              <input
                style={{ height: "15px", width: "15px" }}
                type="checkBox"
                checked={dashed}
                onChange={(e) => setDashed(e.target.checked)}
              />
              <p>path: </p>
              <select onChange={(e) => setPathGrid(e.target.value)}>
                {["smooth", "grid", "straight"].map((o, i) => (
                  <option key={i}>{o}</option>
                ))}
              </select>
            </Div>
            <ArrowSide
              sideName={"head"}
              setSide={setHeadColor}
              sideSize={headSize}
              setSideSize={setHeadSize}
              showSide={showHead}
              setShowSide={setShowHead}
              sideOffset={headOffset}
              setSideOffset={setHeadOffset}
            />
            <ArrowSide
              sideName={"tail"}
              setSide={setTailColor}
              sideSize={tailSize}
              setSideSize={setTailSize}
              showSide={showTail}
              setShowSide={setShowTail}
              sideOffset={tailOffset}
              setSideOffset={setTailOffset}
            />
            <Div>
              <p>show arrow: </p>
              <input
                style={{ height: "15px", width: "15px" }}
                type="checkBox"
                checked={showArrow}
                onChange={(e) => {
                  setShowArrow(e.target.checked);
                }}
              />
            </Div>
          </MyCollapsible>

          <CollapsibleDiv title={"labels"}>
            <ArrowLabel
              labelName={"start"}
              label={startLabel}
              setLabel={setStartLabel}
            />
            <ArrowLabel
              labelName={"middle"}
              label={middleLabel}
              setLabel={setMiddleLabel}
            />
            <ArrowLabel
              labelName={"end"}
              label={endLabel}
              setLabel={setEndLabel}
            />
          </CollapsibleDiv>

          <MyCollapsible title={"advanced"}>
            <Div>
              <p>_extendSVGcanvas: </p>
              <NumericInput
                value={_extendSVGcanvas}
                onChange={(val) => setExtendSVGcanvas(val)}
                style={{ input: { width: 70 } }}
              />
              <p>_debug</p>
              <input
                style={{ height: "15px", width: "15px" }}
                type="checkBox"
                checked={_debug}
                // value={}
                onChange={(e) => {
                  set_Debug(e.target.checked);
                }}
              />
            </Div>
            <Div>
              <p>_cpx1Offset: </p>
              <NumericInput
                value={_cpx1Offset}
                onChange={(val) => set_Cpx1(val)}
                style={{ input: { width: 70 } }}
                step={2}
              />
              <p>_cpy1Offset: </p>
              <NumericInput
                value={_cpy1Offset}
                onChange={(val) => set_Cpy1(val)}
                style={{ input: { width: 70 } }}
                step={2}
              />
              <p>_cpx2Offset: </p>
              <NumericInput
                value={_cpx2Offset}
                onChange={(val) => set_Cpx2(val)}
                style={{ input: { width: 70 } }}
                step={2}
              />
              <p>_cpy2Offset: </p>
              <NumericInput
                value={_cpy2Offset}
                onChange={(val) => set_Cpy2(val)}
                style={{ input: { width: 70 } }}
                step={2}
              />
            </Div>
          </MyCollapsible>
          <br />
          <div style={canvasStyle} id="canvas">
            <Box box={box} forceRerender={forceRerender} />
            <Box box={box2} forceRerender={forceRerender} />
            {showArrow ? (
              <Xarrow
                {...{
                  // this is the important part of the example! play with the props to understand better the API options
                  start: "box1", //  can be string
                  end: box2.ref, //  or reference
                  startAnchor: startAnchor,
                  endAnchor: endAnchor,
                  curveness: Number(curveness),
                  color: color,
                  lineColor: lineColor,
                  strokeWidth: Number(strokeWidth),
                  dashness: dashed ? { animation: Number(animation) } : false,
                  path: pathGrid,
                  showHead: showHead,
                  headColor: headColor,
                  headSize: Number(headSize),
                  headOffset: Number(headOffset),
                  tailOffset: Number(tailOffset),

                  showTail,
                  tailColor,
                  tailSize: Number(tailSize),
                  label: {
                    start: startLabel,
                    middle: middleLabel,
                    end: (
                      <div
                        style={{
                          fontSize: "1.3em",
                          fontFamily: "fantasy",
                          fontStyle: "italic",
                          color: "purple",
                        }}
                      >
                        {endLabel}
                      </div>
                    ),
                  },
                  _extendSVGcanvas,
                  _debug,
                  _cpx1Offset: _cpx1Offset,
                  _cpy1Offset: _cpy1Offset,
                  _cpx2Offset: _cpx2Offset,
                  _cpy2Offset: _cpy2Offset,
                  animateDrawing: "2s",
                }}
              />
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default CustomizeArrow;
