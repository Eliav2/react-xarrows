import "./App.css";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Box } from "./components/Box";
import useRerender from "shared/hooks/useRerender";
import { BestPathSmoothXArrow } from "./components/BestPathSmoothXArrow";
import { Button, CardContent, Paper, Box as MuiBox } from "@mui/material";
import { ArrowHead } from "./components/ArrowHead";
import {
  XArrow,
  XArrowProps,
  autoAnchor,
  Anchor,
  useXArrow,
  XWrapper,
  XLine,
  AutoAnchor,
  PositionProvider,
  XArrowEnd,
  NormalizedGSvg,
  BasicHeadShape1,
  XPath,
  BestPath,
  HeadProvider,
  usePositionProvider,
  usePositionProviderRegister,
  useHeadProvider,
  current,
  Dir,
  Vector,
} from "react-xarrows";
import { AutoAnchorWithHeadXArrow } from "./components/AutoAnchorWithHeadXArrow";
import { BestPathGridXArrow } from "./components/BestPathGridXArrow";
import SnakeXArrow from "./components/SnakeXArrow";
import Comp1 from "./Comp1";
import Comp2 from "./Comp2";
import TestPassRef from "./components/TestPassRef";
import { expect } from "vitest";
// import produce  from "immer";
import { deepFreeze } from "shared/utils";
import { XArrowEndProps, XArrowEndPropsWithDefaults } from "../../../src";
import XLocator from "../../../src/redesign/XLocator";

function App() {
  return (
    <div className="App">
      {/*<TestImmer />*/}
      <DemoXWrapper />
    </div>
  );
}

function changeVal(val: { val: number }) {
  val.val += 1;
  return val;
}

// const TestImmerChild = ({ value }: { value: { val: number } }) => {
//   console.log("TestImmerChild");
//   const val = value;
//   const [valState, valSetState] = useState(value);
//   // const newVal = changeVal(val);
//   const newVal = produce(val, (draft) => {
//     changeVal(draft);
//   });
//   useEffect(() => {
//     console.log("TestImmerChild effect");
//
//     // valSetState({ val: valState.val + 1 });
//     valSetState({ val: value.val + 1 });
//     return () => {
//       console.log("TestImmerChild effect cleanup");
//     };
//   }, [value]);
//
//   return (
//     <div>
//       val: {newVal.val} valState: {valState.val}
//     </div>
//   );
// };
// const TestImmer = () => {
//   // const [state, setState] = useState<{ val: number }>(Object.freeze({ val: 0 }));
//   const [state, setState] = useState({ val: 0 });
//   const render = useRerender();
//   const v = produce({ asd: 10 }, (draft) => {});
//
//   return (
//     <div>
//       <Button onClick={render}>render</Button>
//       <Button
//         onClick={() => {
//           setState((s) => {
//             // s = produce(s, (draft) => {
//             //   draft.val += 1;
//             // });
//             return { val: s.val + 1 };
//           });
//         }}
//       >
//         Increment parrent state
//       </Button>
//       <div>
//         {state.val}
//         <TestImmerChild value={state} />
//       </div>
//     </div>
//   );
// };

