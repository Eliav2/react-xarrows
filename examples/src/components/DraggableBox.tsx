import Draggable, { DraggableEventHandler } from 'react-draggable';
import React, { CSSProperties, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useXarrow } from '../../../src';
// import { Rnd } from './Rnd';
// import { useXarrow } from 'react-xarrows';
import { Rnd } from 'react-rnd';

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
  // width: 100,
  // height: 30,
  // resize: 'both',
  // overflow: 'hidden',
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
  const nodeRef = useRef(null);
  let curRef = reference ? reference : nodeRef;

  const update = !onDrag ? useXarrow() : onDrag;
  let moreStyle = {};
  if (initialOffset) moreStyle = { position: 'absolute', left: initialOffset.x, top: initialOffset.y };

  return (
    <Rnd
      {...rest}
      // wrapperProps={{ style: {} }}
      // wrapperProps={{ style: { ...boxStyle, ...style, ...moreStyle } }}
      default={{
        x: initialOffset?.x ?? 0,
        // x: 50,
        y: initialOffset?.y ?? 0,
        width: 100,
        height: 30,
      }}
      ref={curRef}
      id={id}
      style={{ ...boxStyle, ...style, ...moreStyle, height: 100, width: 300 }}
      onDrag={update}
      onResize={update}>
      <div
      // ref={curRef} id={id}
      >
        {id}
      </div>

      {/*<div style={{ width: '100%', height: '100%' }}>{id}</div>*/}
    </Rnd>

    // <Draggable
    //   onDrag={(e, d) => {
    //     update(e, d);
    //   }}
    //   onStop={update}
    //   {...rest}>
    //   <div ref={curRef} id={id} style={{ ...boxStyle, ...style, ...moreStyle }}>
    //     {id}
    //   </div>
    // </Draggable>
  );
};
//
// export const DraggableBoxBetter: React.FC<DraggableBoxProps> = ({ ...args }) => {
//   return <DraggableBox {...args} />;
// };
