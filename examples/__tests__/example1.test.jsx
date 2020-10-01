import React from 'react'
import ReactDOM from 'react-dom'
import SimpleExample from "../src/examplesFiles/SimpleExample";
import Example1 from "../src/examplesFiles/Example1";
import Example2 from "../src/examplesFiles/Example2";

test("SimpleExample renders without crashing",()=>{
  const div = document.createElement('div')
  ReactDOM.render(<SimpleExample/>,div)
})

test("Example1 renders without crashing",()=>{
  const div = document.createElement('div')
  ReactDOM.render(<Example1/>,div)
})
//
// test("Example2 renders without crashing",()=>{
//   const div = document.createElement('div')
//   ReactDOM.render(<Example2/>,div)
// })