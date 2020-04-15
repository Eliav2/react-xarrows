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
      `'${ref}' is not a valid react reference to html element OR you tried to render Xarrow before one of the anchors .
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
  const [canvasStartPos, setCanvasStartPos] = useState<point>({ x: 0, y: 0 });

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
    window.addEventListener("resize", updateIfNeeded);
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
    // console.log("AnchorsParents", {
    //   start: allAncestorChildrensStart,
    //   end: allAncestorChildrensEnd,
    //   extra: [...startExtra, ...endExtra]
    // });
    // console.log("SelfParents", parents);

    if (props.consoleWarning) {
      if (allAncestor.style.position !== "relative")
        console.warn(
          `%c Xarrow critical warning: common ancestor should always be in 'relative' positioning! 
        change position style to 'relative' of element `,
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
    setCanvasStartPos({ x: canvPosX, y: canvPosY });
  };

  const testUserGivenProperties = () => {
    if (typeof props.start === "object") {
      if (!("current" in props.start)) {
        let err = Error(
          `'start' property is not of type reference.
          maybe you set 'start' to other object and not to React reference?.\n`
        );
        throw err;
      }
      if (props.start.current === null)
        throw Error(
          `Please make sure the reference to start anchor (property 'start') are provided correctly.
          maybe you tried to render Xarrow before start anchor?.\n`
        );
    }
    if (typeof props.end === "object") {
      if (!("current" in props.end))
        throw Error(
          `'end' property is not of type reference.
          maybe you set 'end' to other object and not to React reference?.\n`
        );

      if (props.end.current === null)
        throw Error(
          `Please make sure the reference to end anchor (property 'end') are provided correctly.
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
    cpx1: 0, // control points - control the curveness of the line
    cpy1: 0,
    cpx2: 0,
    cpy2: 0
  });

  let { color, lineColor, headColor, headSize, strokeWidth, dashness } = props;
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
  if (props.label) {
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

  let userCanvExtra = props.advanced.extendSVGcanvas;
  const extraCanvasSize = {
    excx: strokeWidth * headSize + 20 + userCanvExtra,
    excy: strokeWidth * headSize + 20 + userCanvExtra
  };
  var { excx, excy } = extraCanvasSize;

  const getPos = (): prevPos => {
    if (!anchorsRefs.start) return;
    let s = anchorsRefs.start.getBoundingClientRect();
    let e = anchorsRefs.end.getBoundingClientRect();

    // let yOffsetStart = 0;
    // let xOffsetStart = 0;
    // let yOffsetEnd = 0;
    // let xOffsetEnd = 0;
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
      // [yOffsetStart, xOffsetStart, yOffsetEnd, xOffsetEnd] = [yOffset, xOffset, yOffset, xOffset];
      // anchorsParents.startExtra.forEach(p => {
      //   yOffsetStart -= p.scrollTop;
      //   xOffsetStart -= p.scrollLeft;
      // });
      // anchorsParents.endExtra.forEach(p => {
      //   yOffsetStart -= p.scrollTop;
      //   xOffsetStart -= p.scrollLeft;
      // });
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

      // start: {
      //   x: s.x + xOffsetStart,
      //   y: s.y + yOffsetStart,
      //   right: s.right + xOffsetStart,
      //   bottom: s.bottom + yOffsetStart
      // },
      // end: {
      //   x: e.x + xOffsetEnd,
      //   y: e.y + yOffsetEnd,
      //   right: e.right + xOffsetEnd,
      //   bottom: e.bottom + yOffsetEnd
      // }
    };
  };

  const updatePosition = (positions: prevPos): void => {
    // Do NOT call thie function directly.
    // you should set position by 'setPrevPosState(posState)' and that will trigger
    // this function in the useEffect hook.

    // if(props.arrowStyle.curveness>1){
    //   excx+=
    // }

    let { start: s } = positions;
    let { end: e } = positions;
    let sw = s.right - s.x; //start element width
    let sh = s.bottom - s.y; //start element hight
    let ew = e.right - e.x; //end element width
    let eh = e.bottom - e.y; //end element hight
    let edx = e.x - s.x; // the x diffrence between the two elements
    let edy = e.y - s.y; // the y diffrence between the two elements
    let cx0 = Math.min(s.x, e.x) - canvasStartPos.x;
    let cy0 = Math.min(s.y, e.y) - canvasStartPos.y;
    let dx = edx;
    let dy = edy;

    type anchorOffset = [anchorType, number, number];
    var startAnchorOffsets: anchorOffset[] = [
      ["middle", s.x + sw / 2, s.y + sh / 2],
      ["left", s.x, s.y + sh / 2],
      ["right", s.x + sw, s.y + sh / 2],
      ["top", s.x + sw / 2, s.y],
      ["bottom", s.x + sw / 2, s.y + sh]
    ];
    var endAnchorOffsets: anchorOffset[] = [
      ["middle", e.x + ew / 2, e.y + eh / 2],
      ["left", e.x, e.y + eh / 2],
      ["right", e.x + ew, e.y + eh / 2],
      ["top", e.x + ew / 2, e.y],
      ["bottom", e.x + ew / 2, e.y + eh]
    ];
    const dist = (p1: anchorOffset, p2: anchorOffset) => {
      //length of line
      return Math.sqrt((p1[1] - p2[1]) ** 2 + (p1[2] - p2[2]) ** 2);
    };

    let startAnchorPossabilties = Array.isArray(props.startAnchor)
      ? props.startAnchor
      : [props.startAnchor];
    let endAnchorPossabilties = Array.isArray(props.endAnchor)
      ? props.endAnchor
      : [props.endAnchor];
    const closestPairOfPoints = (): [anchorType, anchorType] => {
      // closes tPair Of Points which feet to the specifed anchors
      let minDist = Infinity;
      let closestPairType: [anchorType, anchorType] = ["middle", "middle"];
      for (let i = 0; i < 5; i++) {
        if (
          !startAnchorPossabilties.includes("auto") &&
          !startAnchorPossabilties.includes(startAnchorOffsets[i][0])
        ) {
          continue;
        }
        for (let j = 0; j < 5; j++) {
          if (
            !endAnchorPossabilties.includes("auto") &&
            !endAnchorPossabilties.includes(endAnchorOffsets[j][0])
          ) {
            continue;
          }
          let d = dist(startAnchorOffsets[i], endAnchorOffsets[j]);
          if (d < minDist) {
            minDist = d;
            closestPairType = [startAnchorOffsets[i][0], endAnchorOffsets[j][0]];
          }
        }
      }
      return closestPairType;
    };

    let closeset = closestPairOfPoints();
    let startAnchorType: anchorType = closeset[0];
    let endAnchorType: anchorType = closeset[1];
    switch (startAnchorType) {
      case "middle":
        cx0 += sw / 2;
        cy0 += sh / 2;
        dx -= sw / 2;
        dy -= sh / 2;
        break;
      case "left":
        cy0 += sh / 2;
        dy -= sh / 2;
        cx0 += dx < 0 ? Math.min(sw / 2, -dx) : 0;
        break;
      case "right":
        dy -= sh / 2;
        dx -= sw;
        cx0 += sw;
        cx0 -= dx + sw / 2 < 0 ? Math.min(sw / 2, -(dx + sw / 2)) : 0;
        cy0 += sh / 2;
        break;
      case "top":
        cx0 += sw / 2;
        dx -= sw / 2;
        cy0 += dy < 0 ? Math.min(sh / 2, -dy) : 0;

        break;
      case "bottom":
        cx0 += sw / 2;
        cy0 += sh;
        dx -= sw / 2;
        dy -= sh;
        cy0 -= dy + sh / 2 < 0 ? Math.min(sh / 2, -(dy - sh / 2)) : 0;

        break;
    }
    switch (endAnchorType) {
      case "middle":
        dx += ew / 2;
        dy += eh / 2;
        break;
      case "left":
        dy += eh / 2;
        cx0 -= dx < 0 ? Math.min(ew / 2, -dx) : 0;
        break;
      case "right":
        dy += eh / 2;
        dx += ew;
        cx0 += dx - ew / 2 < 0 ? Math.min(ew / 2, -(dx - ew / 2)) : 0;
        break;
      case "top":
        dx += ew / 2;
        cy0 -= dy < 0 ? Math.min(eh / 2, -dy) : 0;
        break;

      case "bottom":
        dx += ew / 2;
        dy += eh;
        cy0 += dy - eh / 2 < 0 ? Math.min(eh / 2, -(dy - eh / 2)) : 0;

        break;
    }

    let cw = Math.abs(dx),
      ch = Math.abs(dy);

    let cu = props.curveness;

    cx0 -= excx / 2;
    cy0 -= excy / 2;

    let cpx1 = 0,
      cpy1 = 0,
      cpx2 = 0,
      cpy2 = 0;

    const curvesPossabilties = {
      hCurv: () => {
        //horizinatl - from right to left or the opposite
        cpx2 = cw * (1 - cu);
        cpy2 = ch;
        cpx1 = cw * cu;
        if (dx * dy < 0) {
          cpx1 = cw * (1 - cu);
          cpy1 = ch;
          cpx2 = cw * cu;
          cpy2 = 0;
          // [cpx1, cpy1] = [cpx2, cpy2];
        }
      },
      vCurv: () => {
        //vertical - from top to bottom or opposite
        cpx2 = cw;
        cpy2 = ch * (1 - cu);
        cpy1 = ch * cu;
        if (dx * dy < 0) {
          cpy1 = ch * (1 - cu);
          cpx1 = cw;
          cpy2 = ch * cu;
          cpx2 = 0;
        }
      },
      hvCurv: () => {
        // start horizintaly then verticaly
        // from v side to h side
        if (dx * dy < 0) {
          cpy1 = ch;
          cpx1 = cw * (1 - cu);
          cpy2 = ch * cu;
        } else {
          cpx1 = cw * cu;
          cpx2 = cw;
          cpy2 = ch * cu;
        }
      },
      vhCurv: () => {
        // start verticaly then horizintaly
        // from h side to v side
        if (dx * dy < 0) {
          cpy2 = 0;
          cpx2 = cw * cu; //blue?
          cpy1 = ch * (1 - cu);
          cpx1 = cw;
        } else {
          cpy1 = ch * cu;
          cpx2 = cw * (1 - cu);
          cpy2 = ch;
        }
      }
    };

    let sat = startAnchorType,
      eat = endAnchorType;
    if (["left", "right"].includes(sat) && ["right", "left"].includes(eat)) {
      curvesPossabilties.hCurv();
    } else if (["top", "bottom"].includes(sat) && ["bottom", "top"].includes(eat)) {
      curvesPossabilties.vCurv();
    } else if (["top", "bottom"].includes(sat) && ["left", "right"].includes(eat)) {
      curvesPossabilties.vhCurv();
    } else if (["left", "right"].includes(sat) && ["top", "bottom"].includes(eat)) {
      curvesPossabilties.hvCurv();
    }

    let x1 = 0,
      x2 = dx,
      y1 = 0,
      y2 = dy;

    if (dx < 0 && dy < 0) {
      x1 = -dx;
      y1 = -dy;
      x2 = 0;
      y2 = 0;
      cpy1 = ch - cpy1;
      cpy2 = ch - cpy2;
      cpx1 = cw - cpx1;
      cpx2 = cw - cpx2;
    } else {
      if (dx < 0) {
        cpy1 = ch - cpy1;
        cpy2 = ch - cpy2;
        x1 = -dx;
        x2 = 0;
        y2 = dy;
      }
      if (dy < 0) {
        cpx1 = cw - cpx1;
        cpx2 = cw - cpx2;
        x1 = 0;
        y1 = -dy;
        y2 = 0;
        x2 = dx;
      }
    }
    cw += excx;
    ch += excy;
    setSt({ cx0, cy0, x1, x2, y1, y2, cw, ch, cpx1, cpy1, cpx2, cpy2, dx, dy });
  };

  return (
    <svg
      ref={selfRef}
      width={st.cw}
      height={st.ch}
      viewBox={`${-excx / 2} ${-excy / 2} ${st.cw} ${st.ch}`}
      style={{
        // border: "2px yellow dashed",
        position: "absolute",
        left: st.cx0,
        top: st.cy0,
        pointerEvents: "none"
      }}
    >
      <defs>
        <marker
          id="arrowHead"
          viewBox="0 0 12 12"
          refX="10"
          refY="6"
          markerUnits="strokeWidth"
          markerWidth={headSize}
          markerHeight={headSize}
          orient="auto"
        >
          <path d="M 0 0 L 12 6 L 0 12 L 3 6  z" fill={headColor} />
        </marker>
        <path
          id="MyPath"
          d={`M ${st.x1} ${st.y1} C  ${st.cpx1} ${st.cpy1}, ${st.cpx2} ${st.cpy2}, ${st.x2} ${
            st.y2
          }`}
        />
      </defs>
      {/* <circle r="5" cx={st.cpx1} cy={st.cpy1} fill="green" />
      <circle r="5" cx={st.cpx2} cy={st.cpy2} fill="blue" /> */}
      <path
        d={`M ${st.x1} ${st.y1} C  ${st.cpx1} ${st.cpy1}, ${st.cpx2} ${st.cpy2}, ${st.x2} ${st.y2}`}
        stroke={lineColor}
        strokeDasharray={`${dashStroke} ${dashNone}`}
        strokeWidth={strokeWidth}
        fill="transparent"
        markerEnd="url(#arrowHead)"
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
      <div>heasdasdasdy</div>

      {labelStart ? (
        <text {...labelStartExtra} textAnchor={st.dx > 0 ? "start" : "end"} x={st.x1} y={st.y1 - 5}>
          {labelStart}
        </text>
      ) : null}

      {labelMiddle ? (
        <text
          {...labelMiddleExtra}
          textAnchor="middle"
          x={Math.abs(st.dx) / 2}
          y={Math.abs(st.dy) / 2}
        >
          {labelMiddle}
        </text>
      ) : null}

      {labelEnd ? (
        <text {...labelEndExtra} textAnchor={st.dx > 0 ? "end" : "start"} x={st.x2} y={st.y2 - 5}>
          {labelEnd}
        </text>
      ) : null}

      {/* for later use, maybe add pathLabels  <text>
        <textPath href="#MyPath" startOffset={0}>
          hey asd ss
        </textPath>
      </text> */}
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
  monitorDOMchanges: false,
  registerEvents: [],
  consoleWarning: "true",
  advanced: { extendSVGcanvas: 0 }
};

export default Xarrow;
