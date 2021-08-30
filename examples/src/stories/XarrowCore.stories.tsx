import '../../wdyr';
import React, { useEffect, useRef, useState } from 'react';
import { Meta, Story } from '@storybook/react';
import CustomXarrow from '../../../src/Xarrow/XarrowCore';
import Xarrow, { useMultipleRenders, xarrowPropsType, Xwrapper, arrowShapes } from '../../../src';
import { DraggableBox } from '../components/DraggableBox';

export default {
  title: 'XarrowCore',
  component: CustomXarrow,
} as Meta;

const XarrowCoreTestTemplate = (args) => {
  const [showBox1, setShowBox1] = useState(true);
  const [showBox2, setShowBox2] = useState(true);
  const [trigger, setTrigger] = useState(true);

  const target = trigger ? 'box2' : 'box3';

  return (
    <div>
      <button onClick={() => setShowBox1(!showBox1)}>show box1</button>
      <button onClick={() => setShowBox2(!showBox2)}>show box2</button>
      <button onClick={() => setTrigger(!trigger)}>trigger connection</button>
      <Xwrapper>
        <div style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-around' }}>
          {showBox1 ? <DraggableBox id={'box1'} grid={[20, 20]} /> : null}
          {showBox2 ? <DraggableBox id={'box2'} grid={[20, 20]} /> : null}
          <CustomXarrow start={'box1'} end={target} idleRenders={1} />
        </div>
        <div style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-around' }}>
          <DraggableBox id={'box3'} grid={[20, 20]} />
        </div>
      </Xwrapper>
    </div>
  );
};

export const XarrowCoreStory: Story<xarrowPropsType> = (args) => <XarrowCoreTestTemplate {...args} />;
