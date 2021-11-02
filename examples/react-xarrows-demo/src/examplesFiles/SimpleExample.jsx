import React, { useRef } from 'react';
import Xarrow from 'react-xarrows';

const canvasStyle = {
  position: 'relative',
  height: '20vh',
  background: 'white',
  display: 'flex',
  justifyContent: 'space-evenly',
  alignItems: 'center',
};

const boxStyle = {
  position: 'relative',
  border: '1px #999 solid',
  borderRadius: '10px',
  textAlign: 'center',
  width: '100px',
  height: '30px',
  color: 'black',
};

const Box = (props) => {
  return (
    <div ref={props.box.ref} id={props.box.id} style={boxStyle}>
      {props.box.id}
    </div>
  );
};

const SimpleExample = ({ ...args }) => {
  console.log('SimpleExample update');
  const box1 = { id: 'box1', ref: useRef(null) };
  const box2 = { id: 'box2', ref: useRef(null) };

  return (
    <React.Fragment>
      <h3>
        <u>Simple Example:</u>
      </h3>
      <div style={canvasStyle} id="canvas">
        <Box box={box1} />
        <Box box={box2} />
        <Xarrow start={box1.id} end={box2.ref} {...args} />
      </div>
    </React.Fragment>
  );
};

export default SimpleExample;
