import React, { useRef } from 'react';
import { Meta } from '@storybook/react';

import Xarrow, { Xwrapper } from 'react-xarrows';
import { DraggableBox } from '../components/DraggableBox';
import Draggable from 'react-draggable';
import { boxStyle } from '../ExamplePage';

export default {
  title: 'Xarrow Tasks',
  component: Xarrow,
} as Meta;

const canvasStyle = {
  width: '100%',
  height: '50vh',
  background: 'white',
  // overflow: 'auto',
  display: 'flex',
  color: 'black',
} as const;

const _canvasStyle = { ...canvasStyle, position: 'relative', height: 300 } as const;

const ManyArrowsNum = 200;
const ManyDraggablesNum = 2000;
export const ManyArrows = () => {
  const box = { id: 'box1', initialOffset: { x: 20, y: 20 }, reference: useRef(null) };
  const box2 = { id: 'box2', initialOffset: { x: 320, y: 120 }, reference: useRef(null) };
  const box3 = { id: 'box3', initialOffset: { x: 50, y: 150 }, reference: useRef(null) };
  const box4 = { id: 'box4', initialOffset: { x: 320, y: 220 }, reference: useRef(null) };
  return (
    <div>
      <div style={_canvasStyle} id="canvas">
        <Xwrapper>
          <DraggableBox {...box} />
          <DraggableBox {...box2} />
          <Xarrow start={box.reference} end={box2.reference} />
          <Xarrow start={box.reference} end={box2.reference} endAnchor={'top'} />
          <Xarrow start={box.reference} end={box2.reference} startAnchor={'bottom'} />
        </Xwrapper>
        <Xwrapper>
          <DraggableBox {...box3} />
          <DraggableBox {...box4} />
          <Xarrow start={box3.reference} end={box4.reference} />
        </Xwrapper>
      </div>
      <h1>{ManyArrowsNum} arrows</h1>
      <div style={_canvasStyle} id="canvas">
        <Xwrapper>
          <DraggableBox {...box} />
          <DraggableBox {...box2} />
          <Xarrow start={box.reference} end={box2.reference} />
          {Array(ManyArrowsNum)
            .fill(undefined)
            .map((v, i) => {
              return <Xarrow start={box.reference} end={box2.reference} endAnchor={'top'} key={i} />;
            })}
          <Xarrow start={box.reference} end={box2.reference} endAnchor={'top'} />
          <Xarrow start={box.reference} end={box2.reference} startAnchor={'bottom'} />
        </Xwrapper>
        <Xwrapper>
          <DraggableBox {...box3} />
          <DraggableBox {...box4} />
          <Xarrow start={box3.reference} end={box4.reference} />
        </Xwrapper>
      </div>
      <h1>{ManyDraggablesNum} draggables</h1>
      <Draggable>
        <div style={boxStyle as React.CSSProperties}>
          {Array(ManyDraggablesNum)
            .fill(undefined)
            .map((v, i) => {
              return (
                <Draggable key={i}>
                  <div style={{ position: 'absolute' }}>{i}</div>
                </Draggable>
              );
            })}
        </div>
      </Draggable>
    </div>
  );
};
