import React, { useRef, useEffect, useState } from "react";
var lodash = require("lodash");

type anchorType = "auto" | "middle" | "left" | "right" | "top" | "bottom";
type props = {
  start: HTMLElement;
  end: HTMLElement;
  startAnchor?: anchorType;
  endAnchor?: anchorType;
};

type point = { x: number; y: number };

function Xarrow(props: props) {
  const selfRef = useRef(null);
  // const [prevProps, setPrevProps] = useState(null);
  // const [prevPosState, setPrevPosState] = useState({ start: { x: 0, y: 0 }, end: { x: 0, y: 0 } });
  const [prevPosState, setPrevPosState] = useState(null);
  const [hasMounted, setHasMounted] = useState(false);
  //initial state
  const [s, setS] = useState({
    cx0: 0, //x start position of the canvas
    cy0: 0, //y start position of the canvas
    cw: 0, // the canvas width
    ch: 0, // the canvas height
    x1: 0, //the x starting point of the line inside the canvas
    y1: 0, //the y starting point of the line inside the canvas
    x2: 0, //the x ending point of the line inside the canvas
    y2: 0 //the y ending point of the line inside the canvas
  });

  const [canvasStartPos, setCanvasStartPos] = useState<point>({ x: 0, y: 0 });

  const getPos = () => {
    let s = props.start.ref.current.getBoundingClientRect();
    let e = props.end.ref.current.getBoundingClientRect();
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
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (prevPosState) updatePosition(prevPosState);
  }, [prevPosState]);

  useEffect(() => {
    // console.log("useEffect");
    let posState = getPos();
    if (!lodash.isEqual(prevPosState, posState)) {
      setPrevPosState(posState);
    }
  });

  const updatePosition = positions => {
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
      // ["middle", -sw / 2, -sh / 2],
      ["left", s.x, s.y + sh / 2],
      ["right", s.x + sw, s.y + sh / 2],
      ["top", s.x + sw / 2, s.y],
      ["bottom", s.x + sw / 2, s.y + sh]
    ];
    var endAnchorOffsets = [
      // ["middle", ew / 2, eh / 2],
      ["left", e.x, e.y + eh / 2],
      ["right", e.x + ew, e.y + eh / 2],
      ["top", e.x + ew / 2, e.y],
      ["bottom", e.x + ew / 2, e.y + eh]
    ];
    const dist = (p1, p2) => {
      //length of line
      return Math.sqrt((p1[1] - p2[1]) ** 2 + (p1[2] - p2[2]) ** 2);
    };
    const closestPairOfPoints = () => {
      let minDist = Infinity;
      let closestPair;
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          let d = dist(startAnchorOffsets[i], endAnchorOffsets[j]);
          if (d < minDist) {
            minDist = d;
            closestPair = [startAnchorOffsets[i][0], endAnchorOffsets[j][0]];
          }
        }
      }
      return closestPair;
    };

    let closeset =
      props.startAnchor === "auto" || props.endAnchor === "auto" ? closestPairOfPoints() : null;
    console.log(closeset);

    let startAnchorType = props.startAnchor === "auto" ? closeset[0] : props.startAnchor;
    let endAnchorType = props.endAnchor === "auto" ? closeset[1] : props.endAnchor;
    console.log(endAnchorType);
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

    let x1 = 0,
      x2 = dx,
      y1 = 0,
      y2 = dy;
    if (dx < 0 && dy < 0) {
      x1 = -dx;
      y1 = -dy;
      x2 = 0;
      y2 = 0;
    } else {
      if (dx < 0) {
        y1 = dy;
        y2 = 0;
        x2 = -dx;
      }
      if (dy < 0) {
        x1 = dx;
        x2 = 0;
        y2 = -dy;
      }
    }
    let cw = Math.abs(dx),
      ch = Math.abs(dy);

    // setPrevPosState(positions);
    setS({ cx0, cy0, x1, x2, y1, y2, cw, ch });
  };

  return (
    <svg
      ref={selfRef}
      width={s.cw}
      height={s.ch}
      style={{
        // border: "1px solid black",
        position: "absolute",
        left: s.cx0,
        top: s.cy0,
        pointerEvents: "none"
      }}
    >
      <line
        x1={s.x1}
        x2={s.x2}
        y1={s.y1}
        y2={s.y2}
        style={{ stroke: "rgb(255,0,0)", strokeWidth: "2" }}
      />
    </svg>
  );
}

Xarrow.defaultProps = { startAnchor: "auto", endAnchor: "auto" };

export default Xarrow;
