import React from 'react';
import Draggable from 'react-draggable';
import Xarrow, { useXarrow, Xwrapper } from 'react-xarrows';

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

const DraggableBox = ({ id }: { id: string }) => {
  const updateXarrow = useXarrow();
  return (
    <Draggable onDrag={updateXarrow} onStop={updateXarrow}>
      <div id={id} style={boxStyle}>
        {id}
      </div>
    </Draggable>
  );
};

function V2Example() {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-evenly', width: '100%' }}>
      <Xwrapper>
        <DraggableBox id={'elem1'} />
        <DraggableBox id={'elem2'} />
        <Xarrow start={'elem1'} end="elem2" />
      </Xwrapper>
    </div>
  );
}
export default V2Example;
