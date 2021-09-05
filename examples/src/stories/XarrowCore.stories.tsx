// import '../../wdyr';
import React, { useEffect, useRef, useState } from 'react';
import { Meta, Story } from '@storybook/react';
import XarrowCore from '../../../src/components/XarrowCore';
import Xarrow, { useMultipleRenders, xarrowPropsType, Xwrapper, arrowShapes } from '../../../src';
import { DraggableBox } from '../components/DraggableBox';
import XarrowBasic from '../../../src/components/XarrowBasic';
import XarrowAnchors from '../../../src/components/XarrowAnchors';
import AutoResizeSvg from '../../../src/components/AutoResizeSvg';
import Draggable from 'react-draggable';

export default {
  title: 'XarrowCore',
  component: XarrowCore,
} as Meta;

const XarrowCoreTestTemplate = ({ XComp = XarrowBasic }) => {
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
          <XComp start={'box1'} end={target}>
            {/*<div>hello world!</div>*/}
          </XComp>
        </div>
        <div style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-around' }}>
          <DraggableBox id={'box3'} grid={[20, 20]} />
        </div>
      </Xwrapper>
    </div>
  );
};

export const XarrowCoreStory: Story = (args) => <XarrowCoreTestTemplate XComp={XarrowCore} />;
export const XarrowBasicStory: Story = (args) => <XarrowCoreTestTemplate XComp={XarrowBasic} />;
export const XarrowAnchorsStory: Story = (args) => <XarrowCoreTestTemplate XComp={XarrowAnchors} />;

// const TestComponent = () => {
//   console.log('TestComponent');
//   return <div> testing rendering </div>;
// };
//
// export const TestAutoResizeSvg = () => {
//   const [, setRender] = useState({});
//   const forceRerender = () => setRender({});
//
//   return (
//     <div>
//       <button onClick={forceRerender}>reRender</button>
//       <div style={{ display: 'flex', justifyContent: 'space-evenly', width: '100%' }}>
//         <div>
//           <h1>Auto resize svg</h1>
//           <div style={{ height: 100 }}>
//             <AutoResizeSvg>
//               {/*<Draggable>*/}
//               {/*  <circle cx="50" cy="50" r="40" stroke="black" strokeWidth="3" fill="red" />*/}
//               {/*</Draggable>*/}
//
//               {(updateSvg) => (
//                 <Draggable onDrag={updateSvg}>
//                   <circle cx="50" cy="50" r="40" stroke="black" strokeWidth="3" fill="red" />
//                 </Draggable>
//               )}
//             </AutoResizeSvg>
//           </div>
//         </div>
//         <div>
//           <h1>normal svg</h1>
//           <div style={{ height: 100 }}>
//             <svg
//               style={{
//                 border: 'solid yellow 1px',
//                 position: 'absolute',
//                 height: 100,
//                 width: 100,
//               }}>
//               <Draggable>
//                 <circle cx="50" cy="50" r="40" stroke="black" strokeWidth="3" fill="red" />
//               </Draggable>
//             </svg>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
