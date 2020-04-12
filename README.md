Draw arrows between components in React!

I've noticed react was missing a good and relaible arrows component in npm - so i've decided to create one of my own and share it.
this component will rerender and will update the anchors position whenever needed(not like other similar npm libraries) - the Xarrow also works inside scrollable windows and working no matter where placed in the DOM relative his anchors.

this project developed [using codesandbox](https://codesandbox.io/s/github/Eliav2/react-xarrows).

## installation
with npm `npm install react-xarrows`.
(or `yarn add react-xarrows`)

## Examples
see [here](https://codesandbox.io/s/github/Eliav2/react-xarrows/tree/master/examples?file=/src/index.tsx) codebox of few examples(it this repo /examples).

![Image of xarrows](https://github.com/Eliav2/react-xarrows/blob/master/examples/images/react-xarrow-picture.png)

### simple example:
```
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
see [this example](https://lwwwp.csb.app/Example2) to play around.

the properties the xarrow component recieves is as follow(as listed in /src/xarrow.d.ts):
```
export type anchorType = "auto" | "middle" | "left" | "right" | "top" | "bottom";

export type arrowStyleType = {
  color: Color;
  strokeColor: Color;
  headColor: Color;
  strokeWidth: number;
  curveness: number;
  headSize: number;
};

type reactRef = { current: null | HTMLElement };
type refType = reactRef | string;

export type registerEventsType = {
  ref: refType;
  eventName: keyof GlobalEventHandlersEventMap;
  callback?: CallableFunction;
};

export type xarrowPropsType = {
  start: refType;
  end: refType;
  startAnchor: anchorType | anchorType[];
  endAnchor: anchorType | anchorType[];
  arrowStyle: arrowStyleType;
  monitorDOMchanges: boolean;
  registerEvents: registerEventsType[];
  consoleWarning: boolean;
};

```

#### 'start' and 'end'
can be a reference to a react ref to html element or string - an id of a DOM element.

#### 'startAnchor' and 'endAnchor'
each anchor can be: `"auto" | "middle" | "left" | "right" | "top" | "bottom"`.
`auto` will choose automatically the path with the smallest length.

#### arrowStyle
see `arrowStyleType` object above for more details.

#### monitorDOMchanges
A boolean. set this property to true to add relevant eventListeners to the DOM so the xarrow component will update anchors position whenever needed(scroll and resize and so on)(experamential).

#### registerEvents
you can register the xarrow to DOM event as you please. each time a event that his registed will fire the xarrow component will update his position and will call `callback` (if provided).

#### consoleWarning
we provide some nice warnings (and errors) whenever we detect issues. see ['Example3'](https://lwwwp.csb.app/Example3) in the examples.
