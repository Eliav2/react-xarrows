import React, { useRef, useEffect, useState, useLayoutEffect } from "react";
var lodash = require("lodash");

type anchorType = "auto" | "middle" | "left" | "right" | "top" | "bottom";
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

type props = {
  start: HTMLElement;
  end: HTMLElement;
  startAnchor: anchorType | anchorType[];
  endAnchor: anchorType | anchorType[];
  curveness: number;
  strokeWidth: number;
  strokeColor: string;
  monitorDOMchanges: boolean;
  registerEvents: registerEvents[];
};

type registerEvents = {
  ref: React.MutableRefObject<any>;
  eventName: keyof GlobalEventHandlersEventMap;
  callback?: CallableFunction;
};

type point = { x: number; y: number };

const findCommonAncestor = (elem, elem2) => {
  let parent1 = elem.parentElement,
    parent2 = elem2.parentElement;
  let childrensOfParent1 = [],
    childrensOfParent2 = [];
  while (parent1 !== null && parent2 !== null) {
    if (parent1 !== !null) {
      childrensOfParent2.push(parent2);
      if (childrensOfParent2.includes(parent1)) return parent1;
    }
    if (parent2 !== !null) {
      childrensOfParent1.push(parent1);
      if (childrensOfParent1.includes(parent2)) return parent2;
    }
    parent1 = parent1.parentElement;
    parent2 = parent1.parentElement;
  }
  return null;
};

