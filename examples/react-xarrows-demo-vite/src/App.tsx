import "./App.css";
import { useXArrowContext, XArrow } from "react-xarrows/src/redesign/XArrow";
import { XWrapper } from "react-xarrows/src/redesign/XWrapper";
import React, { useRef } from "react";
import { Anchor, useAutoSelectAnchor } from "../../../src/redesign/useAutoSelectAnchor";
import { XLine } from "../../../src/redesign/XLine";
import { Box } from "./components/Box";

function App() {
  const box1Ref = useRef<HTMLDivElement>(null);
  const box2Ref = useRef<HTMLDivElement>(null);

  return (
    <React.StrictMode>
      <div className="App">
        <XWrapper>
          {/* my boxes */}
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <Box ref={box1Ref} id={"box1"}>
              box1
            </Box>
            <Box ref={box2Ref} id={"box2"}>
              box2
            </Box>
          </div>
          <div style={{ height: 50 }} />
          {/* my arrows */}
          {/* AutoAnchor arrow */}
          <XArrow start={box1Ref} end={{ x: 300, y: 300 }}>
            {/*<XLine />*/}
            <AutoAnchorXLine />
            {/*<AutoAnchorXLine startAnchor={["left", "right", { x: "25%", y: "50%" }]} />*/}
          </XArrow>
        </XWrapper>
      </div>
    </React.StrictMode>
  );
}

export default App;

const MyArrows = () => {
  console.log("MyArrows render");

  return (
    <>
      {/* AutoAnchor arrow */}
      <XArrow start={"box1"} end={"box2"}>
        <AutoAnchorXLine startAnchor={["left", "right", { x: "25%", y: "50%" }]} />
      </XArrow>

      {/*/!* simple arrow left to right *!/*/}
      {/*<XArrow start={"box1"} end={"box2"}>*/}
      {/*  <LeftToRightXLine />*/}
      {/*</XArrow>*/}

      {/*/!* simple arrow *!/*/}
      {/*<XArrow start={"box1"} end={"box2"}>*/}
      {/*  <XLine />*/}
      {/*</XArrow>*/}
      {/*/!* simple arrow offset in y-axis *!/*/}
      {/*<XArrow start={"box1"} end={"box2"}>*/}
      {/*  <ProvideXContext>*/}
      {/*    {(context) => {*/}
      {/*      const {*/}
      {/*        startPoint: { x: x1, y: y1 },*/}
      {/*        endPoint: { x: x2, y: y2 },*/}
      {/*      } = context;*/}
      {/*      return <XLine x1={x1 - 30} y1={y1} x2={x2 - 30} y2={y2} />;*/}
      {/*    }}*/}
      {/*  </ProvideXContext>*/}
      {/*</XArrow>*/}

      {/*/!* snake arrow  *!/*/}
      {/*<SnakeXArrow start={"box1"} end={"box2"} />*/}
    </>
  );
};

const MyBoxes = () => {
  console.log("MyBoxes render");
  return (
    <div style={{ display: "flex", justifyContent: "space-around" }}>
      <Box ref={box1Ref} id={"box1"}>
        box1
      </Box>
      <Box ref={box2Ref} id={"box2"}>
        box2
      </Box>
    </div>
  );
};

const LeftToRightXLine = () => {
  const context = useXArrowContext();
  const { startElem, endElem } = context;
  if (!startElem || !endElem) return null;
  return <XLine x1={startElem.right} y1={startElem.top + startElem.height / 2} x2={endElem.left} y2={endElem.top + endElem.height / 2} />;
};

const AutoAnchorXLine = (props: { startAnchor?: Anchor; endAnchor?: Anchor }) => {
  const autoSelectAnchor = useAutoSelectAnchor(props);
  if (!autoSelectAnchor) return null;
  const pos = autoSelectAnchor();
  return <XLine {...pos} />;
};
