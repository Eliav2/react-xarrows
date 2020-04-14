Draw arrows between components in React!

I've noticed react was missing a good and relaible arrows component in npm - so i've decided to create one of my own and share it.
this component will rerender and will update the anchors position whenever needed(not like other similar npm libraries) - the Xarrow also works inside scrollable windows and working no matter where placed in the DOM relative his anchors.

found a problem? not a problem! post a new issue([here](https://github.com/Eliav2/react-xarrows/issues)) and i will do my best to fix it.

liked my work? please star this repo.

this project developed [using codesandbox](https://codesandbox.io/s/github/Eliav2/react-xarrows).

## installation

with npm `npm install react-xarrows`.
(or `yarn add react-xarrows`)

## Examples


[see here!](https://codesandbox.io/embed/github/Eliav2/react-xarrows/tree/master/examples?fontsize=14&hidenavigation=1&theme=dark) codebox of few examples(it this repo /examples).


![Image of xarrows](https://github.com/Eliav2/react-xarrows/blob/master/examples/images/react-xarrow-picture.png)

### simple example:

```jsx
import React, { useRef } from "react";
import Xarrow from "react-xarrows";

const canvasStyle = {
  position: "relative",
  height: "20vh",
  background: "white",
  display: "flex",
  justifyContent: "space-evenly",
  alignItems: "center"
};

const boxStyle = {
  position: "relative",
  border: "1px #999 solid",
  borderRadius: "10px",
  textAlign: "center",
  width: "100px",
  height: "30px",
  color: "black"
};

const Box = props => {
  return (
    <div ref={props.box.ref} id={props.box.id} style={boxStyle}>
      {props.box.id}
    </div>
  );
};

const SimpleExample = () => {
  const box1 = { id: "box1", ref: useRef(null) };
  const box2 = { id: "box2", ref: useRef(null) };

  return (
    <React.Fragment>
      <h3>
        <u>Simple Example:</u>
      </h3>
      <div style={canvasStyle} id="canvas">
        <Box box={box1} />
        <Box box={box2} />
        <Xarrow start="box1" end={box2.ref} />
      </div>
    </React.Fragment>
  );
};

export default SimpleExample;
```

## The API

see 'Example2' at the examples codesandbox to play around.

the properties the xarrow component recieves is as follow(as listed in `xarrowPropsType` in /src/xarrow.d.ts):

```jsx
import { Color } from "csstype";
import { SVGProps } from "react";

export type anchorType = "auto" | "middle" | "left" | "right" | "top" | "bottom";

export type arrowStyleType = {
  color: Color;
  strokeColor: Color;
  headColor: Color;
  strokeWidth: number;
  curveness: number;
  headSize: number;
  dashness: boolean | { strokeLen?: number; nonStrokeLen?: number; animation?: boolean | number };
};

export type registerEventsType = {
  ref: refType;
  eventName: keyof GlobalEventHandlersEventMap;
  callback?: CallableFunction;
};

type reactRef = { current: null | HTMLElement };
type refType = reactRef | string;
type labelType = string | { text: string; extra: SVGProps<SVGElement> };

export type xarrowPropsType = {
  start: refType;
  end: refType;
  startAnchor: anchorType | anchorType[];
  endAnchor: anchorType | anchorType[];
  label: labelType | { start: labelType; middle: labelType; end: labelType };
  monitorDOMchanges: boolean;
  registerEvents: registerEventsType[];
  arrowStyle: arrowStyleType;
  consoleWarning: boolean;
  advance: {
    extendSVGcanvas: number;
  };
};
```

#### 'start' and 'end'

can be a reference to a react ref to html element or string - an id of a DOM element.

#### 'startAnchor' and 'endAnchor'

each anchor can be: `"auto" | "middle" | "left" | "right" | "top" | "bottom"`.
`auto` will choose automatically the path with the smallest length.
can also be a list of possible anchors. if list is provided - the minimal length anchors will be choosed from the list.

#### label

can be a string that will default to be at the middle or an object that decribes where to place label and how to customize it. see `label` at `xarrowPropsType` above.

#### arrowStyle

most of it prrety obvious.
dashness - can make the arrow dashed and can even animate.
see `arrowStyleType` object it `xarrowPropsType` above for more details.

#### monitorDOMchanges

A boolean. set this property to true to add relevant eventListeners to the DOM so the xarrow component will update anchors position whenever needed(scroll and resize and so on)(experamential).

#### registerEvents

you can register the xarrow to DOM event as you please. each time a event that his registed will fire the xarrow component will update his position and will call `callback` (if provided).

#### consoleWarning

we provide some nice warnings (and errors) whenever we detect issues. see 'Example3' at the examples codesandbox.

#### advance

here i will provide some flexibility to the API for some cases that i may not thought of.
extendSVGcanvas will extend the svg canvas at all sides. can be usefull if you add very long labels or setting the cureveness to be very high.

### default props

default props is as folows:

```jsx
Xarrow.defaultProps = {
  startAnchor: "auto",
  endAnchor: "auto",
  arrowStyle: {
    curveness: 0.8,
    color: "CornflowerBlue",
    strokeColor: null,
    headColor: null,
    strokeWidth: 4,
    headSize: 6,
    dashness: false
  },
  label: null,
  monitorDOMchanges: false,
  registerEvents: [],
  consoleWarning: "true",
  advance: { extendSVGcanvas: 0 }
};
```
