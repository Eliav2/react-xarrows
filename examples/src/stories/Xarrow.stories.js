import React, { useState } from 'react';

import Xarrow from 'react-xarrows';

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
      <div style={{ ...flexBox, flexDirection: 'column' }}>
        <div style={{ ...flexBox, height: '50vh', width: '100%' }} id="canvas">
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

ToggleEnd.args = {};

export default {
  title: 'Xarrow',
  component: Xarrow,
};
