# react-xarrows

## introduction

Draw arrows between components in React!

This library is all about customizable and relaible arrows(or lines) between DOM elements in React.

I've needed such a components in one of my projects - and found out(surprisingly enough) that there is no such(good) lib, so I've decided to create one from scrate, and share it.

now (since v1.1.4) i can say, after a lot of tests and improvements- the arrows should work and act naturally under any normal circumstances(but don't try put some negative curveness ha?).

found a problem? not a problem! post a new issue([here](https://github.com/Eliav2/react-xarrows/issues)) and i will do my best to fix it.

liked my work? please star [this repo](https://github.com/Eliav2/react-xarrows).

this project developed with the help of using codesandbox. [see and fork easily here](https://codesandbox.io/s/github/Eliav2/react-xarrows).

#### what to expect

- this arrows will rerender and will update the arrows position whenever needed(not like other similar npm libraries).
- works no matter where the Xarrow component placed in the DOM relative to his anchors.
- works no matter what the type of elemnts the anchors are (like div,p, h1, and so on).
- nice intellij suggestinons will apear when working with Xarrow.
- nice errors and warnings.
- works inside scrollable windows(no matter how many - or even if any anchor element inside diffrent nested scrolling windows).
- you can give this component simple props or more detailed ones for more custom behavior and looking.
- please see the examples below to understand better the using and features.

#### what to NOT expect

- keep in mind that this is React component ,so you should adopt React best practices.

  1.  place the Xarrow under the relevent ancestor(of 'start' and 'end' element), so when the anchors elements rerenders so do Xarrow(in simple cases the component will rerender anyway because of DOM listerns i've added,but keep in mind),however, in most cases it will work normally anyway.
  2.  it is recommended to provide react refs over Id's. it is more consitent, reliable, and this is the recommended way providing refs to DOM elements in React(over Id's which uses getElementById under the hood),but if you choose to stick with id's make sure you rendering xarrow after you render his anchors.

- if your component uses 3rd components that uses animations and transformations that changes the anchors DOM positions - the xarrow will not rerender to the latest animated points, but to the firstest. you need to trigger update after all animations ended(this is not something i can monitor - so its up to you).

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

const boxStyle = {
  border: "grey solid 2px",
  borderRadius: "10px",
  padding: "5px",
};

function SimpleExample() {
  const box1Ref = useRef(null);
  return (
    <div style={{ display: "flex", justifyContent: "space-evenly", width: "100%" }}>
      <div ref={box1Ref} style={boxStyle}>
        hey
      </div>
      <p id="elem2" style={boxStyle}>
        hey2
      </p>
      <Xarrow
        start={box1Ref} //can be react ref
        end="elem2" //or an id
      />
    </div>
  );
}

export default SimpleExample;
```

## The API

### types defenitions

the properties the xarrow component recieves is as follow:

```jsx
export type xarrowPropsType = {
  start: refType;
  end: refType;
  startAnchor?: anchorType | anchorType[];
  endAnchor?: anchorType | anchorType[];
  label?: labelType | labelsType;
  color?: string;
  lineColor?: string | null;
  headColor?: string | null;
  strokeWidth?: number;
  headSize?: number;
  curveness?: number;
  dashness?: boolean | { strokeLen?: number; nonStrokeLen?: number; animation?: boolean | number };
  consoleWarning?: boolean;
  passProps?: React.SVGProps<SVGPathElement>;
  advanced?: {
    extendSVGcanvas?: number;
    passProps?: {
      SVGcanvas?: React.SVGAttributes<SVGSVGElement>;
      arrowBody?: React.SVGProps<SVGPathElement>;
      arrowHead?: React.SVGProps<SVGPathElement>;
    };
  };
  monitorDOMchanges?: boolean;
  registerEvents?: registerEventsType[];
};

export type anchorType = anchorPositionType | anchorCustomPositionType;
export type anchorPositionType = "middle" | "left" | "right" | "top" | "bottom" | "auto";
export type anchorCustomPositionType = {
  position: anchorPositionType;
  offset: { rightness: number; bottomness: number };
};
export type reactRefType = { current: null | HTMLElement };
export type refType = reactRefType | string;
export type labelsType = { start?: labelType; middle?: labelType; end?: labelType };
export type labelPropsType = { text: string; extra?: React.SVGAttributes<SVGTextElement> };
export type labelType = string | labelPropsType;
export type domEventType = keyof GlobalEventHandlersEventMap;
export type registerEventsType = {
  ref: refType;
  eventName: domEventType;
  callback?: CallableFunction;
};
```

you can keep things simple or provide more detailed props for more custom behavior - the API except both.
for example - you can provide `label:"middleLable"` and the string will apear as middle label or customize the labels as you please: `label:{end:{text:"end",extra:{fill:"red",dx:-10}}}`.
see typescript types above for detailed descriptions of what type excepts every prop.

#### 'start' and 'end'

can be a reference to a react ref to html element or string - an id of a DOM element.

#### 'startAnchor' and 'endAnchor'

each anchor can be: `"auto" | "middle" | "left" | "right" | "top" | "bottom"`.
`auto` will choose automatically the path with the smallest length.
can also be a list of possible anchors. if list is provided - the minimal length anchors will be choosed from the list.
you can also offset each anchor passing `offset`.
examples:

- `endAnchor="middle"` will choose anchor or the end of the line to in the middle of the element
- `endAnchor= { position: "auto", offset: { rightness: 20 } }` will choose automatic anchoring for end anchor but will offset it 20 pixels to the right after normal positioning.

#### label

can be a string that will default to be at the middle or an object that decribes where to place label and how to customize it. see `label` at `xarrowPropsType` above.
examples:

- `label="middleLabel"`
- `label={{ start:"I'm start label",middle: "middleLable",end:{text:"i'm custom end label",extra:{fill:"red"}} }}`

  you can pass to `extra` most of the [svg presentation attributes](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/Presentation), with them you can custom your text how you realy wants.
  use the suggestion of visual code(or your IDE) to see all possibilities.

#### color,lineColor and headColor

color defines color for all the arrow include head. if lineColor or headColor is given so it overides color specificaly for line or head.
examples:

- `color="red"` will change the color of the arrow to red(body and head).
- `headColor="red"` will change the color of the head of the arrow to red.
- `lineColor="red"` will change the color of the body of the arrow to red.

#### strokeWidth and headSize

strokeWidth defines the thickness of the arrow(line and head).
headSize defines how big will be the head relative to the line(set headSize to 0 to make the arrow like a line).
examples:

- `strokeWidth={15}` will make the arrow more thick(body and head).
- `headSize={15}` will make the head of the arrow more thick(relative to strokeWidth as well).

#### curvness

defines how much the lines curve.
examples:

- `curvness={false}` will make the line stright without curves.
- `curvness={true}` will choose defualt values of curvness
- `curvness={2}` will make Xarrow extra curved.

#### dashness

can make the arrow dashed and can even animate.
if true default values(for dashness) are choosed. if object is passed then default values are choosed execpt what passed.
examples:

- `dashness={true}` will make the line of the arrow to be dashed.
- `dashness={{ strokeLen: 10, nonStrokeLen: 15, animation: -2 }}` will make a custom looking dashness.

#### passProps

new and powerful feature!
you can pass properties to visible parts of the arrow (such event handlers and much more).
examples:

- `passProps= {{onClick: () => console.log("xarrow clicked!")}}` - now the arrow will console log a message when clicked.
- `passProps= {{cursor: "pointer"}}` - now the cursor will change to pointer style when hovering over Xarrow.

#### consoleWarning

we provide some nice warnings (and errors) whenever we detect issues. see 'Example3' at the examples codesandbox.

#### advanced

here i will provide some flexibility to the API for some cases that i may not thought of.

##### extendSVGcanvas

will extend the svg canvas at all sides. can be usefull if for some reason the arrow(or labels) is cutted though to small svg canvas(should be used in advanced custom arrows, for example if you used `dx` to move one of the labels and at exceeded the canvas).
example: `advanced= {{extendSVGcanvas: 30 }}` - will extended svg canvas in all sides by 30 pixels.

##### passProps

if you wish you can pass props specipically to either the body of the arrow,or his head,or even the svg canvas which contains both of them.
note that `arrowBody` and `arrowHead` recives props of svg path element and `SVGcanvas` recives props of svg element.
examples:

- `advanced= {{passProps: {arrowHead:{onClick: () => console.log("head clicked!")}}}}` - now only the head will console log a message when clicked.

#### monitorDOMchanges

A boolean. set this property to true to add relevant eventListeners to the DOM so the xarrow component will update anchors position whenever needed(scroll and resize and so on). (NOTE - maybe will removed in future updates )
examples:

- `monitorDOMchanges={false}` will disable any DOM monitoring.

#### registerEvents

you can register the xarrow to DOM event as you please. each time a event that his registed will fire the xarrow component will update his position and will call `callback` (if provided). (NOTE - planned to be removed)

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
  passProps: {},
  consoleWarning: false,
  advanced: { extendSVGcanvas: 0, passProps: { arrowBody: {}, arrowHead: {}, SVGcanvas: {} } },
  monitorDOMchanges: true,
  registerEvents: [],
};
```

## Versions

All version notes moved to [releases](https://github.com/Eliav2/react-xarrows/releases).
