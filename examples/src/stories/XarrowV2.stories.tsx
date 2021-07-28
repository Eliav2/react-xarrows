import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Xarrow, { useXarrow, xarrowPropsType, Xwrapper } from 'react-xarrows';
import Draggable from 'react-draggable';
import { Meta, Story } from '@storybook/react';
import { useSpring, animated } from 'react-spring';
import { DraggableBox } from '../components/DraggableBox';

const canvasStyle = {
  width: '100%',
  height: '50vh',
  background: 'white',
  // overflow: 'auto',
  display: 'flex',
  color: 'black',
} as const;

const SimpleTemplate = () => {
  const box = { id: 'box1', initialOffset: { x: 20, y: 20 } };
  const box2 = { id: 'box2', initialOffset: { x: 320, y: 120 } };
  const box3 = { id: 'box3', initialOffset: { x: 50, y: 150 } };
  const box4 = { id: 'box4', initialOffset: { x: 320, y: 220 } };
  return (
    <div style={canvasStyle} id="canvas">
      <Xwrapper>
        <DraggableBox {...box} />
        <DraggableBox {...box2} />
        <Xarrow start={'box1'} end={'box2'} />
        <Xarrow start={'box1'} end={'box2'} endAnchor={'top'} />
        <Xarrow start={'box1'} end={'box2'} startAnchor={'bottom'} />
      </Xwrapper>
      <Xwrapper>
        <DraggableBox {...box3} />
        <DraggableBox {...box4} />
        <Xarrow start={'box3'} end={'box4'} />
      </Xwrapper>
    </div>
  );
};

const SimpleTemplateStory: Story<xarrowPropsType> = (args) => <SimpleTemplate />;
export const V2 = SimpleTemplateStory.bind({});

const ScrolledDiv = ({ children, style }) => {
  const updateXarrow = useXarrow();
  return (
    <div
      style={{ height: '150%', width: 300, overflow: 'auto', position: 'relative', ...style }}
      onScroll={updateXarrow}>
      {children}
    </div>
  );
};

const ScrollTemplate = () => {
  const box = { id: 'box1', initialOffset: { x: 20, y: 20 } };
  const box2 = { id: 'box2', initialOffset: { x: 320, y: 120 } };
  return (
    <div style={{ ...canvasStyle, background: '#e0ffd2' }} id="canvas">
      <Xwrapper>
        <ScrolledDiv style={{ background: '#d2f6ff' }}>
          <DraggableBox {...box} />
        </ScrolledDiv>
        <ScrolledDiv style={{ background: '#f8d2ff' }}>
          <DraggableBox {...box2} />
        </ScrolledDiv>
        <Xarrow start={'box1'} end={'box2'} />
      </Xwrapper>
    </div>
  );
};

export const V2Scroll = ScrollTemplate.bind({});

const MyComponentDefaultProps = { prop1: 0 };
type MyComponentPropsType = typeof MyComponentDefaultProps;

const parseVal1 = (val: number): number => val * 2;

const useParseProps = (props: MyComponentPropsType) => {
  const [parsedVals, setParsedVals] = useState({ parsedProp1: parseVal1(MyComponentDefaultProps.prop1) });

  useLayoutEffect(() => {
    parsedVals.parsedProp1 = parseVal1(props.prop1);
    setParsedVals({ ...parsedVals });
  }, [props.prop1]);

  return parsedVals;
};

const MyComponent = (props: MyComponentPropsType) => {
  const parsedProps = useParseProps(props);

  console.log('look it me', parsedProps.parsedProp1);
  const { myVar } = useSpring({
    from: { myVar: 0 },
    to: { myVar: parsedProps.parsedProp1 },
    loop: true,
    config: { duration: 3000 },
  });
  return (
    <div>
      current val: <animated.div>{myVar}</animated.div>
    </div>
  );
};

export const ReactSpring = () => {
  const [val, setVal] = useState(10);
  return (
    <div>
      app val: {val}
      <br />
      <button onClick={() => setVal(val + 1)}>+</button>
      <button onClick={() => setVal(val - 1)}>-</button>
      <MyComponent prop1={val} />
    </div>
  );
};

const TwoBoxesTemplate = () => {
  const boxRef1 = useRef(null);
  const boxRef2 = useRef(null);
  return (
    <div style={{ display: 'flex', justifyContent: 'space-evenly', width: '100%' }}>
      <Xwrapper>
        <DraggableBox reference={boxRef1} id={'elem1'} />
        <DraggableBox reference={boxRef2} id={'elem2'} />
        <Xarrow start={boxRef1} end={boxRef2} />
      </Xwrapper>
    </div>
  );
};

export function StrictVsNotStrict() {
  return (
    <div>
      <h1>Strict</h1>
      <React.StrictMode>
        <TwoBoxesTemplate />
      </React.StrictMode>
      <h1>Not Strict</h1>
      <TwoBoxesTemplate />
    </div>
  );
}

export default {
  title: 'XarrowV2',
  component: Xarrow,
} as Meta;
