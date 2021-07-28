/* eslint-disable */
import React, { useRef, useState } from 'react';

import Xarrow, { xarrowPropsType, useXarrow, Xwrapper } from 'react-xarrows';
import Draggable from 'react-draggable';
import { Meta, Story } from '@storybook/react';

const flexBox = {
  display: 'flex',
  justifyContent: 'space-evenly',
  alignItems: 'center',
} as const;

const boxStyle = {
  border: '1px #999 solid',
  borderRadius: '10px',
  textAlign: 'center',
  width: '100px',
  height: '30px',
  color: 'black',
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'center',
} as const;

const Box = ({ id, style = {} }) => {
  return (
    <div id={id} style={{ ...boxStyle, ...style }}>
      {id}
    </div>
  );
};

export default {
  title: 'Xarrow',
  component: Xarrow,
} as Meta;

const TriggerTemplate = ({ ...args }) => {
  const [refId, setRefId] = useState(false);

  const endId = refId ? 'box2' : 'box3';

  return (
    <React.Fragment>
      <div style={{ ...flexBox, flexDirection: 'column', height: '100vh' }}>
        <div style={{ ...flexBox, height: '100vh', width: '100%' }} id="canvas">
          <div style={flexBox}>
            <Box id={'box1'} />
          </div>
          <div style={{ ...flexBox, flexDirection: 'column' }}>
            <Box id={'box2'} />
            <Box id={'box3'} />
          </div>
          <Xarrow start="box1" end={endId} {...args} />
        </div>
        <button onClick={() => setRefId(!refId)}>toggle end</button>
      </div>
    </React.Fragment>
  );
};

const TriggerTemplateStory: Story<xarrowPropsType> = (args) => <TriggerTemplate {...args} />;

export const ToggleEnd = TriggerTemplateStory.bind({});

ToggleEnd.args = {
  animateDrawing: true,
};

const canvasStyle = {
  width: '100%',
  height: '100vh',
  background: 'white',
  overflow: 'auto',
  display: 'flex',
  color: 'black',
};

const DraggableBox = ({ box, forceRerender, style = {} }) => {
  return (
    <Draggable onDrag={forceRerender} onStop={forceRerender}>
      <div ref={box.ref} id={box.id} style={{ ...boxStyle, position: 'absolute', left: box.x, top: box.y, ...style }}>
        {box.id}
      </div>
    </Draggable>
  );
};

type typeDim = { height: number; width: number };
type typeCustomSimpleTemplate = { [key: string]: any } & xarrowPropsType;
const SimpleTemplate = ({ box1: box1Style, box2: box2Style, ...xarrowProps }: any) => {
  const [, setRender] = useState({});
  const forceRerender = () => setRender({});
  const boxRef = useRef();
  const box2Ref = useRef();
  const box = { id: 'box1', x: 20, y: 20, ref: boxRef };
  const box2 = { id: 'box2', x: 320, y: 120, ref: box2Ref };
  return (
    <div style={canvasStyle} id="canvas">
      <DraggableBox box={box} forceRerender={forceRerender} style={box1Style} />
      <DraggableBox box={box2} forceRerender={forceRerender} style={box2Style} />
      <Xarrow start={box.ref} end={box2.id} {...xarrowProps} />
    </div>
  );
};

const SimpleTemplateStory: Story<typeCustomSimpleTemplate> = (args) => <SimpleTemplate {...args} />;

export const CustomSimple = SimpleTemplateStory.bind({});

CustomSimple.args = {
  box1: { height: 150, width: 60, zIndex: 13, background: 'white' },
  box2: { height: 90, width: 80, zIndex: 10, background: 'white' },
  zIndex: 2,
  startAnchor: 'right',
  endAnchor: 'left',
  label: { start: 'start', middle: 'middle', end: 'end' },
  color: 'CornflowerBlue',
  lineColor: null,
  headColor: null,
  tailColor: null,
  strokeWidth: 4,
  showHead: true,
  headSize: 6,
  showTail: false,
  tailSize: 6,
  path: 'smooth',
  curveness: 0.8,
  gridBreak: '50%',
  dashness: false,
  headShape: 'arrow1',
  tailShape: 'arrow1',
  animateDrawing: false,
  showXarrow: true,
  _debug: true,
  _extendSVGcanvas: 1000,
};

