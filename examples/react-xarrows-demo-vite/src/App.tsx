import "./App.css";
import { XLine, XArrow, ProvideXContext, XArrowProps } from "react-xarrows/src/redesign/mock";
import { useUpdateXWrapper, XWrapper } from "react-xarrows/src/redesign/XWrapper";
import React, { useRef } from "react";
import Draggable from "react-draggable";
import useRerender from "shared/hooks/useRerender";
import { range } from "shared/utils";

interface BoxProps extends React.HTMLProps<HTMLDivElement> {
  children?: React.ReactNode;
}

const Box = ({ children, style, ...props }: BoxProps) => {
  // console.log(children, "render!");
  const render = useRerender();

  const updateXArrow = useUpdateXWrapper();
  // console.log(updateXArrow);
  const ref = useRef<HTMLDivElement>(null);
  return (
    <Draggable
      nodeRef={ref}
      // grid={[20, 20]}
      onDrag={() => {
        // console.log(children, "onDrag!");
        updateXArrow();
      }}
    >
      <div
        ref={ref}
        style={{
          border: "1px solid",
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 80,
          padding: 30,
          ...style,
        }}
        {...props}
      >
        {/*<button onClick={render}>render</button>*/}
        {children}
      </div>
    </Draggable>
  );
};

interface SnakeXArrowProps extends Pick<XArrowProps, "start" | "end"> {}

const SnakeXArrow = (props: SnakeXArrowProps) => {
  return (
    <XArrow {...props}>
      <ProvideXContext>
        {(context) => {
          const {
            startPoint: { x: x1, y: y1 },
            endPoint: { x: x2, y: y2 },
          } = context;
          const l = range(x1, x2, 50);
          const points: any = [];
          let len = x1;
          const last = l.at(-1) ?? 0;
          while (len < last) {
            points.push({ x1: len, y1: y1 ?? 0, x2: len + 50, y2: y1 });
            len += 50;
            if (len + 50 > last) {
              points.push({ x1: len, y1: y1 ?? 0, x2: len, y2: y2 });
              points.push({ x1: len, y1: y2 ?? 0, x2: x2, y2: y2 });
              break;
            }
            points.push({ x1: len, y1: y1 ?? 0, x2: len, y2: y2 });
            points.push({ x1: len, y1: y2 ?? 0, x2: len + 50, y2: y2 });
            len += 50;
            if (len + 50 > last) {
              points.push({ x1: len, y1: y2 ?? 0, x2: x2, y2: y2 });
              break;
            }
            points.push({ x1: len, y1: y2 ?? 0, x2: len, y2: y1 });
          }
          return points.map((p, i) => <XLine key={i} {...p} />);
        }}
      </ProvideXContext>
    </XArrow>
  );
};

const MyArrows = () => {
  console.log("MyArrows render");

  return (
    <>
      <XArrow start={"box1"} end={"box2"}>
        <XLine />
      </XArrow>
      <XArrow start={"box1"} end={"box2"}>
        <ProvideXContext>
          {(context) => {
            const {
              startPoint: { x: x1, y: y1 },
              endPoint: { x: x2, y: y2 },
            } = context;
            return <XLine x1={x1 - 30} y1={y1} x2={x2 - 30} y2={y2} />;
          }}
        </ProvideXContext>
      </XArrow>

      <SnakeXArrow start={"box1"} end={"box2"} />
    </>
  );
};

const MyBoxes = () => {
  console.log("MyBoxes render");
  return (
    <div style={{ display: "flex", justifyContent: "space-around" }}>
      <Box id={"box1"}>box1</Box>
      <Box id={"box2"}>box2</Box>
    </div>
  );
};

function App() {
  return (
    <React.StrictMode>
      <div className="App">
        <XWrapper>
          <MyBoxes />
          <div style={{ height: 50 }} />
          <MyArrows />
        </XWrapper>
      </div>
    </React.StrictMode>
  );
}

export default App;
