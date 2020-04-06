import React, { useState, useRef } from "react";
import { line, box, point } from "./types";
import Xarrows from "../src/Xarrow";
import Example1 from "./Example1";
import Example2 from "./Example2";

const titleStyle = {
  fontSize: "40px",
  margin: "20px 0 0 20px"
};

const ExamplePage: React.FC = () => {
  return (
    <div>
      <header style={titleStyle}>react-xarrows</header>
      <hr />
      <p>
        Draw arrows between components in React!
        <br />
        <br />
        no magical css traformations - just great react.
        <br />
        works great - and positions updated.
      </p>
      {/* <h3>
        <u>Example1:</u>
      </h3>
      <Example1 /> */}
      <h3>
        <u>Example2:</u>
      </h3>
      <Example2 />
    </div>
  );
};

export default ExamplePage;
