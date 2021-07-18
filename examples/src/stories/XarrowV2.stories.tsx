import React, { useRef, useState } from 'react';
import Xarrow, { xarrowPropsType } from 'react-xarrows';
import Draggable from 'react-draggable';
import { Meta, Story } from '@storybook/react';
import { Xwrapper, useXarrow } from 'react-xarrows';

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

const canvasStyle = {
  width: '100%',
  height: '100vh',
  background: 'white',
  overflow: 'auto',
  display: 'flex',
  color: 'black',
} as const;

const DraggableBox = ({ box }) => {
  const [, setRender] = useState({});
  const reRender = () => setRender({});

  console.log('DraggableBox render', box.id);
  const handleDrag = () => {
    updateXarrow();
  };
  const updateXarrow = useXarrow();
  return (
    <Draggable onDrag={reRender} onStop={reRender}>
      <div id={box.id} style={{ ...boxStyle, position: 'absolute', left: box.x, top: box.y }}>
        {box.id}
      </div>
    </Draggable>
  );
};

const TestComponent = () => {
  console.log('testComponent renders!');
  return <div />;
};

const SimpleTemplate = (xarrowProps: xarrowPropsType) => {
  const [, setRender] = useState({});
  const box2Ref = useRef();
  const box = { id: 'box1', x: 20, y: 20 };
  const box2 = { id: 'box2', x: 320, y: 120 };
  const box3 = { id: 'box3', x: 50, y: 150 };
  const box4 = { id: 'box4', x: 320, y: 220 };

  return (
    <div style={canvasStyle} id="canvas">
      <TestComponent />
      <Xwrapper>
        <DraggableBox box={box} />
        <DraggableBox box={box2} />
        <Xarrow start={'box1'} end={'box2'} {...xarrowProps} />
      </Xwrapper>
      <Xwrapper>
        <DraggableBox box={box3} />
        <DraggableBox box={box4} />
        <Xarrow start={'box3'} end={'box4'} {...xarrowProps} />
      </Xwrapper>
    </div>
  );
};

const SimpleTemplateStory: Story<xarrowPropsType> = (args) => <SimpleTemplate {...args} />;
export const V2 = SimpleTemplateStory.bind({});

export default {
  title: 'XarrowV2',
  component: Xarrow,
} as Meta;