const DemoXWrapper = () => {
  // console.log("DemoXWrapper");
  const render = useRerender();
  const box1Ref = useRef<HTMLDivElement>(null);
  const box2Ref = useRef<HTMLDivElement>(null);

  // const obj = deepFreeze({ a: { ab: { abc: 1 } } });
  // const newObj = produce(obj, (draft) => {
  //   draft.a.ab.abc += 1;
  // });
  // console.log(newObj);

  useEffect(() => {
    console.log("DemoXWrapper useEffect");
  }, []);

  // PositionProvider -> HeadProvider -> PositionProvider
  return (
    <XWrapper>
      <Paper>
        <Button onClick={render}>render</Button>
      </Paper>
      {/* my boxes */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          // flexDirection: "column",
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

      {/*<BasicDemo />*/}

      {/*<TestPassRef />*/}

      {/*<XArrowHeadAndTail start={box1Ref} end={box2Ref} />*/}

      {/*<XArrow start={box1Ref} end={box2Ref}>*/}
      {/*  <XArrowEnd color={"red"} />*/}
      {/*  <CustomTailHead size={30} />*/}
      {/*  <XLine />*/}
      {/*  <foreignObject overflow={"visible"}>*/}
      {/*    <div>*/}
      {/*      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed mollis mollis mi ut ultricies. Nullam magna ipsum, porta vel dui*/}
      {/*      convallis, rutrum imperdiet eros. Aliquam erat volutpat.*/}
      {/*    </div>*/}
      {/*  </foreignObject>*/}
      {/*  /!*<AutoAnchor startAnchor={"auto"} endAnchor={"auto"}>*!/*/}
      {/*  /!*  <BestPath>*!/*/}
      {/*  /!*    /!*<CustomTailHead />*!/*!/*/}
      {/*  /!*    /!*<XArrowEnd color={"purple"} size={30} element={<BasicHeadShape1 />} />*!/*!/*/}

      {/*  /!*    /!*<XPath color={"yellow"} />*!/*!/*/}
      {/*  /!*  </BestPath>*!/*/}
      {/*  /!*</AutoAnchor>*!/*/}
      {/*</XArrow>*/}

      {/* my arrows */}
      {/*<BestPathSmoothXArrow start={box1Ref} end={box2Ref} headSharpness={0.25} />*/}
      {/*<BestPathGridXArrow start={box1Ref} end={box2Ref} breakPoint={0.5} startAnchor={"left"} endAnchor={"top"} />*/}
      {/*<AutoAnchorWithHeadXArrow start={box1Ref} end={box2Ref} headSize={50} />*/}
      {/*<SnakeXArrow start={box1Ref} end={box2Ref} />*/}
      {/*<SimpleLineXArrow start={box1Ref} end={box2Ref} />*/}
    </XWrapper>
  );
};

interface XArrowHeadAndTailProps extends XArrowProps {
  headSize?: number;
  tailSize?: number;
}

const XArrowHeadAndTail = (props: XArrowHeadAndTailProps) => {
  return (
    <XArrow start={props.start} end={props.end}>
      <XLine>
        <XLocator>
          <XArrowEnd size={props.headSize} />
        </XLocator>
        {/*<XLocator>*/}
        {/*  <XArrowEnd size={props.headSize} />*/}
        {/*</XLocator>*/}
      </XLine>
    </XArrow>
  );
};

const CustomTailHead = (props) => {
  // console.log("CustomHead", props);
  const pos = usePositionProvider();
  const headProvider = useHeadProvider();
  // console.log("headProvider", headProvider.dir);

  const dir = pos?.startPoint?.sub(pos?.endPoint);
  usePositionProviderRegister(
    (pos) => {
      // console.log("usePositionProviderRegister", props.size);
      // console.log("usePositionProviderRegister", pos.startPoint && current(pos.startPoint), pos.startPoint?.sub(headProvider.dir?.mul(30)));
      if (pos.startPoint) pos.startPoint = pos.startPoint?.add(headProvider.dir?.mul(props.size));
      // if (pos.startPoint) pos.startPoint = pos.startPoint?.add(new Dir(1, 0).mul(30));
    },
    [headProvider.dir?.x, headProvider.dir?.y, props.size]
  );
  // console.log(pos);
  return <XArrowEnd element={<BasicHeadShape1 />} pos={pos.startPoint} dir={dir} color={"red"} />;
};

export default App;

const SomeComponent = () => {
  console.log("SomeComponent");
  const val = usePositionProvider();
  // console.log("val", val);
  return <div></div>;
};

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
//           const { startPoint, endPoint } = autoAnchor(startRect, endRect, { startAnchor, endAnchor });
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

const boxStyle = {
  border: "solid",
  borderRadius: 12,
  padding: 8,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  overflow: "hidden",
} as const;

function BasicDemo() {
  const box1Ref = useRef(null);
  const box2Ref = useRef(null);
  return (
    <div style={{ display: "flex", justifyContent: "space-evenly" }}>
      <div ref={box1Ref} style={boxStyle}>
        Box1
      </div>
      <div ref={box2Ref} style={boxStyle}>
        Box2
      </div>
      <XArrow start={box1Ref} end={box2Ref}>
        <XLine />

        <XArrowEnd />
      </XArrow>
    </div>
  );
}

const MyArrows = () => {
  console.log("MyArrows render");

  return (
    <>
      {/* AutoAnchor arrow */}
      {/*<XArrow start={"box1"} end={"box2"}>*/}
      {/*  <AutoAnchorXLine startAnchor={["left", "right", { x: "25%", y: "50%" }]} />*/}
      {/*</XArrow>*/}

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
