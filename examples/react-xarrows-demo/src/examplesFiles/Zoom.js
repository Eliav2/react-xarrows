import React, { useState, useRef } from 'react';
import Xarrow from 'react-xarrows';
import Draggable from 'react-draggable';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

const boxStyle = {
  position: 'absolute',
  background: 'white',
  border: '1px #999 solid',
  borderRadius: '10px',
  textAlign: 'center',
  width: '100px',
  height: '30px',
  color: 'black',
};

const canvasStyle = {
  width: '80vw',
  height: '100vh',
  background: 'white',
  color: 'black',
};

const Box = (props) => {
  return (
    <Draggable onDrag={() => props.forceRerender({})} onStop={() => props.forceRerender({})}>
      <div ref={props.box.reference} id={props.box.id} style={{ ...boxStyle, left: props.box.x, top: props.box.y }}>
        {props.box.id}
      </div>
    </Draggable>
  );
};

const Example2 = () => {
  const [, forceRerender] = useState({});
  const box = {
    id: 'box1',
    x: 50,
    y: 50,
  };
  const box2 = {
    id: 'box2',
    x: 320,
    y: 120,
  };

  const panOptions = { disableOnTarget: ['dragTable'] };
  const transformOptions = {
    limitToBounds: false,
    minScale: 0.25,
    maxScale: 3,
  };

  // this is the importent part of the example! play with the props to undestand better the API options
  const props = {
    start: 'box1', //  can be string
    end: 'box2', //  or reference
    startAnchor: ['auto'],
    endAnchor: ['auto'],
    curveness: 0.8,
    color: '#424242',
    strokeWidth: 3,
    headSize: 5,
    label: {
      middle: <button>Label</button>,
    },
    monitorDOMchanges: true,
    registerEvents: [],
  };

  return (
    <div style={{ background: 'blue' }}>
      <TransformWrapper
        defaultScale={1}
        options={transformOptions}
        pan={panOptions}
        onPanning={() => forceRerender({})}
        onWheel={() => forceRerender({})}>
        <TransformComponent>
          <div style={canvasStyle} id="canvas">
            <Box box={box} forceRerender={forceRerender} />
            <Box box={box2} forceRerender={forceRerender} />
          </div>
        </TransformComponent>
      </TransformWrapper>
      <Xarrow {...props} />
    </div>
  );
};

export default Example2;
