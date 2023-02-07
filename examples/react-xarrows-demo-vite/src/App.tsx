import "./App.css";
import React, { useEffect, useRef, useState } from "react";
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
  XHead,
  NormalizedGSvg,
  BasicHeadShape1,
  XPath,
  BestPath,
  HeadProvider,
} from "react-xarrows";
import { AutoAnchorWithHeadXArrow } from "./components/AutoAnchorWithHeadXArrow";
import { BestPathGridXArrow } from "./components/BestPathGridXArrow";
import SnakeXArrow from "./components/SnakeXArrow";
import Comp1 from "./Comp1";
import Comp2 from "./Comp2";
import TestPassRef from "./components/TestPassRef";
import { usePositionProvider } from "../../../src";
import { expect } from "vitest";
import produce from "immer";
import { deepFreeze } from "shared/utils";

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

const TestImmerChild = ({ value }: { value: { val: number } }) => {
  console.log("TestImmerChild");
  const val = value;
  const [valState, valSetState] = useState(value);
  // const newVal = changeVal(val);
  const newVal = produce(val, (draft) => {
    changeVal(draft);
  });
  useEffect(() => {
    console.log("TestImmerChild effect");

    // valSetState({ val: valState.val + 1 });
    valSetState({ val: value.val + 1 });
    return () => {
      console.log("TestImmerChild effect cleanup");
    };
  }, [value]);

  return (
    <div>
      val: {newVal.val} valState: {valState.val}
    </div>
  );
};
const TestImmer = () => {
  // const [state, setState] = useState<{ val: number }>(Object.freeze({ val: 0 }));
  const [state, setState] = useState({ val: 0 });
  const render = useRerender();
  const v = produce({ asd: 10 }, (draft) => {});

  return (
    <div>
      <Button onClick={render}>render</Button>
      <Button
        onClick={() => {
          setState((s) => {
            // s = produce(s, (draft) => {
            //   draft.val += 1;
            // });
            return { val: s.val + 1 };
          });
        }}
      >
        Increment parrent state
      </Button>
      <div>
        {state.val}
        <TestImmerChild value={state} />
      </div>
    </div>
  );
};

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

      {/*<PositionProvider value={{ endPoint: { x: 0, y: 0 } }}>*/}
      {/*  <PositionProvider*/}
      {/*    value={(val) => {*/}
      {/*      const newVal = produce(val, (draft) => {*/}
      {/*        if (draft.endPoint) draft.endPoint.x = 10;*/}
      {/*      });*/}
      {/*      return newVal;*/}
      {/*    }}*/}
      {/*  ></PositionProvider>*/}
      {/*</PositionProvider>*/}

      {/*<PositionProvider value={{ endPoint: { x: 10, y: 10 } }}>*/}
      {/*  <PositionProvider*/}
      {/*    value={(val) => {*/}
      {/*      const newVal = produce(val, (draft) => {*/}
      {/*        draft.endPoint && (draft.endPoint.x -= 30);*/}
      {/*      });*/}
      {/*      return newVal;*/}
      {/*    }}*/}
      {/*  ></PositionProvider>*/}
      {/*</PositionProvider>*/}

      <XArrow start={box1Ref} end={box2Ref}>
        <PositionProvider
          value={(prevPos) => {
            // if (prevPos.endPoint) prevPos.endPoint.x -= 30;
            // console.log("prevPos.endPoint.x", prevPos.endPoint?.x);
            let newPos = produce(prevPos, (draft) => {
              if (draft.endPoint) draft.endPoint.x -= 30;
            });
            return newPos;
          }}
        >
          <XHead />
          <XLine color={"red"} />
        </PositionProvider>
      </XArrow>

      {/*<BasicDemo />*/}

      {/*<TestPassRef />*/}
      {/*<PositionProvider value={{ a: 1, b: 2 }}>*/}
      {/*  /!*  <PositionProvider value={{ b: 3 }}>*!/*/}
      {/*  <PositionProvider*/}
      {/*    value={(v) => {*/}
      {/*      return { b: 10, c: 30 };*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    <PositionProvider value={{ c: 100 }}></PositionProvider>*/}
      {/*  </PositionProvider>*/}
      {/*  /!*</PositionProvider>*!/*/}
      {/*</PositionProvider>*/}

      {/*<PositionProvider value={{ x: 12, y: 10 }}>*/}
      {/*  <PositionProvider value={{ y: 2 }}>*/}
      {/*    {(val) => {*/}
      {/*      // console.log("val", val);*/}
      {/*      return (*/}
      {/*        <PositionProvider*/}
      {/*          value={(val) => {*/}
      {/*            console.log("val", val);*/}
      {/*            return <div></div>;*/}
      {/*          }}*/}
      {/*        ></PositionProvider>*/}
      {/*      );*/}
      {/*    }}*/}
      {/*  </PositionProvider>*/}
      {/*</PositionProvider>*/}

      {/*<XArrow start={box1Ref} end={box2Ref}>*/}
      {/*  <AutoAnchor>*/}
      {/*    /!*<BestPath>*!/*/}
      {/*    <XHead color={"purple"} />*/}
      {/*    <XPath color={"yellow"} />*/}
      {/*    /!*</BestPath>*!/*/}
      {/*  </AutoAnchor>*/}
      {/*</XArrow>*/}

      {/*<XArrow start={box1Ref} end={box2Ref}>*/}
      {/*  /!*<HeadProvider*!/*/}
      {/*  /!*  value={(val) => {*!/*/}
      {/*  /!*    if (val.pos) val.pos.y += 30;*!/*/}
      {/*  /!*    return val;*!/*/}
      {/*  /!*  }}*!/*/}
      {/*  /!*>*!/*/}
      {/*  /!*  <HeadProvider*!/*/}
      {/*  /!*    value={(val) => {*!/*/}
      {/*  /!*      if (val.pos) val.pos.x += 30;*!/*/}
      {/*  /!*      return val;*!/*/}
      {/*  /!*    }}*!/*/}
      {/*  /!*  >*!/*/}
      {/*  <XHead color={"blue"} />*/}

      {/*  <XPath />*/}
      {/*  /!*</HeadProvider>*!/*/}
      {/*  /!*</HeadProvider>*!/*/}
      {/*</XArrow>*/}

      {/*<XArrow start={box1Ref} end={box2Ref}>*/}
      {/*  <AutoAnchor startAnchor={"left"} endAnchor={"left"}>*/}
      {/*    /!*<BestPath>*!/*/}
      {/*    /!*<HeadProvider value={{ dir: { x: 1, y: 0 } }}>*!/*/}
      {/*    <XHead color={"red"} />*/}
      {/*    <XPath />*/}
      {/*    /!*</HeadProvider>*!/*/}
      {/*    /!*<XLine>*!/*/}
      {/*    /!*  <XHead color={"red"} />*!/*/}
      {/*    /!*</XLine>*!/*/}
      {/*    /!*</BestPath>*!/*/}
      {/*  </AutoAnchor>*/}
      {/*</XArrow>*/}

      {/*<Comp1>*/}
      {/*  <Comp2/>*/}
      {/*</Comp1>*/}

      {/*<AutoAnchor>*/}
      {/*  <text fill={"red"} x="65" y="55" className="Rrrrr">*/}
      {/*    Grumpy!*/}
      {/*  </text>*/}
      {/*</AutoAnchor>*/}

      {/*<AutoAnchor>*/}
      {/*  <BestPath>*/}
      {/*todo: provide a way to use the selected anchor dir and offset endpoint*/}
      {/*todo: create a generic XProvider component*/}
      {/*<PositionProvider>*/}
      {/*</PositionProvider>*/}
      {/*<XPath />*/}
      {/*<XHead />*/}
      {/*</BestPath>*/}
      {/*</AutoAnchor>*/}

      {/*<AutoAnchor>*/}
      {/*  /!*<XLine stripEnd={22.5} color={"yellow"}>*!/*/}
      {/*  /!*  <XHead />*!/*/}
      {/*  /!*</XLine>*!/*/}
      {/*  /!*<PositionProvider value={{ endPoint: (e) => ({ ...e, x: e.x - 60 }) }}>*!/*/}
      {/*  /!*<BestPath>*!/*/}
      {/*  <PositionProvider*/}
      {/*    value={{*/}
      {/*      endPoint: (e) => {*/}
      {/*        // console.log("PositionProvider", e);*/}
      {/*        return { ...e, x: e.x - 30 };*/}
      {/*      },*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    /!*<XLine stripEnd={22.5} color={"yellow"}>*!/*/}
      {/*    /!*  <XHead />*!/*/}
      {/*    /!*</XLine>*!/*/}

      {/*    <XPath />*/}
      {/*    /!*<XPath>*!/*/}
      {/*    /!*  /!*<HeadProvider value={{ pos: { y: 1, x: 0 }, rotate: 30 }}>*!/*!/*/}
      {/*    /!*  <XHead />*!/*/}
      {/*    /!*  /!*</HeadProvider>*!/*!/*/}
      {/*    /!*</XPath>*!/*/}
      {/*  </PositionProvider>*/}
      {/*  /!*</BestPath>*!/*/}
      {/*  /!*</PositionProvider>*!/*/}

      {/*  /!*<XHead />*!/*/}
      {/*</AutoAnchor>*/}
      {/*<svg*/}
      {/*  style={{*/}
      {/*    overflow: "visible",*/}
      {/*  }}*/}
      {/*>*/}
      {/*  <line x1={0} y1={0} x2={100} y2={100} stroke={"red"}>*/}
      {/*    <XHead color={"red"} />*/}
      {/*  </line>*/}
      {/*</svg>*/}

      {/* my arrows */}
      {/*<BestPathSmoothXArrow start={box1Ref} end={box2Ref} headSharpness={0.25} />*/}
      {/*<BestPathGridXArrow start={box1Ref} end={box2Ref} breakPoint={0.5} startAnchor={"left"} endAnchor={"top"} />*/}
      {/*<AutoAnchorWithHeadXArrow start={box1Ref} end={box2Ref} headSize={50} />*/}
      {/*<SnakeXArrow start={box1Ref} end={box2Ref} />*/}
      {/*<SimpleLineXArrow start={box1Ref} end={box2Ref} />*/}
    </XWrapper>
  );
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

        <XHead />
      </XArrow>
    </div>
  );
}

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
