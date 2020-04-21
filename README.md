Draw arrows between components in React!

I've noticed react was missing a good and relaible arrows component in npm - so i've decided to create one of my own and share it.
this component will rerender and will update the anchors position whenever needed(not like other similar npm libraries) - the Xarrow also works inside scrollable windows and working no matter where placed in the DOM relative to his anchors.

found a problem? not a problem! post a new issue([here](https://github.com/Eliav2/react-xarrows/issues)) and i will do my best to fix it.

liked my work? please star this repo.

this project developed [using codesandbox](https://codesandbox.io/s/github/Eliav2/react-xarrows).

## installation

with npm `npm install react-xarrows`.
(or `yarn add react-xarrows`)

## Examples

[see here!](https://codesandbox.io/embed/github/Eliav2/react-xarrows/tree/master/examples?fontsize=14&hidenavigation=1&theme=dark) codebox of few examples(in this repo at /examples).

![Image of xarrows](https://github.com/Eliav2/react-xarrows/blob/master/examples/images/react-xarrow-picture-1.2.0.png)

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
        <Xarrow
          start="box1" //can be id
          end={box2.ref} //or React ref
        />
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
export type xarrowPropsType = {
  start: refType;
  end: refType;
  startAnchor?: anchorType | anchorType[];
  endAnchor?: anchorType | anchorType[];
  label?: labelType | { start?: labelType; middle?: labelType; end?: labelType };
  color?: string;
  lineColor?: string | null;
  headColor?: string | null;
  strokeWidth?: number;
  headSize?: number;
  curveness?: number;
  dashness?: boolean | { strokeLen?: number; nonStrokeLen?: number; animation?: boolean | number };
  monitorDOMchanges?: boolean;
  registerEvents?: registerEventsType[];
  consoleWarning?: boolean;
  advanced?: {
    extendSVGcanvas?: number;
  };
};

export type anchorType = anchorMethodType | anchorPositionType;
export type anchorMethodType = "auto";
export type anchorPositionType = "middle" | "left" | "right" | "top" | "bottom";
export type reactRefType = { current: null | HTMLElement };
export type refType = reactRefType | string;
export type labelType = string | { text: string; extra: SVGProps<SVGElement> };
export type domEventType = keyof GlobalEventHandlersEventMap;
export type registerEventsType = {
  ref: refType;
  eventName: domEventType;
  callback?: CallableFunction;
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

#### color,lineColor and headColor

color defines color for all the arrow include head. if lineColor or headColor is given so it overides color specificaly for line or head.

#### strokeWidth and headSize

strokeWidth defines the thickness of the arrow(line and head).
headSize defines how big will be the head relative to the line(set headSize to 0 to make the arrow like a line).

#### curvness

defines how much the lines curve.
0 mean stright line and 1 'perfect' curve. larger then 1 will be over curved.

#### dashness

can make the arrow dashed and can even animate.
if true default values are choosed. if object is passed then default values are choosed exept what passed.

#### monitorDOMchanges

A boolean. set this property to true to add relevant eventListeners to the DOM so the xarrow component will update anchors position whenever needed(scroll and resize and so on)(experamential).

#### registerEvents

you can register the xarrow to DOM event as you please. each time a event that his registed will fire the xarrow component will update his position and will call `callback` (if provided).

#### consoleWarning

we provide some nice warnings (and errors) whenever we detect issues. see 'Example3' at the examples codesandbox.

#### advanced

here i will provide some flexibility to the API for some cases that i may not thought of.
extendSVGcanvas will extend the svg canvas at all sides. can be usefull if you add very long labels or setting the cureveness to be very high.

### default props

default props is as folows:

```jsx
Xarrow.defaultProps = {
  startAnchor: "auto",
  endAnchor: "auto",
  label: null,
  color: "CornflowerBlue",
  lineColor: null,
  headColor: null,
  strokeWidth: 4,
  headSize: 6,
  curveness: 0.8,
  dashness: false,
  monitorDOMchanges: false,
  registerEvents: [],
  consoleWarning: "true",
  advanced: { extendSVGcanvas: 0 }
};
```

## Versions

- 1.0.0 - initial release.
- 1.0.3 - props added: `label`, `dashness` and `advance`.
- 1.1.0 - API changed! `arrowStyle` removed and all his contained properties flattened to be props of xarrow directly. `strokeColor` renamed to `lineColor`. `advance` renamed to `advanced`.
- 1.1.1 - bug fix now labels not exceed the svg canvas. the headArrow is calcualted now . this means the line ends at the start at the arrow - and this is more natural looking(especially at large headarrows).
- 1.1.2 bug fix. (the first arrow fixed the headarrow style for all next comming arrows)
- 1.1.3 - An entirely new algorithm to calcualte arrow path and curveness. now the arrow acting "smarter". this include bug fixes,improvements and some adjustments.
  `monitorDOMchanges` prop default changed to `true`.