const findAllParents = (elem: HTMLElement) => {
  let parents: HTMLElement[] = [];
  let parent = elem;
  while (parent.id !== "root") {
    parents.push(parent);
    parent = parent.parentElement;
  }
  return parents;
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

function Xarrow(props: props) {
  const selfRef = useRef(null);

  const [prevPosState, setPrevPosState] = useState<prevPos>(null);
  const [parents, setParents] = useState<{ end: HTMLElement[]; start: HTMLElement[] }>(null); //list parents of the common ascestor of the arrow with start and end(until "root elemnt")
  const [childrens, setChildrens] = useState<{ end: HTMLElement[]; start: HTMLElement[] }>(null); //list childrens of the common ascestor of the arrow with start and end until start or end
  const [canvasStartPos, setCanvasStartPos] = useState<point>({ x: 0, y: 0 });

  // if (parents) {
  //   let scrolltopSum = parents.start.map(p => p.scrollTop).reduce((a, b) => a + b);
  //   console.log(parents);
  //   console.log(scrolltopSum, scrolltopSum);
  // }

  const handleScroll = e => {
    let posState = getPos();
    if (!lodash.isEqual(prevPosState, posState)) setPrevPosState(posState);
  };

  const handleWindowResize = e => {
    let posState = getPos();
    if (!lodash.isEqual(prevPosState, posState)) setPrevPosState(posState);
  };

  const initParents = (startCommonAncestor, endCommonAncestor) => {
    let startParents = findAllParents(startCommonAncestor);
    let endParents = findAllParents(endCommonAncestor);
    setParents({ start: startParents, end: endParents });
  };

  const initChildrens = (startCommonAncestor, endCommonAncestor) => {
    let startChildrens = findAllChildrens(props.start.current, startCommonAncestor);
    let endChildrens = findAllChildrens(props.end.current, endCommonAncestor);
    setChildrens({ start: startChildrens, end: endChildrens });
  };

  useEffect(() => {
    // equilavent to componentDidMount
    let startCommonAncestor = findCommonAncestor(props.start.current, selfRef.current);
    let endCommonAncestor = findCommonAncestor(props.end.current, selfRef.current);
    setCanvasStartPos(selfRef.current.getBoundingClientRect());
    initParents(startCommonAncestor, endCommonAncestor);
    if (props.monitorDOMchanges) {
      initChildrens(startCommonAncestor, endCommonAncestor);
    }
  }, []);

  useLayoutEffect(() => {
    let startingPos = getPos();
    setPrevPosState(startingPos);
    if (props.monitorDOMchanges) {
      // console.log(childrens);
    }
  }, []);

  useEffect(() => {
    if (childrens && props.monitorDOMchanges) {
      childrens.start.forEach(elem => elem.addEventListener("scroll", handleScroll));
      childrens.end.forEach(elem => elem.addEventListener("scroll", handleScroll));
      window.addEventListener("resize", handleWindowResize);
    }
  }, [childrens]);

  useEffect(() => {
    // triggers position update when prevPosState changed
    if (prevPosState) updatePosition(prevPosState);
  }, [prevPosState]);

  useEffect(() => {
    let posState = getPos();
    if (!lodash.isEqual(prevPosState, posState)) {
      setPrevPosState(posState);
    }
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

    cpx1: 0, // control points - control the curveness of the line
    cpy1: 0,
    cpx2: 0,
    cpy2: 0
  });
  const extra = { excx: props.strokeWidth * 6, excy: props.strokeWidth * 6 };
  const { excx, excy } = extra;

  const getPos = () => {
    let s = props.start.current.getBoundingClientRect();
    let e = props.end.current.getBoundingClientRect();
    let yOffsetStart = window.pageYOffset;
    let xOffsetStart = window.pageXOffset;
    let yOffsetEnd = window.pageYOffset;
    let xOffsetEnd = window.pageXOffset;

    if (parents) {
      parents.start.forEach(parent => {
        yOffsetStart += parent.scrollTop;
        xOffsetStart += parent.scrollLeft;
      });
      if (lodash.isEqual(parents.start, parents.end)) {
        yOffsetEnd = yOffsetStart;
        xOffsetEnd = xOffsetStart;
      } else {
        parents.end.forEach(parent => {
          yOffsetEnd += parent.scrollTop;
          xOffsetEnd += parent.scrollLeft;
        });
      }
    }
    return {
      start: {
        x: s.x + xOffsetStart,
        y: s.y + yOffsetStart,
        right: s.right + xOffsetStart,
        bottom: s.bottom + yOffsetStart
      },
      end: {
        x: e.x + xOffsetEnd,
        y: e.y + yOffsetEnd,
        right: e.right + xOffsetEnd,
        bottom: e.bottom + yOffsetEnd
      }
    };
  };

  const updatePosition = positions => {
    // Do NOT call thie function directly.
    // you should set position by 'setPrevPosState(posState)' and that will trigger
    // this function in the useEffect hook.
    let { start: s } = positions;
    let { end: e } = positions;
    let sw = s.right - s.x; //start element width
    let sh = s.bottom - s.y; //start element hight
    let ew = e.right - e.x; //end element width
    let eh = e.bottom - e.y; //end element hight
    let edx = e.x - s.x; // the x diffrence between the two elements
    let edy = e.y - s.y; // the y diffrence between the two elements
    let cx0 = Math.min(s.x, e.x) - canvasStartPos.x - excx / 2;
    let cy0 = Math.min(s.y, e.y) - canvasStartPos.y - excy / 2;
    let dx = edx;
    let dy = edy;

    var startAnchorOffsets = [
      ["middle", s.x + sw / 2, s.y + sh / 2],
      ["left", s.x, s.y + sh / 2],
      ["right", s.x + sw, s.y + sh / 2],
      ["top", s.x + sw / 2, s.y],
      ["bottom", s.x + sw / 2, s.y + sh]
    ];
    var endAnchorOffsets = [
      ["middle", e.x + ew / 2, e.y + eh / 2],
      ["left", e.x, e.y + eh / 2],
      ["right", e.x + ew, e.y + eh / 2],
      ["top", e.x + ew / 2, e.y],
      ["bottom", e.x + ew / 2, e.y + eh]
    ];
    const dist = (p1, p2) => {
      //length of line
      return Math.sqrt((p1[1] - p2[1]) ** 2 + (p1[2] - p2[2]) ** 2);
    };

    let startAnchorPossabilties = Array.isArray(props.startAnchor)
      ? props.startAnchor
      : [props.startAnchor];
    let endAnchorPossabilties = Array.isArray(props.endAnchor)
      ? props.endAnchor
      : [props.endAnchor];
    const closestPairOfPoints = () => {
      // closes tPair Of Points which feet to the specifed anchors
      let minDist = Infinity;
      let closestPair;
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
            closestPair = [startAnchorOffsets[i][0], endAnchorOffsets[j][0]];
          }
        }
      }
      return closestPair;
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
    setSt({ cx0, cy0, x1, x2, y1, y2, cw, ch, cpx1, cpy1, cpx2, cpy2 });
  };

  return (
    <svg
      ref={selfRef}
      width={st.cw}
      height={st.ch}
      viewBox={`${-excx / 2} ${-excy / 2} ${st.cw} ${st.ch}`}
      style={{
        // border: "1px yellow dashed",
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
          refX={"10"}
          refY="6"
          markerUnits="strokeWidth"
          markerWidth="6"
          markerHeight="6"
          orient="auto"
        >
          <path d="M 0 0 L 12 6 L 0 12 L 3 6  z" fill={props.strokeColor} />
        </marker>
      </defs>
      {/* <circle r="5" cx={st.cpx1} cy={st.cpy1} fill="green" />
      <circle r="5" cx={st.cpx2} cy={st.cpy2} fill="blue" /> */}
      <path
        d={`M ${st.x1} ${st.y1} C  ${st.cpx1} ${st.cpy1}, ${st.cpx2} ${st.cpy2}, ${st.x2} ${st.y2}`}
        stroke={props.strokeColor}
        strokeWidth={props.strokeWidth}
        fill="transparent"
        markerEnd="url(#arrowHead)"
      />
    </svg>
  );
}

Xarrow.defaultProps = {
  startAnchor: "auto",
  endAnchor: "auto",
  curveness: 0.8,
  strokeWidth: 3,
  strokeColor: "CornflowerBlue",
  monitorDOMchanges: false,
  registerEvents: []
};

export default Xarrow;
