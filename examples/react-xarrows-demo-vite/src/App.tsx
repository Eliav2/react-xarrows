import "./App.css";
import React, { useRef } from "react";
import { Box } from "./components/Box";
import useRerender from "shared/hooks/useRerender";
import { AutoAnchorWithHeadXArrow } from "./components/AutoAnchorWithHeadXArrow";
import SnakeXArrow from "./components/SnakeXArrow";
import { Anchor, autoSelectAnchor } from "react-xarrows/useAutoSelectAnchor";
import XArrow, { XArrowProps, ProvideXContext, useXContext } from "react-xarrows/XArrow";
import XWrapper from "react-xarrows/XWrapper";
import XLine from "react-xarrows/XLine";
import { getBestPath } from "react-xarrows/path";

function App() {
  return (
    <React.StrictMode>
      <div className="App">
        <DemoXWrapper />
        {/*<DemoXWrapper />*/}
      </div>
    </React.StrictMode>
  );
}

export default App;

interface CurvedXArrowProps extends Pick<XArrowProps, "start" | "end"> {}

const CurvedXArrow = (props: CurvedXArrowProps) => {
  const { start, end } = props;
  return (
    <XArrow start={start} end={end}>
      <ProvideXContext>
        {(context) => {
          const { startElem, endElem } = context;
          if (!startElem || !endElem) return null;
          const { startPoint, endPoint } = autoSelectAnchor({
            startElem,
            endElem,
            // startAnchor: "right",
            // endAnchor: "top",
          });
          // const points = [startPoint, endPoint];
          // const points = zTurn(startPoint, endPoint);
          const points = getBestPath({ startPoint, endPoint });
          const points_s = points.map((p) => p.x + "," + p.y).join(" ");
          return <polyline points={points_s} fill="transparent" stroke="white" strokeWidth={3} />;
        }}
      </ProvideXContext>
    </XArrow>
  );
};

const DemoXWrapper = () => {
  const render = useRerender();
  const box1Ref = useRef<HTMLDivElement>(null);
  const box2Ref = useRef<HTMLDivElement>(null);

  return (
    <XWrapper>
      <button onClick={render}>render</button>
      {/* my boxes */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          flexDirection: "column",
          height: 400,
          alignItems: "center",
        }}
      >
        <Box ref={box1Ref} id={"box1"} small>
          box1
        </Box>
        <Box ref={box2Ref} id={"box2"}>
          box2
        </Box>
      </div>
      <div style={{ height: 50 }} />
      {/* my arrows */}
      {/*<CurvedXArrow start={box1Ref} end={box2Ref} />*/}
      {/*<AutoAnchorWithHeadXArrow start={box1Ref} end={box2Ref} headSize={50} />*/}
      <SnakeXArrow start={box1Ref} end={box2Ref} />
    </XWrapper>
  );
};

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

const LeftToRightXLine = () => {
  const context = useXContext();
  const { startElem, endElem } = context;
  if (!startElem || !endElem) return null;
  return <XLine x1={startElem.right} y1={startElem.top + startElem.height / 2} x2={endElem.left} y2={endElem.top + endElem.height / 2} />;
};

const AutoAnchorXLine = ({ startAnchor, endAnchor }: { startAnchor?: Anchor; endAnchor?: Anchor }) => {
  // const autoSelectAnchor = useAutoSelectAnchor(props);
  const context = useXContext();
  const { startElem, endElem } = context;
  if (!startElem || !endElem) return null;
  const {
    startPoint: { x: x1, y: y1 },
    endPoint: { x: x2, y: y2 },
  } = autoSelectAnchor({ startElem, endElem, startAnchor, endAnchor });
  return <XLine {...{ x1, y1, x2, y2 }} />;
};
