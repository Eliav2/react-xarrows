import React, { useState, useRef } from 'react';
import Xarrow from 'react-xarrows';
import Draggable from 'react-draggable';
import { boxContainerStyle, canvasStyle } from '../ExamplePage';

const FewArrows = () => {
  const [, setRender] = useState({});
  const forceRerender = () => setRender({});

  const boxes = [
    { id: 'box1', x: 50, y: 20, ref: useRef(null) },
    { id: 'box2', x: 20, y: 250, ref: useRef(null) },
    { id: 'box3', x: 350, y: 80, ref: useRef(null) },
  ];

  const [lines] = useState([
    {
      start: 'box1',
      end: 'box2',
      headSize: 14,
      label: { end: 'endLabel' },
    },
    {
      start: 'box2',
      end: 'box3',
      color: 'red',
      label: {
        middle: (
          <div
            contentEditable
            suppressContentEditableWarning={true}
            style={{ font: 'italic 1.5em serif', color: 'purple' }}>
            Editable label
          </div>
        ),
      },
      headSize: 0,
      strokeWidth: 15,
    },
    {
      start: 'box3',
      end: 'box1',
      color: 'green',
      path: 'grid',
      // endAnchor: ["right", {position: "left", offset: {bottomness: -10}}],
      dashness: { animation: 1 },
    },
  ]);

  return (
    <React.Fragment>
      <h3>
        <u>Example1:</u>
      </h3>
      <p>
        automatic anchoring to the minimal length. works also when inside scrollable window. drag the boxes to play
        around.
      </p>
      <div style={canvasStyle} id="canvas">
        <div style={boxContainerStyle} id="boxContainerConatinerStyle">
          <div style={boxContainerStyle} id="boxContainerStyle">
            {boxes.map((box, i) => (
              <Draggable onStop={forceRerender} onDrag={forceRerender} key={i}>
                <div id={box.id} style={{ ...boxStyle, left: box.x, top: box.y }}>
                  {box.id}
                </div>
              </Draggable>
            ))}
            {lines.map((line, i) => (
              <Xarrow key={i} {...line} />
            ))}
          </div>
        </div>
      </div>
      <br />
    </React.Fragment>
  );
};

export default FewArrows;
