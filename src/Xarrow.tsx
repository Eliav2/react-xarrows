import React, { useRef, useEffect, useState } from "react";
var lodash = require("lodash");

type anchorType = "auto" | "middle" | "left" | "right" | "top" | "bottom";
type props = {
  start: HTMLElement;
  end: HTMLElement;
  startAnchor?: anchorType | anchorType[];
  endAnchor?: anchorType | anchorType[];
  curveness?: number;
};

type point = { x: number; y: number };

function Xarrow(props: props) {
  const selfRef = useRef(null);
  // const [prevProps, setPrevProps] = useState(null);
  // const [prevPosState, setPrevPosState] = useState({ start: { x: 0, y: 0 }, end: { x: 0, y: 0 } });
  const [prevPosState, setPrevPosState] = useState(null);
  // const [hasMounted, setHasMounted] = useState(false);
  //initial state
  const [s, setS] = useState({
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

  const [canvasStartPos, setCanvasStartPos] = useState<point>({ x: 0, y: 0 });

  const getPos = () => {
    let s = props.start.current.getBoundingClientRect();
    let e = props.end.current.getBoundingClientRect();
    return {
      start: { x: s.x, y: s.y, right: s.right, bottom: s.bottom },
      end: { x: e.x, y: e.y, right: e.right, bottom: e.bottom }
    };
  };

  useEffect(() => {
    // equilavent to componentDidMount
    setCanvasStartPos(selfRef.current.getBoundingClientRect());
    let startingPos = getPos();
    setPrevPosState(startingPos);
  }, []);

  useEffect(() => {
    // triggers position update when prevPosState here handed
    if (prevPosState) updatePosition(prevPosState);
  }, [prevPosState]);

  useEffect(() => {
    let posState = getPos();
    if (!lodash.isEqual(prevPosState, posState)) {
      setPrevPosState(posState);
    }
  });

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

    let cx0 = Math.min(s.x, e.x) - canvasStartPos.x;
    let cy0 = Math.min(s.y, e.y) - canvasStartPos.y;
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
      },
      vCurv: () => {
        //vertical - from top to bottom or opposite
        cpx2 = cw;
        cpy2 = ch * (1 - cu);
        cpy1 = ch * cu;
      },
      hvCurv: () => {
        // start horizintaly then verticaly
        // from v side to h side
        if (dx * dy < 0) {
          cpy2 = ch;
          cpx2 = cw * (1 - cu);
          cpy1 = ch * cu;
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
          cpy1 = 0;
          cpx1 = cw * cu; //blue?
          cpy2 = ch * (1 - cu);
          cpx2 = cw;
        } else {
          console.log("heyyy", cpy1);
          cpy1 = ch * cu;
          cpx2 = cw * (1 - cu);
          cpy2 = ch;
        }
      }
    };

    const includeAll = (l: string[], findAll: string[]): boolean => {
      let isTrue = true;
      findAll.forEach(findMe => {
        if (!l.includes(findMe)) isTrue = false;
      });
      return isTrue;
    };

    let st = startAnchorType,
      et = endAnchorType;
    if (["left", "right"].includes(st) && ["right", "left"].includes(et)) {
      curvesPossabilties.hCurv();
    } else if (["top", "bottom"].includes(st) && ["bottom", "top"].includes(et)) {
      curvesPossabilties.vCurv();
    } else if (["top", "bottom"].includes(st) && ["left", "right"].includes(et)) {
      curvesPossabilties.vhCurv();
    } else if (["left", "right"].includes(st) && ["top", "bottom"].includes(et)) {
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
        y1 = dy;
        y2 = 0;
        x2 = -dx;
        cpy1 = ch - cpy1;
        cpy2 = ch - cpy2;
      }
      if (dy < 0) {
        x1 = dx;
        x2 = 0;
        y2 = -dy;
        cpx1 = cw - cpx1;
        cpx2 = cw - cpx2;
      }
    }
    setS({ cx0, cy0, x1, x2, y1, y2, cw, ch, cpx1, cpy1, cpx2, cpy2 });
  };

  return (
    <svg
      ref={selfRef}
      width={s.cw}
      height={s.ch}
      style={{
        border: "1px yellow dashed",
        position: "absolute",
        left: s.cx0,
        top: s.cy0,
        pointerEvents: "none"
      }}
    >
      <circle r="5" cx={s.cpx1} cy={s.cpy1} fill="green" />
      <circle r="5" cx={s.cpx2} cy={s.cpy2} fill="blue" />
      <path
        d={`M ${s.x1} ${s.y1} C  ${s.cpx1} ${s.cpy1}, ${s.cpx2} ${s.cpy2}, ${s.x2} ${s.y2}`}
        stroke="red"
        strokeWidth="3"
        fill="transparent"
      />
    </svg>
  );
}

Xarrow.defaultProps = {
  startAnchor: "auto",
  endAnchor: "auto",
  curveness: 0.7
};

export default Xarrow;
