import React from 'react';
import Xarrow, { useXarrow, xarrowPropsType, Xwrapper } from 'react-xarrows';
import Draggable from 'react-draggable';
import { Meta, Story } from '@storybook/react';

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
  height: '50vh',
  background: 'white',
  // overflow: 'auto',
  display: 'flex',
  color: 'black',
} as const;

const DraggableBox = ({ box }) => {
  const updateXarrow = useXarrow();
  return (
    <Draggable onDrag={updateXarrow} onStop={updateXarrow}>
      <div id={box.id} style={{ ...boxStyle, position: 'absolute', left: box.x, top: box.y }}>
        {box.id}
      </div>
    </Draggable>
  );
};

const SimpleTemplate = () => {
  const box = { id: 'box1', x: 20, y: 20 };
  const box2 = { id: 'box2', x: 320, y: 120 };
  const box3 = { id: 'box3', x: 50, y: 150 };
  const box4 = { id: 'box4', x: 320, y: 220 };
  return (
    <div style={canvasStyle} id="canvas">
      <Xwrapper>
        <DraggableBox box={box} />
        <DraggableBox box={box2} />
        <Xarrow start={'box1'} end={'box2'} />
        <Xarrow start={'box1'} end={'box2'} endAnchor={'top'} />
        <Xarrow start={'box1'} end={'box2'} startAnchor={'bottom'} />
      </Xwrapper>
      <Xwrapper>
        <DraggableBox box={box3} />
        <DraggableBox box={box4} />
        <Xarrow start={'box3'} end={'box4'} />
      </Xwrapper>
    </div>
  );
};

const SimpleTemplateStory: Story<xarrowPropsType> = (args) => <SimpleTemplate />;
export const V2 = SimpleTemplateStory.bind({});

const ScrolledDiv = ({ children, style }) => {
  const updateXarrow = useXarrow();
  return (
    <div
      style={{ height: '150%', width: 300, overflow: 'auto', position: 'relative', ...style }}
      onScroll={updateXarrow}>
      {children}
    </div>
  );
};

const ScrollTemplate = () => {
  const box = { id: 'box1', x: 20, y: 20 };
  const box2 = { id: 'box2', x: 320, y: 120 };
  return (
    <div style={{ ...canvasStyle, background: '#e0ffd2' }} id="canvas">
      <Xwrapper>
        <ScrolledDiv style={{ background: '#d2f6ff' }}>
          <DraggableBox box={box} />
        </ScrolledDiv>
        <ScrolledDiv style={{ background: '#f8d2ff' }}>
          <DraggableBox box={box2} />
        </ScrolledDiv>
        <Xarrow start={'box1'} end={'box2'} />
      </Xwrapper>
    </div>
  );
};

export const V2Scroll = ScrollTemplate.bind({});

export default {
  title: 'XarrowV2',
  component: Xarrow,
} as Meta;
