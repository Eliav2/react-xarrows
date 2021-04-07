import React from "react";
import ReactDOM from "react-dom";
import SimpleExample from "../src/examplesFiles/SimpleExample";
import FewArrows from "../src/examplesFiles/FewArrows";
import CustomizeArrow from "../src/examplesFiles/CustomizeArrow";

test("SimpleExample renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<SimpleExample />, div);
});

test("FewArrows renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<FewArrows />, div);
});
//
// test("CustomizeArrow renders without crashing",()=>{
//   const div = document.createElement('div')
//   ReactDOM.render(<CustomizeArrow/>,div)
// })
