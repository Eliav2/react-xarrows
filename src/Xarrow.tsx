import React, { useRef, useEffect, useState } from "react";
import { anchorType, xarrowPropsType } from "./Xarrow.d";
const lodash = require("lodash");

export type xarrowPropsType = xarrowPropsType;
export type anchorType = anchorType;

type prevPos = {
  start: {
    x: number;
    y: number;
    right: number;
    bottom: number;
  };
  end: {
    x: number;
    y: number;
    right: number;
    bottom: number;
  };
};

type reactRef = { current: null | HTMLElement };

type point = { x: number; y: number };

type anchorsParents = {
  start: HTMLElement[];
  end: HTMLElement[];
  extra: HTMLElement[];
};

const findCommonAncestor = (elem: HTMLElement, elem2: HTMLElement): HTMLElement => {
  function parents(node: any) {
    var nodes = [node];
    for (; node; node = node.parentNode) {
      nodes.unshift(node);
    }
    return nodes;
  }
  function commonAncestor(node1: any, node2: any) {
    var parents1 = parents(node1);
    var parents2 = parents(node2);

    if (parents1[0] !== parents2[0]) throw new Error("No common ancestor!");

    for (var i = 0; i < parents1.length; i++) {
      if (parents1[i] !== parents2[i]) return parents1[i - 1];
    }
  }
  return commonAncestor(elem, elem2);
};

const findAllParents = (elem: HTMLElement) => {
  let parents: HTMLElement[] = [];
  let parent = elem;
  while (true) {
    if (parent.parentElement === null) return parents;
    else parent = parent.parentElement;
    parents.push(parent);
  }
};

const findAllChildrens = (child: HTMLElement, parent: HTMLElement) => {
  if (child === parent) return [];
  let childrens: HTMLElement[] = [];
  let childParent = child.parentElement;
  while (childParent !== parent) {
    childrens.push(childParent);
    childParent = childParent.parentElement;
  }
  return childrens;
};

const getElementByPropGiven = (ref: React.RefObject<HTMLElement> | "string"): HTMLElement => {
  var myRef;
  if (typeof ref === "string") {
    myRef = document.getElementById(ref);
    if (myRef === null)
      throw Error(
        `'${ref}' is not an id of element in the dom. make sure you provided currect id or provide a React reference to element instead.`
      );
  } else myRef = ref.current;
  if (myRef === null)
    throw Error(
      `'${ref}' is not a valid react reference to html element
OR
you tried to render Xarrow before one of the anchors.
please provide correct react refernce or provide id instead.`
    );

  return myRef;
};

