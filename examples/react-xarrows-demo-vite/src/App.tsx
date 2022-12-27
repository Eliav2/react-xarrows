import "./App.css";
import React, { useRef } from "react";
import { Box } from "./components/Box";
import useRerender from "shared/hooks/useRerender";
import { ArrowHead, AutoAnchorWithHeadXArrow } from "./components/AutoAnchorWithHeadXArrow";
import { Anchor, autoSelectAnchor } from "react-xarrows/useAutoSelectAnchor";
import XArrow, { ProvideXContext, useXContext, XArrowProps } from "react-xarrows/XArrow";
import XWrapper from "react-xarrows/XWrapper";
import XLine from "react-xarrows/XLine";
import { getBestPath, pointsToCurves, Dir } from "react-xarrows/path";
import { BestPathGridXArrow, BestPathGridXArrowProps } from "./components/BestPathGridXArrow";
import SnakeXArrow from "./components/SnakeXArrow";

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

export interface BestPathSmoothXArrowProps extends Pick<XArrowProps, "start" | "end"> {
  breakPoint?: number;
}

export const BestPathSmoothXArrow = (props: BestPathSmoothXArrowProps) => {
  const { start, end, breakPoint = 0.5 } = props;
  return (
    <XArrow start={start} end={end}>
      <ProvideXContext>
        {(context) => {
          const { startElem, endElem } = context;
          if (!startElem || !endElem) return null;
          // endElem.left -= 20;
          const { startPoint, endPoint } = autoSelectAnchor({ startElem, endElem });
          const { points, startDir, endDir } = getBestPath(startPoint, endPoint, { breakPoint });
          // console.log("startDir", startDir);
          // console.log("endDir", endDir);
          // points[points.length - 1] = points[points.length - 1].sub(endDir.mul(30));
          const v = pointsToCurves(points);
          // console.log(v);
          return (
            <>
              <path d={v} stroke="white" strokeWidth={3} />
              <ArrowHead pos={endPoint} dir={new Dir(endPoint.trailingDir[0])} />
            </>
          );
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
      <BestPathSmoothXArrow start={box1Ref} end={box2Ref} />
      {/*<BestPathGridXArrow start={box1Ref} end={box2Ref} breakPoint={0.5} />*/}
      {/*<AutoAnchorWithHeadXArrow start={box1Ref} end={box2Ref} headSize={50} />*/}
      {/*<SnakeXArrow start={box1Ref} end={box2Ref} />*/}
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
