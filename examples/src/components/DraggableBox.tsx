import Draggable from 'react-draggable';
import React from 'react';
import { useXarrow } from 'react-xarrows';

export const boxStyle = {
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

export const DraggableBox = ({ initialOffset = undefined, reference = undefined, id = undefined, ...style }) => {
  const updateXarrow = useXarrow();
  let moreStyle = {};
  if (initialOffset) moreStyle = { position: 'absolute', left: initialOffset.x, top: initialOffset.y };
  return (
    <Draggable onDrag={updateXarrow} onStop={updateXarrow}>
      <div ref={reference} id={id} style={{ ...boxStyle, ...style, ...moreStyle }}>
        {id}
      </div>
    </Draggable>
  );
};
