# react-xarrows

## introduction

Draw arrows between components in React!

[![npm version](https://badge.fury.io/js/react-xarrows.svg)](https://github.com/Eliav2/react-xarrows)
[![downloads](https://img.shields.io/npm/dw/react-xarrows)](https://www.npmjs.com/package/react-xarrows)
[![issues](https://img.shields.io/github/issues/Eliav2/react-xarrows)](https://github.com/Eliav2/react-xarrows/issues)
[![licence](https://img.shields.io/npm/l/react-xarrows)](https://github.com/Eliav2/react-xarrows/blob/master/LICENSE)

#### main features

- Connect between elements by passing a ref or an id for startElement and endElement.
- Automatic anchoring based on smallest path.
- can add customizable labels
- relatively fast algorithm to find path and to adjust canvas.
- Easily customize the look and behavior of the arrow.
- Written in typescript so you get nice props suggestions(but support js also of course).

found a problem? not a problem! post a new issue([here](https://github.com/Eliav2/react-xarrows/issues)).

liked my work? please star [this repo](https://github.com/Eliav2/react-xarrows).

## installation

with npm `npm install react-xarrows`.
(or `yarn add react-xarrows`)

## Examples

#### Demos

[see here!](https://codesandbox.io/embed/github/Eliav2/react-xarrows/tree/master/examples?fontsize=14&hidenavigation=1&theme=dark)
codebox of few examples(in this repo at [/examples](./examples)).

![react-xarrow-picture-1 4 2](https://user-images.githubusercontent.com/47307889/87698325-facfc480-c79b-11ea-976a-dbad0ecd9b48.png)

see this interactive example: <https://lwwwp.csb.app/CustomizeArrow>
![react-xarrows-v1 6](https://user-images.githubusercontent.com/47307889/113949468-070f1c80-9818-11eb-90e6-ddc6d814b912.gif)

### simple example:

```jsx
import React, {useRef} from "react";
import Xarrow from "react-xarrows";

const boxStyle = {
    border: "grey solid 2px",
    borderRadius: "10px",
    padding: "5px",
};

function SimpleExample() {
    const box1Ref = useRef(null);
    return (
        <div style={{display: "flex", justifyContent: "space-evenly", width: "100%"}}>
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

## Usage

react-xarrows does not renders automatically if one of the connected elements is rendered. You have to manually trigger
an update on the arrows whenever one of the connected elements renders(possibaly by trigger update on the parent of the
arrows) ,this is because the Xarrow component does not have any control or awareness of the connected elements. in
addition, make sure to render Xarrows later in the DOM then the connected elements else the app will crash.
**this is planned to be changed in react-xarrows v2.**

### Contributing

Want a feature that is not supported? found a bug?\
no need to clone the repo and set up the dev environment anymore!\
here's a ready to use development environment with a click of a button(patience, it takes about a minute to setup):

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/Eliav2/react-xarrows/blob/master/src/index.tsx)

this will set up environment that will clone react-xarrow master,and will link the code from the src to the examples,
and will start examples,with typescript watch process that will recompile when any change is made.\
this means that any code changes in src/index.tsx will immediately be reflected to the running example at port 3000!
(add console.log("test") line and see!)\
to reproduce this dev env on your local machine git clone and follow same commands as in [gitpod.yml](./.gitpod.yml).

if you made an improvement that is relevant for most users, you can quickly submit a pull request using the right
toolbar.

### react-xarrows v2

v2 is on its way. want to contribute and participate in plannig the next react architecture for react-xarrows? see
discussion [here](https://github.com/Eliav2/react-xarrows/discussions/53)!

### API

to see full typescript definition see [types.ts](./src/types.ts) file.

here's a summary of the all the available props:

**Properties**|**Description**|**default value**|**type**
:-----:|:-----:|:-----:|:-----:
[start](#refs)|ref to start element|none(Required!)|string/ReactRef
[end](#refs)|ref to end element|none(Required!)|string/ReactRef
[startAnchor](#anchors)|from which side the arrow should start from start element| 'auto'|string/object/array
[endAnchor](#anchors)|at which side the arrow should end at end element| 'auto'|string/object/array
[label](#label)|optional labels| null|string/array
[color](#colors)|color of Xarrow(all parts)| 'CornflowerBlue'|string
[lineColor](#colors)|color of the line| null|string
[headColor](#colors)|color of the head| null|string
[tailColor](#colors)|color of the tail| null|string
[strokeWidth](#widths)|thickness of Xarrow(all parts)|4|number
[headSize](#widths)|thickness of head(relative to strokeWidth)|6|number
[tailSize](#widths)|thickness of tail(relative to strokeWidth)|6|number
[path](#path)|path drawing style| 'smooth'|string
[curveness](#curveness)|how much the line curveness when path='smooth'| 0.8|number
[gridBreak](#gridBreak)|where the line breaks in path='grid'| 0.5|number
[dashness](#dashness)|should the line be dashed| false|boolean/object
[showHead](#shows)|show the arrow head?| true|boolean
[showTail](#shows)|show the arrow tail?| false|boolean
[showXarrow](#shows)|show Xarrow?| true|boolean
[animateDrawing](#animateDrawing)|animate drawing when arrow mounts?| false|boolean/object
[headShape](#customsvgs)|shape of the arrow head| 'arrow1'|string/object
[tailShape](#customsvgs)|shape of the arrow tail|'arrow1'|string/object

<details>

<summary>Advanced Props</summary>

[see details](#advancedCustom)

**Properties**|**Description**|**default value**|**type**
:-----:|:-----:|:-----:|:-----:
passProps|properties which will be pased to arrowBody,arrowHead,arrowTail| {}|object
SVGcanvasProps|properties which will be passed to svgCanvas| {}|object
arrowBodyProps|properties which will be passed to arrowBody| {}|object
arrowHeadProps|properties which will be passed to arrowHead| {}|object
arrowTailProps|properties which will be passed to arrowTail| {}|object
divContainerProps|properties which will be passed to divContainer| {}|object
SVGcanvasStyle|style properties which will be passed svgCanvas|0|object
divContainerStyle|style properties which will be passed divContainer| false|object
_extendSVGcanvas|extend svgCanas at all sides|0|number
_debug|show debug elements|0|boolean
_cpx1Offset|offset control point 1 x|0|number
_cpy1Offset|offset control point 1 y|0|number
_cpx2Offset|offset control point 2 x|0|number
_cpy2Offset|offset control point 2 x|0|number

</details>

##### API flexibility

This API is built in such way that most props can accept different types. you can keep things simple or provide more
detailed props for more custom behavior - the API except both(see [`startAnchor`](#startAnchor-and-endAnchor) or `label`
properties for good examples)
.<br/>
see typescript types above for detailed descriptions of what type excepts every prop.

## Properties

This documentation is examples driven.\
The examples is sorted from the most common use case to the most custom one.

<a name="refs"></a>

<details>

<summary> 'start' and 'end' </summary>

_required_\
can be a reference to a react ref to html element or string - an id of a DOM element.

examples:

- `start="myid"` - `myid` is id of a dom element.
- `start={myRef}` -  `myRef` is a react ref.

</details>

<a name="anchors"></a>

<details>

<summary> 'startAnchor' and 'endAnchor' </summary>


each anchor can be: `"auto" | "middle" | "left" | "right" | "top" | "bottom"`.
`auto` will choose automatically the path with the smallest length. can also be a list of possible anchors. if list is
provided - the minimal length anchors will be choose from the list. you can also offset each anchor passing `offset`.
examples:

- `endAnchor="middle"` will set the anchor of the end of the line to the middle of the end element.
- `endAnchor= { position: "auto", offset: { rightness: 20 } }` will choose automatic anchoring for end anchor but will
  offset it 20 pixels to the right after normal positioning.
- `endAnchor= ["right", {position: "left", offset: {bottomness: -10}}]` only right and left anchors will be allowed for
  endAnchor, and if the left side connected then it will be offset 10 pixels up.

</details>

<a name="label"></a>

<details>

<summary> label </summary>

you can place up to 3 labels. see examples

- `label="middleLabel"` - middle label
- `label=<div style={{ fontSize: "1.3em", fontFamily: "fantasy", fontStyle: "italic" }}>styled middle label</div>` -
  custom middle label
- `label={{ start:"I'm start label",middle: "middleLabel",end:<div style={{ fontSize: "1.3em", fontFamily: "fantasy", fontStyle: "italic" }}>big end label</div> }}`
    - start and middle label and custom end label

</details>

<a name="colors"></a>

<details>

<summary> color,lineColor and headColor and tailColor </summary>


`color` defines color to the entire arrow. lineColor,headColor and tailColor will override color specifically for
line,tail or head. examples:

- `color="red"` will change the color of the arrow to red(body and head).
- `headColor="red"` will change only the color of the head to red.
- `tailColor="red"` will change only the color of the tail to red.
- `lineColor="red"` will change only the color of the body to red.

</details>

<a name="widths"></a>

<details>

<summary>strokeWidth and headSize and tailSize</summary>

strokeWidth defines the thickness of the entire arrow. headSize and tailSize defines how big will be the head or tail
relative to the strokeWidth. examples:

- `strokeWidth={15}` will make the arrow more thick(body and head).
- `headSize={15}` will make the head of the arrow more thick(relative to strokeWidth as well).
- `tailSize={15}` will make arrow's tail thicker.

</details>

<a name="path"></a>

<details>

<summary>path</summary>

`path` can be one of: `"smooth" | "grid" | "straight"`, and it controls the path arrow is drawn, exactly how their name
suggest. examples:

- `path={"grid"}` will draw the line in sharp curves(90 degrees) like grid.

</details>

<a name="curveness"></a>

<details>

<summary>curveness</summary>

defines how much the lines curve. makes a difference only in `path='smooth'`. examples:

- `curveness={false}` will make the line straight without curves(exactly like path='straight').
- `curveness={true}` will choose default values of curveness.
- `curveness={2}` will make Xarrow extra curved.

</details>

<a name="gridBreak"></a>

<details>

<summary>gridBreak</summary>

defines where the line will break when `path='grid'`. value should be a number from 0 to 1.

examples:

- `gridBreak={0.2}` will make the line straight without curves(exactly like path='straight').
- `curveness={true}` will choose default values of curveness.
- `curveness={2}` will make Xarrow extra curved.

</details>

<a name="dashness"></a>

<details>

<summary>dashness</summary>


can make the arrow dashed and can even animate. if true default values(for dashness) are chosen. if object is passed
then default values are chosen except what passed. examples:

- `dashness={true}` will make the line of the arrow to be dashed.
- `dashness={{ strokeLen: 10, nonStrokeLen: 15, animation: -2 }}` will make a custom looking dashness.

</details>

<a name="shows"></a>

<details>

<summary>showHead, showTail and showXarrow</summary>

`showXarrow`: show or not show Xarrow? (can be used to restart the drawing animation)
`showHead`: show or not the arrow head?
`showTail`: show or not the arrow tail?

- `showXarrow={false}` - will hide (unmount) Xarrow and his labels.
- `showHead={false}` - will hide the arrow head.

</details>

<a name="animateDrawing"></a>

<details>

<summary>animateDrawing</summary>


can animate the drawing of the arrow using svg animation. type: boolean|number. if true animation duration is 1s. if
number is passed then animation duration is number's value in seconds. examples:

- `animateDrawing` will animate the drawing of the arrow in 1 second.
- `animateDrawing={5}` will animate the drawing of the arrow in 5 seconds.
- `animateDrawing={0.1}` will animate the drawing of the arrow in 100 milliseconds.

</details>

<a name="customsvgs"></a>

<details>

<summary> custom svg arrows - headShape and tailShape</summary>


[//]: # (todo: add svg custom shapes docs!)

new feature! you can customize the svg edges (head or tail) of the arrow. you can use predefined svg by passing
string,one of `"arrow1" | "circle" | "arrow1"`

#### simple usage:

_headShape type:string_


<table>
  <tr>
    <th>Code</th>
    <th>Result</th>
  </tr> 
  <tr>
  <td>

```jsx
<xarrow headShape='circle'/>
```

  </td>
  <td> 

![img_1.png](images/fillCircle.png)
  </td>
  </tr>
  <tr>
  <td>

```jsx
<xarrow headShape='circle'
        arrowHeadProps={"fill": "transparent",
            "strokeWidth": "0.1",
            "stroke": "CornflowerBlue"}
/>
```

  </td>
  <td> 

![img_1.png](images/emptyCircle.png)
  </td>
  </tr>
  <tr>
  <td>

```jsx
<xarrow headShape='heart'/>
```

  </td>
  <td> 

![img.png](images/heart.png)
  </td>
  </tr>
</table>

you can import `arrowShapes` which is object contains all predefined svg shapes.

<details>

<summary>custom usage</summary> 

you can also pass _your own_ svg shapes:

```typescript
headShapeType = {
    svgElem: T
:
'circle' | 'ellipse' | 'line' | 'path' | 'polygon' | 'polyline' | 'rect';
svgProps ? : JSX.IntrinsicElements[T];
offsetForward ? : number;
}
;
```

for example, you can pass the following object, and it will be exactly equivalent to passing `'arrow1'`:

```js
headShape = {
    svgElem: 'path',
    svgProps: {d: `M 0 0 L 1 0.5 L 0 1 L 0.25 0.5 z`},
    offsetForward: 0.25
}
```

`svgElem` - an svg element like `path` or `circle`.  
`svgProps` - props that will be passed to the svg element.
`offsetForward` - how much to offset tht line into the svg element(from 0 to 1). normally the line will connect to the
start of the svgElem. for example in case of the default arrow you want the line to enter 25% into the svgElem.

don't forget about `arrowHeadProps` and `arrowTailProps` in case you want to use default shape but custom svg props.

**in case you pass a custom svg element:** currently you have to adjust the path to start from 0,0 and to be at size box
1x1 in order to make the custom shape look like the default shapes in size, in later versions it is planned to support
automatic adjustment using getBBox() function.

</details>

</details>

### advanced customization

<a name="advancedCustom"></a>

<details>

### passing props

The xarrow is fully customizable, and you can pass props to any part of the component. if unlisted(unknown) property is
passed to xarrow so by default it'll be passed down to `divContainer`.

#### passProps

you can pass properties to visible parts(body and head) of the arrow (such event handlers and much more). this supposed
to be enough for most cases. examples:

- `passProps= {{onClick: () => console.log("xarrow clicked!")}}` - now the arrow will console log a message when
  clicked.
- `passProps= {{cursor: "pointer"}}` - now the cursor will change to pointer style when hovering over Xarrow.
- `passProps= {{pointerEvents: "none"}}` - now the user cannot interact with Xarrow via mouse events.

### advanced customization

The properties below can be used to customize the arrow even farther:

#### arrowBodyProps, arrowHeadProps, SVGcanvasProps, divContainerProps

![image](https://user-images.githubusercontent.com/47307889/95031511-09ed5100-06bf-11eb-95a3-4cdc8d0be0ad.png)

if you wish you can pass props specific part of the component.

- `divContainerProps` - the container which contains the SVG canvas, and the optional labels elements. It takes no
  place, and located where you normaly placed him in the elements tree(no offset). The SVGcanvas and the labels will be
  placed in a offset from this div.
- `SVGcanvasProps` - the svg canvas which contains arrow head and body.
- `arrowBodyProps` - the body of the arrow
- `arrowHeadProps` - the arrow head.

Note that `arrowBody` and `arrowHead` receives props of svg path element, `SVGcanvas` receives props of svg element,
and `divContainerProps` of a div element.

examples:

- `arrowHead = {onClick: () => console.log("head clicked!")}` - now only the head will console log a message when
  clicked.

##### SVGcanvasStyle, divContainerStyle

if you wish to pass style to divContainer or SVGcanvas use `SVGcanvasStyle`,`divContainerStyle` and not `SVGcanvasProps`
,`divContainerProps` to not override existing style.

[//]: # (todo: check if width and height can't be automatically determined)

##### _extendSVGcanvas

will extend the svg canvas at all sides. can be useful if for some reason the arrow is cut though to small svg canvas(
should be used in advanced custom arrows). example: `_extendSVGcanvas = {30}` - will extend svg canvas in all sides by
30 pixels.

##### _cpx1Offset,_cpy1Offset,_cpx2Offset,_cpy2Offset

now you can manipulate and offset the control points of the arrow. this way you can control how the line curves. check
out the interactive codesandbox, set _debug to true and play with these properties.

</details>

## Versions

See [CHANGELOG.md](./CHANGELOG.md) in this repo.



<style>
details {
    border: 1px solid #aaa;
    border-radius: 4px;
    padding: .5em .5em 0;
    margin: 1em 0;
}
</style>