export const CustomAdvanced = CustomSimple.bind({});

CustomAdvanced.args = {
  startAnchor: {
    position: 'right',
    offset: { x: 0, y: 0 },
  },
  endAnchor: {
    position: 'left',
    offset: { x: 0, y: 0 },
    // facingDir: ['outwards', 'inwards'],
  },
  label: { start: '', middle: '', end: '' },
  path: 'smooth',
  // dashness: { strokeLen: 10, nonStrokeLen: 15, animation: -2 },
  dashness: false,
  headSize: 6,
  tailSize: 6,
  headShape: 'arrow1',
  tailShape: 'arrow1',
  showXarrow: true,
  animateDrawing: 0,
  _debug: true,
  _extendSVGcanvas: 300,
};

export const CustomSvgHead = CustomSimple.bind({});
CustomSvgHead.args = {
  headSize: 6,
  // headShape: 'circle',
  headShape: { svgElem: <path d="M 0 0 L 1 0.5 L 0 1 L 0.25 0.5 z" />, offsetForward: 0.25 },
  arrowHeadProps: { fill: 'transparent', strokeWidth: '0.1', stroke: 'CornflowerBlue' },
  _extendSVGcanvas: 500,
};

export const gridBreak = CustomSvgHead.bind({});
gridBreak.args = {
  path: 'grid',
  endAnchor: 'right',
  gridBreak: '50%',
  arrowBodyProps: {},
  _extendSVGcanvas: 100,
};

const DraggableBox2 = ({ id, forceRerender, style = {} }) => {
  const updateXarrow = useXarrow();
  return (
    <Draggable onDrag={updateXarrow} onStop={updateXarrow}>
      <div id={id} style={{ ...boxStyle, position: 'relative', ...style }}>
        {id}
      </div>
    </Draggable>
  );
};

const AllStatesTemplate = ({ box: boxStyle, ...xarrowProps }) => {
  const [, setRender] = useState({});
  const forceRerender = () => setRender({});
  let boxNum = -1;
  // const states = ['right'];
  const states = ['right', 'left', 'bottom', 'top'] as const;
  // const states = ['right'];
  return (
    <div style={{ ...canvasStyle, position: 'absolute', flexWrap: 'wrap' }} id="canvas">
      <Xwrapper>
        {states.map((st) =>
          states.map((st2) => {
            boxNum += 2;
            return (
              <div
                style={{
                  ...canvasStyle,
                  alignItems: 'center',
                  justifyContent: 'space-evenly',
                  width: 250,
                  height: 100,
                  border: '2px solid black',
                  // position: 'relative', TODO: investigate: why causing infinity loop(when endAnchor='right')??
                }}
                key={st + st2}>
                <div style={{ position: 'absolute', left: 0, top: 0 }}>
                  {st} -{'>'} {st2}
                </div>
                <Xwrapper>
                  <DraggableBox2 id={boxNum} forceRerender={forceRerender} style={{ ...boxStyle }} />
                  <DraggableBox2 id={boxNum + 1} forceRerender={forceRerender} style={{ ...boxStyle }} />
                  <Xarrow
                    start={String(boxNum)}
                    end={String(boxNum + 1)}
                    {...xarrowProps}
                    startAnchor={st}
                    endAnchor={st2}
                  />
                </Xwrapper>
              </div>
            );
          })
        )}
      </Xwrapper>
    </div>
  );
};

export const AllStates: Story<{ box: typeDim } & xarrowPropsType> = (ar) => <AllStatesTemplate {...ar} />;
AllStates.args = {
  box: { height: 30, width: 50 },
  labels: null,
  color: 'CornflowerBlue',
  lineColor: null,
  headColor: null,
  tailColor: null,
  strokeWidth: 4,
  showHead: true,
  headSize: 6,
  showTail: false,
  tailSize: 6,
  path: 'smooth',
  curveness: 0.8,
  gridBreak: '50%',
  dashness: false,
  headShape: 'arrow1',
  tailShape: 'arrow1',
  animateDrawing: false,
  showXarrow: true,
  _debug: false,
};
