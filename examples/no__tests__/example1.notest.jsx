import React from 'react'
import ReactDOM from 'react-dom'
import Example1 from "../src/examplesFiles/Example1";

// test("all languages has same object properties", () => {
//   expect(heKeys).toMatchObject(enKeys);
// });

it("renders without crashing",()=>{
  const div = document.createElement('div')
  ReactDOM.render(<Example1/>,div)
})