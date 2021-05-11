import React, { useRef, useState } from 'react';

import Xarrow, { xarrowPropsType } from 'react-xarrows';
import Draggable from 'react-draggable';

const flexBox = {
  display: 'flex',
  justifyContent: 'space-evenly',
  alignItems: 'center',
};

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
};

const Box = ({ id }) => {
  return (
    <div id={id} style={boxStyle}>
      {id}
    </div>
  );
};

const SimpleExampleTemplate = ({ ...args }) => {
  const [refId, setRefId] = useState(false);

  const endId = refId ? 'box2' : 'box3';
  console.log(endId);

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

const Template = (args) => <SimpleExampleTemplate {...args} />;

export const ToggleEnd = Template.bind({});

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

const DraggableBox = ({ box, forceRerender }) => {
  return (
    <Draggable onDrag={forceRerender} onStop={forceRerender}>
      <div ref={box.ref} id={box.id} style={{ ...boxStyle, position: 'absolute', left: box.x, top: box.y }}>
        {box.id}
      </div>
    </Draggable>
  );
};

const DraggableTemplate = (props) => {
  const [, setRender] = useState({});
  const forceRerender = () => setRender({});
  const box = { id: 'box1', x: 20, y: 20 };
  const box2 = { id: 'box2', x: 320, y: 120 };
  return (
    <div style={canvasStyle} id="canvas">
      <DraggableBox box={box} forceRerender={forceRerender} />
      <DraggableBox box={box2} forceRerender={forceRerender} />
      <Xarrow start={'box1'} end={'box2'} {...props} />
    </div>
  );
};

export const CustomSimple = (args) => <DraggableTemplate {...args} />;

CustomSimple.args = {
  startAnchor: 'auto',
  endAnchor: 'auto',
  label: null,
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
  gridBreak: 0.5,
  dashness: false,
  headShape: 'arrow1',
  tailShape: 'arrow1',
  animateDrawing: false,
  showXarrow: true,
};

export const CustomAdvanced = CustomSimple.bind({});
CustomAdvanced.args = {
  startAnchor: { position: 'right', offset: { rightness: 0, bottomness: 7 } },
  endAnchor: { position: 'left', offset: { rightness: 0, bottomness: -7 } },
  label: { start: '', middle: '', center: '' },
  path: 'smooth',
  dashness: { strokeLen: 10, nonStrokeLen: 15, animation: -2 },
  headSize: 6,
  tailSize: 6,
  headShape: 'arrow1',
  tailShape: 'arrow1',
  showXarrow: true,
  animateDrawing: 1,
  _extendSVGcanvas: 0,
};

export const CustomSvgHead = CustomSimple.bind({});
CustomSvgHead.args = {
  headSize: 6,
  headShape: 'circle',
  // headShape: {
  //   svgElem: 'path',
  //   svgProps: { d: `M 0 24 l -4.122 -4 8 -8 -8 -8 4.122-4 11.878 12 z` },
  //   offsetForward: 0,
  // },
  arrowHeadProps: { fill: 'transparent', strokeWidth: '0.1', stroke: 'CornflowerBlue' },
  _extendSVGcanvas: 500,
};

export const gridBreak = CustomSvgHead.bind({});
gridBreak.args = {
  path: 'grid',
  gridBreak: 0.5,
  arrowBodyProps: {},
};

export default {
  title: 'Xarrow',
  component: Xarrow,
};
