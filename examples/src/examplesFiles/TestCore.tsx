import React, { useState } from 'react';
import { Xwrapper } from 'react-xarrows';
import CustomXarrow from 'react-xarrows/src/Xarrow/XarrowCore';
import { DraggableBox } from '../components/DraggableBox';
// import { Xwrapper } from '../../../src';

const XarrowCoreTest = () => {
  const [showBox1, setShowBox1] = useState(true);
  const [showBox2, setShowBox2] = useState(true);

  return (
    <div>
      <button onClick={() => setShowBox1(!showBox1)}>trigger box1</button>
      <button onClick={() => setShowBox2(!showBox2)}>trigger box1</button>
      <div style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-around' }}>
        <Xwrapper>
          {showBox1 ? <DraggableBox id={'box1'} grid={[20, 20]} /> : null}
          {showBox2 ? <DraggableBox id={'box2'} grid={[20, 20]} /> : null}
          {/*<DelayedComponent comp={<CustomXarrow start={'box1'} end={'box2'} />} />*/}
          <CustomXarrow start={'box1'} end={'box2'} idleRenders={1} />
        </Xwrapper>
      </div>
    </div>
  );
};
export default XarrowCoreTest;
