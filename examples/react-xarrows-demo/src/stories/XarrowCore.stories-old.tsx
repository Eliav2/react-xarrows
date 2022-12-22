import React, { useRef, useState } from "react";
import { Meta, Story } from "@storybook/react";
import XarrowCore from "react-xarrows/src/components/XarrowCore";
import { Xwrapper } from "packages/react-xarrows/src";
import { DraggableBox } from "../components/DraggableBox";
import XarrowBasicPath from "react-xarrows/src/components/XarrowBasicPath";
import XarrowMain from "react-xarrows/src/components/XarrowMain";
import Xelem from "react-xarrows/src/components/Xelem";

export default {
  title: "XarrowCore",
  component: XarrowCore,
} as Meta;

const XarrowMainTemplate = ({ XComp = XarrowMain, args }) => {
  const [showBox1, setShowBox1] = useState(true);
  const [showBox2, setShowBox2] = useState(true);
  const [trigger, setTrigger] = useState(true);

  const target = trigger ? "box2" : "box3";
  // const update = useXarrow();

  let arr = new Array(0).fill({});
  // console.log('XarrowMainTemplate');
  return (
    <div>
      <button onClick={() => setShowBox1(!showBox1)}>show box1</button>
      <button onClick={() => setShowBox2(!showBox2)}>show box2</button>
      <button onClick={() => setTrigger(!trigger)}>trigger connection</button>
      <Xwrapper>
        <Xelem>{(updateXarrow) => <button onClick={updateXarrow}>update Xarrow</button>}</Xelem>
        <div style={{ display: "flex", width: "100%", alignItems: "center", justifyContent: "space-around" }}>
          {showBox1 ? <DraggableBox id={"box1"} dragGrid={[20, 20]} initialOffset={{ x: 420, y: 150 }} /> : null}
          {showBox2 ? <DraggableBox id={"box2"} dragGrid={[20, 20]} initialOffset={{ x: 500, y: 200 }} /> : null}
          <XComp
            start={"box1"}
            end={target}
            startAnchor={[{ position: "left" }]}
            endAnchor={["left"]}
            path={"straight"}
            // arrowTailProps={{ style: { transform: 'translate(100px) rotate(90deg)', transformOrigin: 'center' } }}
            {...args}
          />
          <DraggableBox id={"box3"} dragGrid={[20, 20]} initialOffset={{ x: 50, y: 100 }} />
          {/*<DraggableBox id={'box4'} grid={[20, 20]} initialOffset={{ x: 250, y: 100 }} />*/}
          {/*<XComp start={{ x: 50, y: 150 }} end={'box4'} />*/}
        </div>
      </Xwrapper>
    </div>
  );
};

// export const XarrowCoreStory: Story = (args) => <XarrowMainTemplate XComp={XarrowCore} />;
export const XarrowBasicStory: Story = (args) => (
  <XarrowMainTemplate
    XComp={() => (
      <XarrowCore start={"box1"} end={"box2"}>
        {(elems) => {
          return <XarrowBasicPath {...elems} />;
        }}
      </XarrowCore>
    )}
    args={undefined}
  />
);
// export const XarrowAnchorsStory: Story = (args) => <XarrowMainTemplate XComp={XarrowAnchors} />;
export const XarrowMainStory: Story = (args) => <XarrowMainTemplate XComp={XarrowMain} args={args} />;
XarrowMainStory.args = {
  startAnchor: "auto",
  endAnchor: "right",
  path: "grid",
  gridBreak: "50%",
  curveness: "0%",
  strokeWidth: 4,
  _debug: true,
  color: "blue",
  showHead: false,
  showTail: true,
  headColor: undefined,
  tailColor: undefined,
  headSize: 40,
  tailSize: 40,
  // headShape: 'circle',
  // tailShape: 'circle',
};

const canvasStyle = {
  width: "100%",
  height: "50vh",
  background: "white",
  // overflow: 'auto',
  display: "flex",
  color: "black",
} as const;

