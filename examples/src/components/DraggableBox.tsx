import Draggable, { DraggableEventHandler } from 'react-draggable';
import React, { CSSProperties, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useXarrow } from '../../../src';
// import { useXarrow } from 'react-xarrows';

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

interface DraggableBoxProps {
  initialOffset?: { x: number; y: number };
  reference?: React.MutableRefObject<any>;
  id?: string;
  onDrag?: DraggableEventHandler;
  style?: CSSProperties;
  [key: string]: any;
}

export const DraggableBox = ({
  initialOffset = undefined,
  reference = undefined,
  id = undefined,
  onDrag = null,
  style = {},
  ...rest
}: DraggableBoxProps) => {
  const [render, setRender] = useState({});
  const reRender = () => setRender({});
  const nodeRef = useRef(null);
  let curRef = reference ? reference : nodeRef;

  const update = !onDrag ? useXarrow() : onDrag;
  let moreStyle = {};
  if (initialOffset) moreStyle = { position: 'absolute', left: initialOffset.x, top: initialOffset.y };

  return (
    <Draggable
      onDrag={(e, d) => {
        update(e, d);
      }}
      onStop={update}
      {...rest}>
      <div ref={curRef} id={id} style={{ ...boxStyle, ...style, ...moreStyle }}>
        {id}
      </div>
    </Draggable>
  );
};

export const DraggableBoxBetter: React.FC<DraggableBoxProps> = ({ ...args }) => {
  return <DraggableBox {...args} />;
};
