import "./App.css";
import React, { useRef } from "react";
import { Box } from "./components/Box";
import useRerender from "shared/hooks/useRerender";
import { BestPathSmoothXArrow } from "./components/BestPathSmoothXArrow";
import { Button, CardContent, Paper, Box as MuiBox } from "@mui/material";
import { ArrowHead } from "./components/ArrowHead";
import {
  XArrow,
  XArrowProps,
  autoSelectAnchor,
  Anchor,
  useXArrow,
  XWrapper,
  XLine,
  AutoSelectAnchor,
  PositionProvider,
  XHead,
  NormalizedGSvg,
  BasicHeadShape1,
} from "react-xarrows";
import BasicHead1 from "react-xarrows/components/BasicHead1";
import { AutoAnchorWithHeadXArrow } from "./components/AutoAnchorWithHeadXArrow";
import { BestPathGridXArrow } from "./components/BestPathGridXArrow";
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

const SimpleLineXArrow = (props: Omit<XArrowProps, "children">) => {
  const { start, end } = props;
  return (
    <XArrow start={start} end={end}>
      <XLine />
    </XArrow>
  );
};

// const AutoAnchorLeftXArrow = (props: Omit<XArrowProps, "children">) => {
//   const { start, end } = props;
//   return (
//     <XArrow start={start} end={end}>
//       <ProvideXContext>
//         {(context) => {
//           let { startRect, endRect } = context;
//           if (!startRect || !endRect) return null;
//           endRect = endRect.expand(headOffset);
//           const { startPoint, endPoint } = autoSelectAnchor(startRect, endRect, { startAnchor, endAnchor });
//           const { points, endDir } = getBestPath(startPoint, endPoint, { breakPoint });
//           const v = pointsToCurves(points);
//           return (
//             <>
//               <path d={v} stroke="white" strokeWidth={3} />
//               <ArrowHead sharpness={arrowHeadSharpness} size={arrowHeadSize} pos={endPoint.add(endDir.mul(headOffset))} dir={endDir} />
//             </>
//           );
//         }}
//       </ProvideXContext>
//     </XArrow>
//   );
// };

const sayHello = () => {
  console.log("hello");
};

const DemoXWrapper = () => {
  // console.log("DemoXWrapper");
  const render = useRerender();
  const box1Ref = useRef<HTMLDivElement>(null);
  const box2Ref = useRef<HTMLDivElement>(null);

  return (
    <XWrapper>
      <Paper>
        <Button onClick={render}>render</Button>
        <Button onClick={sayHello}>hello</Button>
      </Paper>
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

      <XArrow start={box1Ref} end={box2Ref}>
        {/*<AutoSelectAnchor>*/}
        {/*  <text fill={"red"} x="65" y="55" className="Rrrrr">*/}
        {/*    Grumpy!*/}
        {/*  </text>*/}
        {/*</AutoSelectAnchor>*/}

        <AutoSelectAnchor>
          <XLine stripEnd={22.5} />
          <XHead color={"red"} />
        </AutoSelectAnchor>
      </XArrow>

      {/* my arrows */}
      {/*<BestPathSmoothXArrow start={box1Ref} end={box2Ref} headSharpness={0.25} />*/}
      {/*<BestPathGridXArrow start={box1Ref} end={box2Ref} breakPoint={0.5} startAnchor={"left"} endAnchor={"top"} />*/}
      {/*<AutoAnchorWithHeadXArrow start={box1Ref} end={box2Ref} headSize={50} />*/}
      {/*<SnakeXArrow start={box1Ref} end={box2Ref} />*/}
      {/*<SimpleLineXArrow start={box1Ref} end={box2Ref} />*/}
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
  const context = useXArrow();
  const { startRect, endRect } = context;
  if (!startRect || !endRect) return null;
  return <XLine x1={startRect.right} y1={startRect.top + startRect.height / 2} x2={endRect.left} y2={endRect.top + endRect.height / 2} />;
};

const AutoAnchorXLine = ({ startAnchor, endAnchor }: { startAnchor?: Anchor; endAnchor?: Anchor }) => {
  // const autoSelectAnchor = useAutoSelectAnchor(props);
  const context = useXArrow();
  const { startRect, endRect } = context;
  if (!startRect || !endRect) return null;
  const {
    startPoint: { x: x1, y: y1 },
    endPoint: { x: x2, y: y2 },
  } = autoSelectAnchor({ startRect, endRect, startAnchor, endAnchor });
  return <XLine {...{ x1, y1, x2, y2 }} />;
};