const _canvasStyle = { ...canvasStyle, position: "relative", height: 300 } as const;
const ManyArrowsNum = 200;
const ManyDraggablesNum = 2000;
export const ManyArrows = (args) => {
  const box = { id: "box1", initialOffset: { x: 20, y: 20 }, reference: useRef(null) };
  const box2 = { id: "box2", initialOffset: { x: 320, y: 120 }, reference: useRef(null) };
  const box3 = { id: "box3", initialOffset: { x: 50, y: 150 }, reference: useRef(null) };
  const box4 = { id: "box4", initialOffset: { x: 320, y: 220 }, reference: useRef(null) };

  const box10 = { id: "box1", initialOffset: { x: 20, y: 20 }, reference: useRef(null) };
  const box11 = { id: "box2", initialOffset: { x: 320, y: 120 }, reference: useRef(null) };

  return (
    <div>
      <div style={_canvasStyle} id="canvas">
        {/*<Xwrapper>*/}
        {/*  <DraggableBox {...box} />*/}
        {/*  <DraggableBox {...box2} />*/}
        {/*  <XarrowMain start={box.reference} end={box2.reference} />*/}
        {/*  <XarrowMain start={box.reference} end={box2.reference} endAnchor={'top'} />*/}
        {/*  <XarrowMain start={box.reference} end={box2.reference} startAnchor={'bottom'} />*/}
        {/*</Xwrapper>*/}
        {/*<Xwrapper>*/}
        {/*  <DraggableBox {...box3} />*/}
        {/*  <DraggableBox {...box4} />*/}
        {/*  <XarrowMain start={box3.id} end={box4.id} />*/}
        {/*</Xwrapper>*/}
      </div>
      <h1>{ManyArrowsNum} arrows</h1>
      <div style={_canvasStyle} id="canvas">
        <Xwrapper>
          <DraggableBox {...box10} />
          <DraggableBox {...box11} />
          <XarrowMain start={box.reference} end={box2.reference} />
          {Array(ManyArrowsNum)
            .fill(undefined)
            .map((v, i) => {
              return (
                <XarrowMain
                  start={box.reference}
                  end={box2.reference}
                  // startAnchor={'bottom'}
                  // endAnchor={'top'}
                  key={i}
                />
              );
            })}
          <XarrowMain start={box10.reference} end={box11.reference} endAnchor={"top"} />
          <XarrowMain start={box10.reference} end={box11.reference} startAnchor={"bottom"} />
          {/*</Xwrapper>*/}
          {/*<Xwrapper>*/}
          {/*  <DraggableBox {...box3} />*/}
          {/*  <DraggableBox {...box4} />*/}
          {/*  <XarrowMain start={box3.reference} end={box4.reference} />*/}
        </Xwrapper>
      </div>
      <h1>{ManyDraggablesNum} draggables</h1>
      {/*  <Draggable>*/}
      {/*    <div style={boxStyle as React.CSSProperties}>*/}
      {/*      {Array(ManyDraggablesNum)*/}
      {/*        .fill(undefined)*/}
      {/*        .map((v, i) => {*/}
      {/*          return (*/}
      {/*            <Draggable key={i}>*/}
      {/*              <div style={{ position: 'absolute' }}>{i}</div>*/}
      {/*            </Draggable>*/}
      {/*          );*/}
      {/*        })}*/}
      {/*    </div>*/}
      {/*  </Draggable>*/}
    </div>
  );
};

ManyArrows.args = {
  startAnchor: "left",
  endAnchor: "right",
  path: "grid",
  gridBreak: "50%",
  curveness: "0%",
  strokeWidth: 4,
  _debug: true,
};

// const TestComponent = () => {
//   console.log('TestComponent');
//   return <div> testing rendering </div>;
// };
//
// export const TestAutoResizeSvg = () => {
//   const [, setRender] = useState({});
//   const forceRerender = () => setRender({});
//
//   return (
//     <div>
//       <button onClick={forceRerender}>reRender</button>
//       <div style={{ display: 'flex', justifyContent: 'space-evenly', width: '100%' }}>
//         <div>
//           <h1>Auto resize svg</h1>
//           <div style={{ height: 100 }}>
//             <AutoResizeSvg>
//               {/*<Draggable>*/}
//               {/*  <circle cx="50" cy="50" r="40" stroke="black" strokeWidth="3" fill="red" />*/}
//               {/*</Draggable>*/}
//
//               {(updateSvg) => (
//                 <Draggable onDrag={updateSvg}>
//                   <circle cx="50" cy="50" r="40" stroke="black" strokeWidth="3" fill="red" />
//                 </Draggable>
//               )}
//             </AutoResizeSvg>
//           </div>
//         </div>
//         <div>
//           <h1>normal svg</h1>
//           <div style={{ height: 100 }}>
//             <svg
//               style={{
//                 border: 'solid yellow 1px',
//                 position: 'absolute',
//                 height: 100,
//                 width: 100,
//               }}>
//               <Draggable>
//                 <circle cx="50" cy="50" r="40" stroke="black" strokeWidth="3" fill="red" />
//               </Draggable>
//             </svg>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
