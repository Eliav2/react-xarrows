import "./App.css";
import { XLine, XArrow, XArrowElement, XWrapper, useXArrow } from "react-xarrows/src/redesign/mock";
import React, { useRef } from "react";
import Draggable from "react-draggable";
import useRerender from "shared/hooks/useRerender";

interface BoxProps extends React.HTMLProps<HTMLDivElement> {
  children?: React.ReactNode;
}

const Box = ({ children, style, ...props }: BoxProps) => {
  const render = useRerender();
  console.log(children, "render!");

  const renderXArrow = useXArrow();
  // console.log(renderXArrow);
  const ref = useRef<HTMLDivElement>(null);
  return (
    <Draggable
      nodeRef={ref}
      grid={[10, 10]}
      onDrag={() => {
        console.log(children, "onDrag!");
        // console.log(renderXArrow);
        renderXArrow.render();
        // renderXArrow;
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
        <button onClick={render}>render</button>
        {children}
      </div>
    </Draggable>
  );
};

const MyArrows = () => {
  console.log("MyArrows render");

  return (
    <XArrow start={"box1"} end={"box2"}>
      <XLine />
      {/*<XArrowElement />*/}
      {/*<Xline x={'0%'} y={'0%'}/>*/}
      {/*<path d="M10 10" />*/}
      {/*<path d="M 10 10 H 90 V 90 H 10 Z" fill="transparent" stroke="black" />*/}
    </XArrow>
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
