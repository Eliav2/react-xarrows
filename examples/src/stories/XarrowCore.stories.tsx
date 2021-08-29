import React, { useEffect, useRef, useState } from 'react';
import { Meta, Story } from '@storybook/react';
import CustomXarrow from '../../../src/Xarrow/XarrowCore';
import Xarrow, { useMultipleRenders, xarrowPropsType, Xwrapper } from '../../../src';
import { DraggableBox } from '../components/DraggableBox';
import { DelayedComponent } from '../../../src/components/DelayedComponent';

export default {
  title: 'XarrowCore',
  component: CustomXarrow,
} as Meta;

const XarrowCoreTestTemplate = (args) => {
  const [render, setRender] = useState({});
  const reRender = () => setRender({});

  return (
    // <React.StrictMode>
    <div style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-around' }}>
      <Xwrapper>
        <DraggableBox id={'box1'} grid={[20, 20]} />
        <DraggableBox id={'box2'} grid={[20, 20]} />
        {/*<DelayedComponent comp={<CustomXarrow start={'box1'} end={'box2'} />} />*/}
        <CustomXarrow start={'box1'} end={'box2'} idleRenders={1} />
        <svg
          vec
          style={{
            border: 'solid yellow 1px',
          }}>
          <g>
            <path height={'auto'} width={'auto'} d={'M0,0 L1000,0'} stroke="black" />
          </g>
        </svg>
      </Xwrapper>
    </div>
    // </React.StrictMode>
  );
};

export const XarrowCoreStory: Story<xarrowPropsType> = (args) => <XarrowCoreTestTemplate {...args} />;
