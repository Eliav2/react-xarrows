import React, { useRef } from 'react';
import Xarrow from 'react-xarrows';
import Draggable from 'react-draggable';
// import Index from "./../../src/Index";

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
  background: 'white',
  borderRadius: '10px',
  textAlign: 'center',
  width: '100px',
  height: '30px',
  color: 'black',
  zIndex: 2,
};

const Box = ({ id }) => {
  return (
    <Draggable>
      <div id={id} style={boxStyle}>
        {id}
      </div>
    </Draggable>
  );
};

export default () => {
  return (
    <React.Fragment>
      <h3>
        <u>Simple Example:</u>
      </h3>
      <div style={canvasStyle} id="canvas">
        <Box id={'box1'} />
        <Box id={'box2'} />
        <Box id={'box3'} />
        {/*<Index start="box1" end={"box2"} />*/}
        <Xarrow start="box1" end={'box3'} advanced={{ passProps: { divContainer: { style: { zindex: 10 } } } }} />
      </div>
    </React.Fragment>
  );
};
