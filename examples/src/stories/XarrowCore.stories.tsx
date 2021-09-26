// import '../../wdyr';
import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react';
import XarrowCore from '../../../src/components/XarrowCore';
import { useXarrow, Xwrapper } from '../../../src';
import { DraggableBox } from '../components/DraggableBox';
import XarrowBasicPath from '../../../src/components/XarrowBasicPath';
import XarrowMain from '../../../src/components/XarrowMain';
import Xelem from '../../../src/components/Xelem';

export default {
  title: 'XarrowCore',
  component: XarrowCore,
} as Meta;

const XarrowCoreTestTemplate = ({ XComp = XarrowMain, args }) => {
  const [showBox1, setShowBox1] = useState(true);
  const [showBox2, setShowBox2] = useState(true);
  const [trigger, setTrigger] = useState(true);

  const target = trigger ? 'box2' : 'box3';
  // const update = useXarrow();

  let arr = new Array(0).fill({});
  // console.log('XarrowCoreTestTemplate');
  return (
    <div>
      <button onClick={() => setShowBox1(!showBox1)}>show box1</button>
      <button onClick={() => setShowBox2(!showBox2)}>show box2</button>
      <button onClick={() => setTrigger(!trigger)}>trigger connection</button>
      <Xwrapper>
        <Xelem>{(updateXarrow) => <button onClick={updateXarrow}>update Xarrow</button>}</Xelem>
        <div style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-around' }}>
          {showBox1 ? <DraggableBox id={'box1'} grid={[20, 20]} initialOffset={{ x: 420, y: 150 }} /> : null}
          {showBox2 ? <DraggableBox id={'box2'} grid={[20, 20]} initialOffset={{ x: 500, y: 200 }} /> : null}
          <XComp
            start={'box1'}
            end={target}
            startAnchor={[{ position: 'auto' }]}
            endAnchor={['auto']}
            path={'straight'}
            {...args}
          />
          <DraggableBox id={'box3'} grid={[20, 20]} initialOffset={{ x: 50, y: 100 }} />
          {/*<DraggableBox id={'box4'} grid={[20, 20]} initialOffset={{ x: 250, y: 100 }} />*/}
          {/*<XComp start={{ x: 50, y: 150 }} end={'box4'} />*/}
        </div>
      </Xwrapper>
    </div>
  );
};

// export const XarrowCoreStory: Story = (args) => <XarrowCoreTestTemplate XComp={XarrowCore} />;
export const XarrowBasicStory: Story = (args) => (
  <XarrowCoreTestTemplate
    XComp={() => (
      <XarrowCore start={'box1'} end={'box2'}>
        {(elems) => {
          return <XarrowBasicPath {...elems} />;
        }}
      </XarrowCore>
    )}
  />
);
// export const XarrowAnchorsStory: Story = (args) => <XarrowCoreTestTemplate XComp={XarrowAnchors} />;
export const XarrowMainStory: Story = (args) => <XarrowCoreTestTemplate XComp={XarrowMain} args={args} />;
XarrowMainStory.args = {
  path: 'grid',
  gridBreak: '50%',
  curveness: '0%',
  _debug: true,
};

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