function Xarrow(props: xarrowPropsType) {
  const selfRef = useRef<reactRef>(null);
  const [anchorsRefs, setAnchorsRefs] = useState({ start: null, end: null });

  const [prevPosState, setPrevPosState] = useState<prevPos>(null);
  const [prevProps, setPrevProps] = useState<prevPos>(null);
  const [selfParents, setSelfParents] = useState<HTMLElement[]>(null); //list parents of the common ascestor of the arrow with start and end(until "root elemnt")
  const [anchorsParents, setAnchorsParents] = useState<anchorsParents>(null); //list childrens of the common ascestor of the arrow with start and end until start or end
  const [xarrowElemPos, setXarrowElemPos] = useState<point>({ x: 0, y: 0 });

  const updateIfNeeded = () => {
    if (!lodash.isEqual(props, prevProps)) {
      //first check if any properties changed
      if (prevProps) {
        initProps();
        setPrevPosState(getPos());
      }
    } else {
      //if the properties did not changed - update position if needed
      let posState = getPos();
      if (!lodash.isEqual(prevPosState, posState)) {
        setPrevPosState(posState);
      }
    }
  };

  const monitorDOMchanges = () => {
    [...anchorsParents.start, ...anchorsParents.end].forEach(elem => {
      elem.addEventListener("scroll", updateIfNeeded);
    });
    window.addEventListener("resize", () => updateIfNeeded());
  };

  const cleanMonitorDOMchanges = () => {
    [...anchorsParents.start, ...anchorsParents.end].forEach(elem => {
      elem.removeEventListener("scroll", updateIfNeeded);
    });
    window.removeEventListener("resize", updateIfNeeded);
  };

  const initParentsChildrens = () => {
    let anchorsCommonAncestor = findCommonAncestor(anchorsRefs.start, anchorsRefs.end);
    let allAncestor = findCommonAncestor(anchorsCommonAncestor, selfRef.current);
    let parents = findAllParents(selfRef.current);
    let allAncestorChildrensStart = findAllChildrens(anchorsRefs.start, allAncestor);
    let allAncestorChildrensEnd = findAllChildrens(anchorsRefs.end, allAncestor);
    let startExtra = allAncestorChildrensEnd.filter(p => parents.includes(p));
    let endExtra = allAncestorChildrensStart.filter(p => parents.includes(p));
    setSelfParents(parents);
    setAnchorsParents({
      start: allAncestorChildrensStart,
      end: allAncestorChildrensEnd,
      extra: [...startExtra, ...endExtra]
    });

    if (props.consoleWarning) {
      let allAncestorPosStyle = window.getComputedStyle(allAncestor).position;
      if (allAncestorPosStyle !== "relative")
        console.warn(
          `%c Xarrow critical warning: common ancestor should always be in 'relative' positioning! 
        change position style from '${allAncestorPosStyle}' to 'relative' of element `,
          "color: red",
          allAncestor
        );
      if (selfRef.current.parentElement !== anchorsCommonAncestor)
        console.warn(
          `Xarrow warning: you placed Xarrow not as son of the common ancestor of 'start' component and 'end' component.
          the suggested element to put Xarrow inside of to prevent redundant rerenders is `,
          anchorsCommonAncestor,
          `if this was your intention set monitorDOMchanges to true so Xarrow will render whenever relevant DOM events are triggerd.
          to disable this warnings set consoleWarning property to false`
        );
      if (
        (allAncestorChildrensStart.length > 0 || allAncestorChildrensEnd.length > 0) &&
        props.monitorDOMchanges === false
      )
        console.warn(
          `Xarrow warning: set monitorDOMchanges to true - its possible that the positioning will get out of sync on DOM events(like scroll),
        on these elements`,
          lodash.uniqWith(
            [...allAncestorChildrensStart, ...allAncestorChildrensEnd],
            lodash.isEqual
          ),
          `\nto disable this warnings set consoleWarning property to false`
        );
    }
  };

  const initCanvasStartPos = () => {
    let { x: canvPosX, y: canvPosY } = selfRef.current.getBoundingClientRect();
    canvPosX += window.pageXOffset; // #TOWatch - maybe need to add offsets of parents
    canvPosY += window.pageYOffset;
    setXarrowElemPos({ x: canvPosX, y: canvPosY });
  };

  const testUserGivenProperties = () => {
    if (typeof props.start === "object") {
      if (!("current" in props.start)) {
        let err = Error(
          `Xarrows: 'start' property is not of type reference.
          maybe you set 'start' to other object and not to React reference?.\n`
        );
        throw err;
      }
      if (props.start.current === null)
        throw Error(
          `Xarrows: Please make sure the reference to start anchor (property 'start') are provided correctly.
          maybe you tried to render Xarrow before start anchor?.\n`
        );
    }
    if (typeof props.end === "object") {
      if (!("current" in props.end))
        throw Error(
          `Xarrows: 'end' property is not of type reference.
          maybe you set 'end' to other object and not to React reference?.\n`
        );

      if (props.end.current === null)
        throw Error(
          `Xarrows: Please make sure the reference to end anchor (property 'end') are provided correctly.
          maybe you tried to render Xarrow before end anchor?.\n`
        );
    }
  };

  const triggerUpdate = callback => {
    updateIfNeeded();
    if (callback) callback();
  };

  const initRegisterEvents = () => {
    props.registerEvents.forEach(re => {
      var ref = getElementByPropGiven(re.ref);
      ref.addEventListener(re.eventName, () => triggerUpdate(re.callback));
    });
  };

  const cleanRegisterEvents = () => {
    props.registerEvents.forEach(re => {
      var ref = getElementByPropGiven(re.ref);
      ref.removeEventListener(re.eventName, () => triggerUpdate(re.callback));
    });
  };

  const initAnchorsRefs = () => {
    var start = getElementByPropGiven(props.start);
    var end = getElementByPropGiven(props.end);
    setAnchorsRefs({ start, end });
  };

  const initProps = () => {
    testUserGivenProperties();
    setPrevProps(props);
  };

  useEffect(() => {
    // equilavent to componentDidMount
    // console.log("xarrow mounted");
    initRegisterEvents();
    initAnchorsRefs();
    initCanvasStartPos();
    initProps();
    return () => {
      // console.log("xarrow unmounted");
      cleanRegisterEvents();
    };
  }, []);

  useEffect(() => {
    // Heppens only at mounting (or props changed) after anchorsRefs initialized
    if (anchorsRefs.start) {
      initParentsChildrens();
    }
  }, [anchorsRefs]);

  useEffect(() => {
    // heppens only at mounting after anchorsParents initialized
    if (anchorsParents && props.monitorDOMchanges) {
      monitorDOMchanges();
      return () => {
        //cleanUp it unmounting!
        cleanMonitorDOMchanges();
      };
    }
  }, [anchorsParents]);

  useEffect(() => {
    // triggers position update when prevPosState changed(can heppen in any render)
    if (prevPosState) updatePosition(prevPosState);
  }, [prevPosState]);

  useEffect(() => {
    // console.log("xarrow renderd!");
    // console.log(eventListeners);
    updateIfNeeded();
  });

  //initial state
  const [st, setSt] = useState({
    cx0: 0, //x start position of the canvas
    cy0: 0, //y start position of the canvas
    cw: 0, // the canvas width
    ch: 0, // the canvas height
    x1: 0, //the x starting point of the line inside the canvas
    y1: 0, //the y starting point of the line inside the canvas
    x2: 0, //the x ending point of the line inside the canvas
    y2: 0, //the y ending point of the line inside the canvas
    dx: 0, // the x diffrence between 'start' anchor to 'end' anchor
    dy: 0, // the y diffrence between 'start' anchor to 'end' anchor
    absDx: 0,
    absDy: 0,
    cpx1: 0, // control points - control the curveness of the line
    cpy1: 0,
    cpx2: 0,
    cpy2: 0,
    headOrient: "auto",
    labelMiddlePos: { x: 0, y: 0 },
    excx: 0,
    excy: 0
  });

  let { color, lineColor, headColor, headSize, strokeWidth, dashness } = props;
  headSize = Number(headSize);
  strokeWidth = Number(strokeWidth);
  headColor = headColor ? headColor : color;
  lineColor = lineColor ? lineColor : color;
  let dashStroke = 0,
    dashNone = 0,
    animationSpeed,
    animationDirection = 1;
  if (dashness) {
    dashStroke = dashness.strokeLen ? Number(dashness.strokeLen) : Number(strokeWidth) * 2;
    dashNone = dashness.nonStrokeLen ? Number(dashness.nonStrokeLen) : Number(strokeWidth);
    animationSpeed = dashness.animation ? Number(dashness.animation) : null;
  }
  let dashoffset = dashStroke + dashNone;
  if (animationSpeed < 0) {
    animationSpeed *= -1;
    animationDirection = -1;
  }

  let labelStart, labelMiddle, labelEnd;
  let labelStartExtra = {},
    labelMiddleExtra = {},
    labelEndExtra = {};
  let labalCanvExtraY = 0;
  if (props.label) {
    labalCanvExtraY = 14;
    if (typeof props.label === "string") labelMiddle = props.label;
    else {
      labelStart = props.label.start;
      labelMiddle = props.label.middle;
      labelEnd = props.label.end;
      if (typeof labelStart === "object") {
        labelStartExtra = labelStart.extra;
        labelStart = labelStart.text;
      }
      if (typeof labelMiddle === "object") {
        labelMiddleExtra = labelMiddle.extra;
        labelMiddle = labelMiddle.text;
      }
      if (typeof labelEnd === "object") {
        labelEndExtra = labelEnd.extra;
        labelEnd = labelEnd.text;
      }
    }
  }
  let labalCanvExtraX = Math.max(
    labelStart ? labelStart.length : 0,
    labelMiddle ? labelMiddle.length : 0,
    labelEnd ? labelEnd.length : 0
  );

  let userCanvExtra = props.advanced.extendSVGcanvas;
  const extraCanvasSize = {
    excx: strokeWidth * headSize,
    excy: strokeWidth * headSize
  };
  var { excx, excy } = extraCanvasSize;
  excy += labalCanvExtraY;
  excx += userCanvExtra;
  excy += userCanvExtra;

  const getPos = (): prevPos => {
    if (!anchorsRefs.start) return;
    let s = anchorsRefs.start.getBoundingClientRect();
    let e = anchorsRefs.end.getBoundingClientRect();

    let yOffset = 0;
    let xOffset = 0;

    if (selfParents) {
      selfParents.forEach(p => {
        yOffset += p.scrollTop;
        xOffset += p.scrollLeft;
      });

      anchorsParents.extra.forEach(p => {
        yOffset -= p.scrollTop;
        xOffset -= p.scrollLeft;
      });
    }

    return {
      start: {
        x: s.x + xOffset,
        y: s.y + yOffset,
        right: s.right + xOffset,
        bottom: s.bottom + yOffset
      },
      end: {
        x: e.x + xOffset,
        y: e.y + yOffset,
        right: e.right + xOffset,
        bottom: e.bottom + yOffset
      }
    };
  };

  const updatePosition = (positions: prevPos): void => {
    // Do NOT call thie function directly.
    // you should set position by 'setPrevPosState(posState)' and that will trigger
    // this function in the useEffect hook.

    let { start: s } = positions;
    let { end: e } = positions;
    let headOrient = "auto";

    const getAnchorOffset = (width: number, height: number) => {
      return {
        middle: { rightness: width * 0.5, bottomness: height * 0.5 },
        left: { rightness: 0, bottomness: height * 0.5 },
        right: { rightness: width, bottomness: height * 0.5 },
        top: { rightness: width * 0.5, bottomness: 0 },
        bottom: { rightness: width * 0.5, bottomness: height }
      };
    };
    let startAnchorOffsets = getAnchorOffset(s.right - s.x, s.bottom - s.y);
    let endAnchorOffsets = getAnchorOffset(e.right - e.x, e.bottom - e.y);

    let startAnchorChoice = Array.isArray(props.startAnchor)
      ? props.startAnchor
      : [props.startAnchor];
    let endAnchorChoice = Array.isArray(props.endAnchor) ? props.endAnchor : [props.endAnchor];

    let startAnchorPossabilities = {};
    let endAnchorPossabilities = {};

    if (startAnchorChoice.includes("auto"))
      ["left", "right", "top", "bottom"].forEach(
        anchor => (startAnchorPossabilities[anchor] = startAnchorOffsets[anchor])
      );
    else {
      startAnchorChoice.forEach(
        anchor => (startAnchorPossabilities[anchor] = startAnchorOffsets[anchor])
      );
    }
    if (endAnchorChoice.includes("auto"))
      ["left", "right", "top", "bottom"].forEach(
        anchor => (endAnchorPossabilities[anchor] = endAnchorOffsets[anchor])
      );
    else {
      endAnchorChoice.forEach(
        anchor => (endAnchorPossabilities[anchor] = endAnchorOffsets[anchor])
      );
    }

    const dist = (p1, p2) => {
      //length of line
      return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
    };

    const getShortestLine = (sPoints: object, ePoints: object): [object, object] => {
      // closes tPair Of Points which feet to the specifed anchors
      let minDist = Infinity;
      let closestPair;
      for (let startAnchor in sPoints) {
        for (let endAnchor in ePoints) {
          let d = dist(sPoints[startAnchor], ePoints[endAnchor]);
          if (d < minDist) {
            minDist = d;
            closestPair = [
              { [startAnchor]: sPoints[startAnchor] },
              { [endAnchor]: ePoints[endAnchor] }
            ];
          }
        }
      }

      return closestPair;
    };

    let startPoints = {};
    for (let key in startAnchorPossabilities) {
      startPoints[key] = {};
      startPoints[key]["x"] = startAnchorPossabilities[key].rightness + s.x;
      startPoints[key]["y"] = startAnchorPossabilities[key].bottomness + s.y;
    }
    let endPoints = {};
    for (let key in endAnchorPossabilities) {
      endPoints[key] = {};
      endPoints[key]["x"] = endAnchorPossabilities[key].rightness + e.x;
      endPoints[key]["y"] = endAnchorPossabilities[key].bottomness + e.y;
    }
    let [startPointObj, endPointObj] = getShortestLine(startPoints, endPoints);
    let startPoint = Object.values(startPointObj)[0],
      endPoint = Object.values(endPointObj)[0];
    let startAnchor = Object.keys(startPointObj)[0],
      endAnchor = Object.keys(endPointObj)[0];
    let cx0 = Math.min(startPoint.x, endPoint.x) - xarrowElemPos.x;
    let cy0 = Math.min(startPoint.y, endPoint.y) - xarrowElemPos.y;
    let dx = endPoint.x - startPoint.x;
    let dy = endPoint.y - startPoint.y;
    let absDx = Math.abs(endPoint.x - startPoint.x);
    let absDy = Math.abs(endPoint.y - startPoint.y);
    let xSign = dx > 0 ? 1 : -1;
    let ySign = dy > 0 ? 1 : -1;
    let headOffset = ((headSize * 3) / 4) * strokeWidth;
    let oneCurveControlPoint = false;
    let cu = props.curveness;

    ////////////////////////////////////
    // adjustments before arrow point to point calculations

    ////////////////////////////////////
    // arrow point to point calculations
    let x1 = 0,
      x2 = absDx + 0,
      y1 = 0,
      y2 = absDy + 0;
    if (dx < 0) [x1, x2] = [x2, x1];
    if (dy < 0) [y1, y2] = [y2, y1];

    ////////////////////////////////////
    // arrow curveness calculations
    if (cu === 0) {
      let angel = Math.atan(absDy / absDx);
      x2 -= headOffset * xSign * Math.cos(angel);
      y2 -= headOffset * ySign * Math.sin(angel);
    } else {
      if (["left", "right"].includes(endAnchor)) x2 -= headOffset * xSign;
      else if (["top", "bottom"].includes(endAnchor)) y2 -= headOffset * ySign;
    }
    let cpx1 = x1,
      cpy1 = y1,
      cpx2 = x2,
      cpy2 = y2;

    const curvesPossabilties = {
      hCurv: () => {
        //horizinatl - from right to left or the opposite
        cpx1 += absDx * cu * xSign;
        cpx2 -= absDx * cu * xSign;
      },
      vCurv: () => {
        //vertical - from top to bottom or opposite
        cpy1 += absDy * cu * ySign;
        cpy2 -= absDy * cu * ySign;
      },
      hvCurv: () => {
        // start horizintaly then verticaly
        // from v side to h side
        cpx1 += absDx * cu * xSign;
        cpy2 -= absDy * cu * ySign;
        oneCurveControlPoint = true;
      },
      vhCurv: () => {
        // start verticaly then horizintaly
        // from h side to v side
        cpy1 += absDy * cu * ySign;
        cpx2 -= absDx * cu * xSign;
        oneCurveControlPoint = true;
      }
    };

    if (["left", "right"].includes(endAnchor) && ["bottom", "top"].includes(startAnchor))
      curvesPossabilties.vhCurv();
    else if (["left", "right"].includes(endAnchor) && ["left", "right"].includes(startAnchor))
      curvesPossabilties.hCurv();
    else if (["bottom", "top"].includes(endAnchor) && ["bottom", "top"].includes(startAnchor))
      curvesPossabilties.vCurv();
    else if (["bottom", "top"].includes(endAnchor) && ["left", "right"].includes(startAnchor))
      curvesPossabilties.hvCurv();

    if (cu > 1) {
      let absCpx1 = Math.abs(cpx1);
      let absCpy2 = Math.abs(cpy2);
      if (oneCurveControlPoint) {
        excx += Math.abs(absCpx1 - x2) / 1.5;
        excy += Math.abs(absCpy2 - y1) / 1.5;
      }
    }

    ////////////////////////////////////
    // expand canvas properly
    // if (cu > 1) {
    //   let absCpx1 = Math.abs(cpx1);
    //   let absCpy2 = Math.abs(cpy2);
    //   if (absCpx1 > x2) excx += (absCpx1 - x2) / 3;
    //   if (absCpy2 > y2) excy += (absCpy2 - y1) / 3;
    // }
    // if (excx < labalCanvExtraX * 9) excx += labalCanvExtraX * 9 - excx;
    // excx += labalCanvExtraX * 9;
    x1 += excx;
    x2 += excx;
    y1 += excy;
    y2 += excy;
    cpx1 += excx;
    cpx2 += excx;
    cpy1 += excy;
    cpy2 += excy;
    // absDx += excx;

    let cw = absDx + excx * 2,
      ch = absDy + excy * 2;
    cx0 -= excx;
    cy0 -= excy;

    //labels
    let labelMiddlePos = { x: (cpx1 + cpx2) / 2, y: (cpy1 + cpy2) / 2 };
    if (oneCurveControlPoint) {
      // let xyRatio = absDx / absDy;
      if (absDx > absDy) labelMiddlePos.x -= dx / 3;
      if (absDy > absDx) labelMiddlePos.y += dy / 3;
      if (cu > 1) {
        labelMiddlePos.x = (labelMiddlePos.x + x2) / 2;
        labelMiddlePos.y = (labelMiddlePos.y + y2) / 2;
      }
      // console.log(labelMiddlePos.x, absDx);
    }
    setSt({
      cx0,
      cy0,
      x1,
      x2,
      y1,
      y2,
      cw,
      ch,
      cpx1,
      cpy1,
      cpx2,
      cpy2,
      dx,
      dy,
      absDx,
      absDy,
      headOrient,
      labelMiddlePos,
      excx,
      excy
    });
  };

  let arrowPath = `M ${st.x1} ${st.y1} C ${st.cpx1} ${st.cpy1}, ${st.cpx2} ${st.cpy2}, ${st.x2} ${
    st.y2
  }`;

  // arrowPath = `M ${st.x1} ${st.y1}  ${st.x2} ${st.y2}`;
  let arrowHeadId = "arrowHeadMarker" + arrowPath.replace(/ /g, "");
  return (
    <svg
      ref={selfRef}
      width={st.cw}
      height={st.ch}
      // viewBox={`${-excx / 2} ${-excy / 2} ${st.cw} ${st.ch}`}
      style={{
        // border: "2px yellow dashed",
        position: "absolute",
        left: st.cx0,
        top: st.cy0,
        pointerEvents: "none"
      }}
    >
      {/* <defs> */}
      <marker
        id={arrowHeadId}
        viewBox="0 0 12 12"
        refX="3"
        refY="6"
        markerUnits="strokeWidth"
        markerWidth={headSize}
        markerHeight={headSize}
        orient={st.headOrient}
      >
        <path d="M 0 0 L 12 6 L 0 12 L 3 6 z" fill={headColor} />
      </marker>
      {/* <circle r="5" cx={st.cpx1} cy={st.cpy1} fill="green" /> */}
      {/* <circle r="5" cx={st.cpx2} cy={st.cpy2} fill="blue" /> */}
      {/* <circle r="7" cx={st.labelMiddlePos.x} cy={st.labelMiddlePos.y} fill="black" /> */}
      {/* <rect x={st.excx} y={st.excy} width={st.absDx} height={st.absDy} fill="none" stroke="pink" /> */}
      <path
        d={arrowPath}
        stroke={lineColor}
        strokeDasharray={`${dashStroke} ${dashNone}`}
        strokeWidth={strokeWidth}
        fill="transparent"
        markerEnd={`url(#${arrowHeadId})`}
      >
        {animationSpeed ? (
          <animate
            attributeName="stroke-dashoffset"
            values={`${dashoffset * animationDirection};0`}
            dur={`${1 / animationSpeed}s`}
            repeatCount="indefinite"
          />
        ) : null}
      </path>

      {labelStart ? (
        <text {...labelStartExtra} textAnchor={st.dx > 0 ? "start" : "end"} x={st.x1} y={st.y1 - 5}>
          {labelStart}
        </text>
      ) : null}

      {labelMiddle ? (
        <text
          {...labelMiddleExtra}
          textAnchor="middle"
          x={st.labelMiddlePos.x}
          y={st.labelMiddlePos.y}
        >
          {labelMiddle}
        </text>
      ) : null}

      {labelEnd ? (
        <text {...labelEndExtra} textAnchor={st.dx > 0 ? "end" : "start"} x={st.x2} y={st.y2 - 5}>
          {labelEnd}
        </text>
      ) : null}
    </svg>
  );
}

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
  monitorDOMchanges: true,
  registerEvents: [],
  consoleWarning: true,
  advanced: { extendSVGcanvas: 0 }
};

export default Xarrow;
