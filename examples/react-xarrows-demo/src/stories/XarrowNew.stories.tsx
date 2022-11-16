import { Meta, Story } from "@storybook/react";
import React, { useRef, useState } from "react";
import { DraggableBox } from "../components/DraggableBox";
// import XarrowMainNew, { XarrowMainNewProps } from 'react-xarrows/src/components/XarrowMainNew';
// import XarrowBuilder from 'react-xarrows/src/components/XarrowBuilder';
// import { Xwrapper } from 'react-xarrows/src';
import XarrowMainNew, {
  XarrowMainNewProps,
} from "react-xarrows/src/components/XarrowMainNew";
import { Xwrapper, useXarrow } from "react-xarrows/src";
import {
  Xwrapper as XwrapperV2,
  default as XarrowV2,
  useXarrow as useXarrowV2,
} from "react-xarrow-v2";
import { DelayedComponent } from "react-xarrows/src/components/DelayedComponent";

export default {
  title: "XarrowMainNew",
  component: XarrowMainNew,
} as Meta;

const XarrowMainTemplate = ({ ...args }) => {
  const [, render] = useState({});
  const reRender = () => render({});

  const divRef = useRef();
  return (
    <div>
      <Xwrapper>
        <button onClick={reRender}>reRender</button>
        <div
          style={{
            display: "flex",
            width: "100%",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <DraggableBox
            id={"box1"}
            dragGrid={[10, 10]}
            initialOffset={{ x: 420, y: 150 }}
          />
          <DraggableBox
            id={"box2"}
            dragGrid={[10, 10]}
            initialOffset={{ x: 500, y: 200 }}
          />
          <XarrowMainNew
            start={"box1"}
            end={"box2"}
            {...args}
            divContainerProps={{ ref: divRef, style: {} }}
            headShape={"circle"}
          />
        </div>
      </Xwrapper>
    </div>
  );
};

export const XarrowMainStory: Story<XarrowMainNewProps> = (args) => (
  <XarrowMainTemplate {...args} />
);

XarrowMainStory.args = {
  headSize: 24,
  tailSize: 24,
  showHead: true,
  showTail: false,
  path: "smooth",
  delayRenders: 2,
  startAnchor: "0",
  endAnchor: ["left", "right"],
  curveness: "0%0",
  _debug: false,
  color: "cornflowerBlue",
  headColor: "cornflowerBlue",
  tailColor: "cornflowerBlue",
  headRotate: 0,
  tailRotate: 0,
};

export const XarrowVersionsComparisons = ({ ...args }) => {
  const [, render] = useState({});
  const reRender = () => render({});

  return (
    <div>
      <Xwrapper>
        <XwrapperV2>
          <button onClick={reRender}>reRender</button>
          <div
            style={{
              display: "flex",
              width: "100%",
              alignItems: "center",
              justifyContent: "space-around",
            }}
          >
            <DraggableBox
              id={"box1"}
              dragGrid={[10, 10]}
              initialOffset={{ x: 420, y: 150 }}
            />
            <DraggableBox
              id={"box2"}
              dragGrid={[10, 10]}
              initialOffset={{ x: 500, y: 200 }}
            />
            <XarrowMainNew start={"box1"} end={"box2"} color="red" {...args} />
            <XarrowV2 start={"box1"} end={"box2"} {...args} />
            {/* <XarrowV2Delayed start={"box1"} end={"box2"} {...args} /> */}
          </div>
        </XwrapperV2>
      </Xwrapper>
    </div>
  );
};

XarrowVersionsComparisons.args = {
  // headSize: 40,
  // tailSize: 40,
  showHead: true,
  // showTail: true,
  path: "smooth",
  delayRenders: 4,
  startAnchor: "auto",
  endAnchor: ["left", "right"],
  curveness: "0%0",
  // _debug: false,
  // color: "cornflowerBlue",
  // headColor: "cornflowerBlue",
  // tailColor: "cornflowerBlue",
  // headRotate: 0,
  // tailRotate: 0,
};
