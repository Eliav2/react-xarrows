import { Meta, Story } from "@storybook/react";
import React, { useState } from "react";
import { DraggableBox } from "../components/DraggableBox";
// import XarrowMainNew, { XarrowMainNewProps } from 'react-xarrows/src/components/XarrowMainNew';
// import XarrowBuilder from 'react-xarrows/src/components/XarrowBuilder';
// import { Xwrapper } from 'react-xarrows/src';
import XarrowMainNew, {
  XarrowMainNewProps,
} from "react-xarrows/src/components/XarrowMainNew";
import { Xwrapper } from "react-xarrows/src";

export default {
  title: "XarrowMainNew",
  component: XarrowMainNew,
} as Meta;

const XarrowMainTemplate = ({ ...args }) => {
  const [, render] = useState({});
  const reRender = () => render({});
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
            dragGrid={[20, 20]}
            initialOffset={{ x: 420, y: 150 }}
          />
          <DraggableBox
            id={"box2"}
            dragGrid={[20, 20]}
            initialOffset={{ x: 500, y: 200 }}
          />
          <XarrowMainNew start={"box1"} end={"box2"} {...args} />
        </div>
      </Xwrapper>
    </div>
  );
};

export const XarrowMainStory: Story<XarrowMainNewProps> = (args) => (
  <XarrowMainTemplate {...args} />
);

XarrowMainStory.args = {
  path: "smooth",
  delayRenders: 1,
  startAnchor: "auto",
  endAnchor: "auto",
  curveness: "0%0",
  _debug: false,
};
