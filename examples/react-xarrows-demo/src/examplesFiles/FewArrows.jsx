import React, { useRef, useState } from 'react';
import Xarrow, { useXarrow, Xwrapper } from 'react-xarrows';
import Draggable from 'react-draggable';
import { boxStyle, canvasStyle } from '../ExamplePage';

const DraggableBox = ({ box }) => {
  const updateXarrow = useXarrow();
  console.log(box.id, 'render');
  return (
    <Draggable onDrag={updateXarrow} onStop={updateXarrow}>
      <div id={box.id} style={{ ...boxStyle, position: 'absolute', left: box.x, top: box.y }}>
        {box.id}
      </div>
    </Draggable>
  );
};

const FewArrows = () => {
  const boxes = [
    { id: 'box1', x: 50, y: 20, reference: useRef(null) },
    { id: 'box2', x: 20, y: 250, reference: useRef(null) },
    { id: 'box3', x: 350, y: 80, reference: useRef(null) },
  ];

  const [lines] = useState([
    {
      start: 'box1',
      end: 'box2',
      headSize: 14,
      labels: { end: 'endLabel' },
    },
    {
      start: 'box2',
      end: 'box3',
      color: 'red',
      labels: {
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
      // endAnchor: ["right", {position: "left", offset: {y: -10}}],
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
      <div style={{ ...canvasStyle, position: 'relative', color: 'black' }} id="canvas">
        <Xwrapper>
          {boxes.map((box, i) => (
            <DraggableBox box={box} key={i} />
          ))}
          {lines.map((line, i) => (
            <Xarrow key={i} {...line} />
          ))}
        </Xwrapper>
      </div>
      <br />
    </React.Fragment>
  );
};

export default FewArrows;
