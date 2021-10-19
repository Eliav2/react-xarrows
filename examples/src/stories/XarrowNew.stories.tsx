import { Meta } from '@storybook/react';
import XarrowBuilder from '../../../src/components/XarrowBuilder';
import React, { useState } from 'react';
import { DraggableBox } from '../components/DraggableBox';
import { Xwrapper } from 'react-xarrows';
import XarrowMainNew from '../../../src/components/XarrowMainNew';

export default {
  title: 'XarrowBuilder',
  component: XarrowBuilder,
} as Meta;

export const XarrowMainTemplate = () => {
  const [, render] = useState({});
  const reRender = () => render({});
  return (
    <div>
      <Xwrapper>
        <button onClick={reRender}>reRender</button>
        <div style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-around' }}>
          <DraggableBox id={'box1'} dragGrid={[20, 20]} initialOffset={{ x: 420, y: 150 }} />
          <DraggableBox id={'box2'} dragGrid={[20, 20]} initialOffset={{ x: 500, y: 200 }} />
          <XarrowMainNew start={'box1'} end={'box2'} />
        </div>
      </Xwrapper>
    </div>
  );
};
