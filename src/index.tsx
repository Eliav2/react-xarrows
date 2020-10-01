//// @ts-nocheck

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import isEqual from "lodash.isequal";
import pick from "lodash.pick";
import { getElementByPropGiven, typeOf } from "./utils";
import PropTypes from "prop-types";

///////////////
// public types

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
  path?: "smooth" | "grid" | "straight";
  curveness?: number;
  dashness?:
    | boolean
    | {
        strokeLen?: number;
        nonStrokeLen?: number;
        animation?: boolean | number;
      };
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
export type anchorPositionType =
  | "middle"
  | "left"
  | "right"
  | "top"
  | "bottom"
  | "auto";

export type anchorCustomPositionType = {
  position: anchorPositionType;
  offset: { rightness: number; bottomness: number };
};
export type reactRefType = { current: null | HTMLElement };
export type refType = reactRefType | string;
export type labelsType = {
  start?: labelType;
  middle?: labelType;
  end?: labelType;
};
export type labelType = JSX.Element;
export type domEventType = keyof GlobalEventHandlersEventMap;
export type registerEventsType = {
  ref: refType;
  eventName: domEventType;
  callback?: CallableFunction;
};

////////////////
// private types

type anchorSideType = "left" | "right" | "top" | "bottom";

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

const Xarrow: React.FC<xarrowPropsType> = (props: xarrowPropsType) => {
  let {
    startAnchor,
    endAnchor,
    label,
    color,
    lineColor,
    headColor,
    strokeWidth,
    headSize,
    path,
    curveness,
    dashness,
    passProps,
    advanced,
  } = props;

  const selfRef = useRef(null) as reactRefType;
  const [anchorsRefs, setAnchorsRefs] = useState({ start: null, end: null });

  const [prevPosState, setPrevPosState] = useState<prevPos>(null);
  const [prevProps, setPrevProps] = useState<xarrowPropsType>(null);

  const updateIfNeeded = () => {
    // check if anchors refs changed
    const start = getElementByPropGiven(props.start);
    const end = getElementByPropGiven(props.end);
    // in case one of the elements does not mounted skip any update
    if (start == null || end == null) return;
    // if anchors changed re-set them
    if (!isEqual(anchorsRefs, { start, end })) {
      initAnchorsRefs();
    } else if (!isEqual(props, prevProps)) {
      //first check if any properties changed
      if (prevProps) {
        initProps();
        let posState = getAnchorsPos();
        setPrevPosState(posState);
        updatePosition(posState);
      }
    } else {
      //if the properties did not changed - update position if needed
      let posState = getAnchorsPos();
      if (!isEqual(prevPosState, posState)) {
        setPrevPosState(posState);
        updatePosition(posState);
      }
    }
  };

  const initAnchorsRefs = () => {
    const start = getElementByPropGiven(props.start);
    const end = getElementByPropGiven(props.end);
    setAnchorsRefs({ start, end });
  };

  const initProps = () => {
    // testUserGivenProperties();
    setPrevProps(props);
  };

  useEffect(() => {
    // console.log("xarrow mounted");
    initProps();
    initAnchorsRefs();
  }, []);

  useLayoutEffect(() => {
    // console.log("xarrow rendered!");
    updateIfNeeded();
  });

  const [st, setSt] = useState({
    //initial state
    cx0: 0, //x start position of the canvas
    cy0: 0, //y start position of the canvas
    cw: 0, // the canvas width
    ch: 0, // the canvas height
    x1: 0, //the x starting point of the line inside the canvas
    y1: 0, //the y starting point of the line inside the canvas
    x2: 0, //the x ending point of the line inside the canvas
    y2: 0, //the y ending point of the line inside the canvas
    dx: 0, // the x difference between 'start' anchor to 'end' anchor
    dy: 0, // the y difference between 'start' anchor to 'end' anchor
    absDx: 0, // the x length(positive) difference
    absDy: 0, // the y length(positive) difference
    cpx1: 0, // control points - control the curviness of the line
    cpy1: 0,
    cpx2: 0,
    cpy2: 0,
    headOrient: 0, // determines to what side the arrowhead will point
    labelStartPos: { x: 0, y: 0 },
    labelMiddlePos: { x: 0, y: 0 },
    labelEndPos: { x: 0, y: 0 },
    arrowEnd: { x: 0, y: 0 },
    arrowHeadOffset: { x: 0, y: 0 },
    headOffset: 0,
    excRight: 0, //expand canvas to the right
    excLeft: 0, //expand canvas to the left
    excUp: 0, //expand canvas upwards
    excDown: 0, // expand canvas downward
  });

  headSize = Number(headSize);
  strokeWidth = Number(strokeWidth);
  headColor = headColor ? headColor : color;
  lineColor = lineColor ? lineColor : color;
  let dashStroke = 0,
    dashNone = 0,
    animationSpeed,
    animationDirection = 1;
  if (dashness) {
    if (typeof dashness === "object") {
      dashStroke = dashness.strokeLen
        ? Number(dashness.strokeLen)
        : Number(strokeWidth) * 2;
      dashNone = dashness.strokeLen
        ? Number(dashness.nonStrokeLen)
        : Number(strokeWidth);
      animationSpeed = dashness.animation ? Number(dashness.animation) : null;
    } else if (typeof dashness === "boolean") {
      dashStroke = Number(strokeWidth) * 2;
      dashNone = Number(strokeWidth);
      animationSpeed = null;
    }
  }
  let dashoffset = dashStroke + dashNone;
  if (animationSpeed < 0) {
    animationSpeed *= -1;
    animationDirection = -1;
  }

  let labelStart = null,
    labelMiddle = null,
    labelEnd = null;
  if (label) {
    if (typeof label === "string" || "type" in label) labelMiddle = label;
    else if (["start", "middle", "end"].some((key) => key in label)) {
      label = label as labelsType;
      ({ start: labelStart, middle: labelMiddle, end: labelEnd } = label);
    }
  }

  let {
    passProps: adPassProps = { SVGcanvas: {}, arrowHead: {}, arrowBody: {} },
    extendSVGcanvas: extendSVGcanvas = 0,
  } = advanced;
  let { SVGcanvas = {}, arrowBody = {}, arrowHead = {} } = adPassProps;

  const getSelfPos = () => {
    let {
      left: xarrowElemX,
      top: xarrowElemY,
    } = selfRef.current.getBoundingClientRect();
    let xarrowStyle = getComputedStyle(selfRef.current);
    let xarrowStyleLeft = Number(xarrowStyle.left.slice(0, -2));
    let xarrowStyleTop = Number(xarrowStyle.top.slice(0, -2));
    return {
      x: xarrowElemX - xarrowStyleLeft,
      y: xarrowElemY - xarrowStyleTop,
    };
  };

  const getAnchorsPos = (): prevPos => {
    if (!anchorsRefs.start) return;
    let s = anchorsRefs.start.getBoundingClientRect();
    let e = anchorsRefs.end.getBoundingClientRect();

    let yOffset = 0;
    let xOffset = 0;

    return {
      start: {
        x: s.x + xOffset,
        y: s.y + yOffset,
        right: s.right + xOffset,
        bottom: s.bottom + yOffset,
      },
      end: {
        x: e.x + xOffset,
        y: e.y + yOffset,
        right: e.right + xOffset,
        bottom: e.bottom + yOffset,
      },
    };
  };

  const updatePosition = (positions: prevPos): void => {
    // calculate new position and path and set state based on given properties

    let { start: sPos } = positions;
    let { end: ePos } = positions;
    let headOrient: number = 0;

    //////////////////////////////////////////////////////////////////////
    // declare relevant functions for later use for start and end refs(instead doing all twice)
    const getAnchorsDefaultOffsets = (width: number, height: number) => {
      return {
        middle: { rightness: width * 0.5, bottomness: height * 0.5 },
        left: { rightness: 0, bottomness: height * 0.5 },
        right: { rightness: width, bottomness: height * 0.5 },
        top: { rightness: width * 0.5, bottomness: 0 },
        bottom: { rightness: width * 0.5, bottomness: height },
      };
    };

    const prepareAnchorLines = (anchor, anchorPos) => {
      let defsOffsets = getAnchorsDefaultOffsets(
        anchorPos.right - anchorPos.x,
        anchorPos.bottom - anchorPos.y
      );
      // convert given anchors to array if array not already given
      let anchorChoice = Array.isArray(anchor) ? anchor : [anchor];
      if (anchorChoice.length == 0) anchorChoice = ["auto"];
      //now map each item in the list to relevant object
      let anchorChoiceMapped = anchorChoice.map((anchorChoice) => {
        if (typeOf(anchorChoice) === "string") {
          anchorChoice = anchorChoice as anchorPositionType;
          return {
            position: anchorChoice,
            offset: { rightness: 0, bottomness: 0 },
          };
        } else if (typeOf(anchorChoice) === "object") {
          if (!anchorChoice.offset)
            anchorChoice.offset = { rightness: 0, bottomness: 0 };
          if (!anchorChoice.offset.bottomness)
            anchorChoice.offset.bottomness = 0;
          if (!anchorChoice.offset.rightness) anchorChoice.offset.rightness = 0;
          anchorChoice = anchorChoice as anchorCustomPositionType;
          return anchorChoice;
        }
      });
      //now build the object that represents the users possibilities for different anchors
      let anchorPossibilities: anchorCustomPositionType[] = [];
      if (anchorChoiceMapped.map((a) => a.position).includes("auto")) {
        let autoAnchor = anchorChoiceMapped.find((a) => a.position === "auto");
        (["left", "right", "top", "bottom"] as anchorSideType[]).forEach(
          (anchor) => {
            let offset = defsOffsets[anchor];
            offset.rightness += autoAnchor.offset.rightness;
            offset.bottomness += autoAnchor.offset.bottomness;
            anchorPossibilities.push({ position: anchor, offset });
          }
        );
      } else {
        anchorChoiceMapped.forEach((customAnchor) => {
          let offset = defsOffsets[customAnchor.position] as {
            rightness: number;
            bottomness: number;
          };
          offset.rightness += customAnchor.offset.rightness;
          offset.bottomness += customAnchor.offset.bottomness;
          anchorPossibilities.push({ position: customAnchor.position, offset });
        });
      }
      // now prepare this list of anchors to object expected by the `getShortestLine` function
      return anchorPossibilities.map((pos) => ({
        x: anchorPos.x + pos.offset.rightness,
        y: anchorPos.y + pos.offset.bottomness,
        anchorPosition: pos.position,
      }));
    };
    //end declare functions
    /////////////////////////////////////////////////////////////////////////////////////////

    let startPointsObj = prepareAnchorLines(startAnchor, sPos);
    let endPointsObj = prepareAnchorLines(endAnchor, ePos);

    const dist = (p1, p2) => {
      //length of line
      return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
    };

    type t1 = { x: number; y: number; anchorPosition: anchorPositionType };

    const getShortestLine = (sPoints: t1[], ePoints: t1[]) => {
      // closes tPair Of Points which feet to the specified anchors
      let minDist = Infinity,
        d = Infinity;
      let closestPair: { startPointObj: t1; endPointObj: t1 };
      sPoints.forEach((sp) => {
        ePoints.forEach((ep) => {
          d = dist(sp, ep);
          if (d < minDist) {
            minDist = d;
            closestPair = { startPointObj: sp, endPointObj: ep };
          }
        });
      });
      return closestPair;
    };

    let { startPointObj, endPointObj } = getShortestLine(
      startPointsObj,
      endPointsObj
    );

    let startAnchorPosition = startPointObj.anchorPosition,
      endAnchorPosition = endPointObj.anchorPosition;
    let startPoint = pick(startPointObj, ["x", "y"]),
      endPoint = pick(endPointObj, ["x", "y"]);

    let xarrowElemPos = getSelfPos();
    let cx0 = Math.min(startPoint.x, endPoint.x) - xarrowElemPos.x;
    let cy0 = Math.min(startPoint.y, endPoint.y) - xarrowElemPos.y;
    let dx = endPoint.x - startPoint.x;
    let dy = endPoint.y - startPoint.y;
    let absDx = Math.abs(endPoint.x - startPoint.x);
    let absDy = Math.abs(endPoint.y - startPoint.y);
    let xSign = dx > 0 ? 1 : -1;
    let ySign = dy > 0 ? 1 : -1;
    let headOffset = ((headSize * 3) / 4) * strokeWidth;
    let cu = Number(curveness);
    if (path === "straight") {
      cu = 0;
      path = "smooth";
    }

    let excRight = strokeWidth + (strokeWidth * headSize) / 2;
    let excLeft = strokeWidth + (strokeWidth * headSize) / 2;
    let excUp = strokeWidth + (strokeWidth * headSize) / 2;
    let excDown = strokeWidth + (strokeWidth * headSize) / 2;
    excLeft += Number(extendSVGcanvas);
    excRight += Number(extendSVGcanvas);
    excUp += Number(extendSVGcanvas);
    excDown += Number(extendSVGcanvas);

    ////////////////////////////////////
    // arrow point to point calculations
    let x1 = 0,
      x2 = absDx,
      y1 = 0,
      y2 = absDy;
    if (dx < 0) [x1, x2] = [x2, x1];
    if (dy < 0) [y1, y2] = [y2, y1];

    ////////////////////////////////////
    // arrow curviness and arrowhead placement calculations
    let xHeadOffset = 0;
    let yHeadOffset = 0;
    if (cu === 0) {
      let headAngel = Math.atan(absDy / absDx);
      x2 -= headOffset * xSign * Math.cos(headAngel);
      y2 -= headOffset * ySign * Math.sin(headAngel);
      headAngel *= ySign;
      if (xSign < 0) headAngel = (Math.PI - headAngel * xSign) * xSign;
      xHeadOffset =
        (Math.cos(headAngel) * headOffset) / 3 -
        (Math.sin(headAngel) * (headSize * strokeWidth)) / 2;
      yHeadOffset =
        (Math.cos(headAngel) * (headSize * strokeWidth)) / 2 +
        (Math.sin(headAngel) * headOffset) / 3;
      headOrient = (headAngel * 180) / Math.PI;
    } else {
      if (endAnchorPosition === "middle") {
        if (absDx > absDy) {
          endAnchorPosition = xSign ? "left" : "right";
        } else {
          endAnchorPosition = ySign ? "top" : "bottom";
        }
      }
      if (["left", "right"].includes(endAnchorPosition)) {
        x2 -= headOffset * xSign;
        xHeadOffset = (headOffset * xSign) / 3;
        yHeadOffset = (headSize * strokeWidth * xSign) / 2;
        if (endAnchorPosition === "left") {
          headOrient = 0;
          if (xSign < 0) headOrient += 180;
        } else {
          headOrient = 180;
          if (xSign > 0) headOrient += 180;
        }
      } else if (["top", "bottom"].includes(endAnchorPosition)) {
        yHeadOffset = (headOffset * ySign) / 3;
        xHeadOffset = (headSize * strokeWidth * -ySign) / 2;
        y2 -= headOffset * ySign;
        if (endAnchorPosition === "top") {
          headOrient = 270;
          if (ySign > 0) headOrient += 180;
        } else {
          headOrient = 90;
          if (ySign < 0) headOrient += 180;
        }
      }
    }
    let arrowHeadOffset = { x: xHeadOffset, y: yHeadOffset };

    let cpx1 = x1,
      cpy1 = y1,
      cpx2 = x2,
      cpy2 = y2;

    let curvesPossibilities = {};
    if (path === "smooth")
      curvesPossibilities = {
        hh: () => {
          //horizontal - from right to left or the opposite
          cpx1 += absDx * cu * xSign;
          cpx2 -= absDx * cu * xSign;
          // cpx1 += headOffset * 2 * xSign;
          // cpx2 -= headOffset * 2 * xSign;
        },
        vv: () => {
          //vertical - from top to bottom or opposite
          cpy1 += absDy * cu * ySign;
          cpy2 -= absDy * cu * ySign;
          // cpy1 += headOffset * 2 * ySign;
          // cpy2 -= headOffset * 2 * ySign;
        },
        hv: () => {
          // start horizontally then vertically
          // from v side to h side
          cpx1 += absDx * cu * xSign;
          cpy2 -= absDy * cu * ySign;
        },
        vh: () => {
          // start vertically then horizontally
          // from h side to v side
          cpy1 += absDy * cu * ySign;
          cpx2 -= absDx * cu * xSign;
        },
      };
    else if (path === "grid") {
      curvesPossibilities = {
        hh: () => {
          cpx1 += (absDx * 0.5 - headOffset / 2) * xSign;
          cpx2 -= (absDx * 0.5 - headOffset / 2) * xSign;
        },
        vv: () => {
          cpy1 += (absDy * 0.5 - headOffset / 2) * ySign;
          cpy2 -= (absDy * 0.5 - headOffset / 2) * ySign;
        },
        hv: () => {
          cpx1 = x2;
        },
        vh: () => {
          cpy1 = y2;
        },
      };
    }

    let selectedCurviness = "";
    if (["left", "right"].includes(startAnchorPosition))
      selectedCurviness += "h";
    else if (["bottom", "top"].includes(startAnchorPosition))
      selectedCurviness += "v";
    else if (startAnchorPosition === "middle") selectedCurviness += "m";
    if (["left", "right"].includes(endAnchorPosition)) selectedCurviness += "h";
    else if (["bottom", "top"].includes(endAnchorPosition))
      selectedCurviness += "v";
    else if (endAnchorPosition === "middle") selectedCurviness += "m";
    if (absDx > absDy) selectedCurviness = selectedCurviness.replace(/m/g, "h");
    else selectedCurviness = selectedCurviness.replace(/m/g, "v");
    curvesPossibilities[selectedCurviness]();

    ////////////////////////////////////
    // Buzier curve calculations
    // bzCurve function:  bz = (1−t)^3*p1 + 3(1−t)^2*t*p2 +3(1−t)*t^2*p3 + t^3*p4
    // dt(bz) = -3 p1 (1 - t)^2 + 3 p2 (1 - t)^2 - 6 p2 (1 - t) t + 6 p3 (1 - t) t - 3 p3 t^2 + 3 p4 t^2
    // when p1=(x1,y1),p2=(cpx1,cpy1),p3=(cpx2,cpy2),p4=(x2,y2)
    // then extrema points is when dt(bz) = 0
    // solutions =>  t = ((-6 p1 + 12 p2 - 6 p3) ± sqrt((6 p1 - 12 p2 + 6 p3)^2 - 4 (3 p2 - 3 p1) (-3 p1 + 9 p2 - 9 p3 + 3 p4)))/(2 (-3 p1 + 9 p2 - 9 p3 + 3 p4))  when (p1 + 3 p3!=3 p2 + p4)
    // xSol1,2 = ((-6 x1 + 12 cpx1 - 6 cpx2) ± sqrt((6 x1 - 12 cpx1 + 6 cxp2)^2 - 4 (3 cpx1 - 3 x1) (-3 x1 + 9 cpx1 - 9 cpx2 + 3 x2)))/(2 (-3 x1 + 9 cpx1 - 9 cpx2 + 3 x2))
    // ySol1,2 = ((-6 y1 + 12 cpy1 - 6 cpy2) ± sqrt((6 y1 - 12 cpy1 + 6 cyp2)^2 - 4 (3 cpy1 - 3 y1) (-3 y1 + 9 cpy1 - 9 cpy2 + 3 y2)))/(2 (-3 y1 + 9 cpy1 - 9 cpy2 + 3 y2))
    // now in javascript:
    let txSol1 =
      (-6 * x1 +
        12 * cpx1 -
        6 * cpx2 +
        Math.sqrt(
          (6 * x1 - 12 * cpx1 + 6 * cpx2) ** 2 -
            4 * (3 * cpx1 - 3 * x1) * (-3 * x1 + 9 * cpx1 - 9 * cpx2 + 3 * x2)
        )) /
      (2 * (-3 * x1 + 9 * cpx1 - 9 * cpx2 + 3 * x2));
    let txSol2 =
      (-6 * x1 +
        12 * cpx1 -
        6 * cpx2 -
        Math.sqrt(
          (6 * x1 - 12 * cpx1 + 6 * cpx2) ** 2 -
            4 * (3 * cpx1 - 3 * x1) * (-3 * x1 + 9 * cpx1 - 9 * cpx2 + 3 * x2)
        )) /
      (2 * (-3 * x1 + 9 * cpx1 - 9 * cpx2 + 3 * x2));
    let tySol1 =
      (-6 * y1 +
        12 * cpy1 -
        6 * cpy2 +
        Math.sqrt(
          (6 * y1 - 12 * cpy1 + 6 * cpy2) ** 2 -
            4 * (3 * cpy1 - 3 * y1) * (-3 * y1 + 9 * cpy1 - 9 * cpy2 + 3 * y2)
        )) /
      (2 * (-3 * y1 + 9 * cpy1 - 9 * cpy2 + 3 * y2));
    let tySol2 =
      (-6 * y1 +
        12 * cpy1 -
        6 * cpy2 -
        Math.sqrt(
          (6 * y1 - 12 * cpy1 + 6 * cpy2) ** 2 -
            4 * (3 * cpy1 - 3 * y1) * (-3 * y1 + 9 * cpy1 - 9 * cpy2 + 3 * y2)
        )) /
      (2 * (-3 * y1 + 9 * cpy1 - 9 * cpy2 + 3 * y2));
    const bzx = (t) =>
      (1 - t) ** 3 * x1 +
      3 * (1 - t) ** 2 * t * cpx1 +
      3 * (1 - t) * t ** 2 * cpx2 +
      t ** 3 * x2;
    const bzy = (t) =>
      (1 - t) ** 3 * y1 +
      3 * (1 - t) ** 2 * t * cpy1 +
      3 * (1 - t) * t ** 2 * cpy2 +
      t ** 3 * y2;

    ////////////////////////////////////
    // canvas smart size adjustments

    let xSol1 = bzx(txSol1);
    let xSol2 = bzx(txSol2);
    let ySol1 = bzy(tySol1);
    let ySol2 = bzy(tySol2);
    if (xSol1 < 0) excLeft += -xSol1;
    if (xSol2 > absDx) excRight += xSol2 - absDx;
    if (ySol1 < 0) excUp += -ySol1;
    if (ySol2 > absDy) excDown += ySol2 - absDy;

    x1 += excLeft;
    x2 += excLeft;
    y1 += excUp;
    y2 += excUp;
    cpx1 += excLeft;
    cpx2 += excLeft;
    cpy1 += excUp;
    cpy2 += excUp;

    let cw = absDx + excLeft + excRight,
      ch = absDy + excUp + excDown;
    cx0 -= excLeft;
    cy0 -= excUp;

    //labels
    let labelStartPos = { x: bzx(0.01), y: bzy(0.01) };
    let labelMiddlePos = { x: bzx(0.5), y: bzy(0.5) };
    let labelEndPos = { x: bzx(0.99), y: bzy(0.99) };
    let arrowEnd = { x: bzx(1), y: bzy(1) };

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
      labelStartPos,
      labelMiddlePos,
      labelEndPos,
      arrowEnd,
      excLeft,
      excRight,
      excUp,
      excDown,
      headOffset,
      arrowHeadOffset,
    });
  };

  let fHeadSize = headSize * strokeWidth; //factored headsize
  let xOffsetHead = st.x2 - st.arrowHeadOffset.x;
  let yOffsetHead = st.y2 - st.arrowHeadOffset.y;

  let arrowPath = `M ${st.x1} ${st.y1} C ${st.cpx1} ${st.cpy1}, ${st.cpx2} ${st.cpy2}, ${st.x2} ${st.y2}`;
  if (path === "straight") arrowPath = `M ${st.x1} ${st.y1}  ${st.x2} ${st.y2}`;
  if (path === "grid")
    arrowPath = `M ${st.x1} ${st.y1} L  ${st.cpx1} ${st.cpy1} L ${st.cpx2} ${st.cpy2} L  ${st.x2} ${st.y2}`;

  return (
    <div style={{ position: "absolute" }}>
      <svg
        ref={(selfRef as unknown) as React.LegacyRef<SVGSVGElement>}
        width={st.cw}
        height={st.ch}
        style={{
          // border: "2px yellow dashed",
          position: "absolute",
          left: st.cx0,
          top: st.cy0,
          pointerEvents: "none",
          // overflow: "hidden",
        }}
        overflow="auto"
        {...(SVGcanvas as string)}
      >
        {/* debug */}
        {/*<circle r="5" cx={st.cpx1} cy={st.cpy1} fill="green" />*/}
        {/*<circle r="5" cx={st.cpx2} cy={st.cpy2} fill="blue" />*/}
        {/* <rect
                  x={st.excLeft}
                  y={st.excUp}
                  width={st.absDx}
                  height={st.absDy}
                  fill="none"
                  stroke="pink"
                  strokeWidth="2px"
                /> */}

        {/* body of the arrow */}
        <path
          d={arrowPath}
          stroke={lineColor}
          strokeDasharray={`${dashStroke} ${dashNone}`}
          strokeWidth={strokeWidth}
          fill="transparent"
          // markerEnd={`url(#${arrowHeadId})`}
          pointerEvents="visibleStroke"
          {...(passProps as string)}
          {...(arrowBody as string)}
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
        {/* head of the arrow */}
        <path
          d={`M 0 0 L ${fHeadSize} ${fHeadSize / 2} L 0 ${fHeadSize} L ${
            fHeadSize / 4
          } ${fHeadSize / 2} z`}
          fill={headColor}
          // pointerEvents="all"
          transform={`translate(${xOffsetHead},${yOffsetHead}) rotate(${st.headOrient})`}
          {...(passProps as string)}
          {...(arrowHead as string)}
        />
      </svg>

      {labelStart ? (
        <div
          style={{
            transform:
              st.dx < 0 ? "translate(-100% , -50%)" : "translate(-0% , -50%)",
            width: "max-content",
            position: "absolute",
            left: st.cx0 + st.labelStartPos.x,
            top: st.cy0 + st.labelStartPos.y - strokeWidth - 5,
          }}
        >
          {labelStart}
        </div>
      ) : null}
      {labelMiddle ? (
        <div
          style={{
            display: "table",
            width: "max-content",
            transform: "translate(-50% , -50%)",
            position: "absolute",
            left: st.cx0 + st.labelMiddlePos.x,
            top: st.cy0 + st.labelMiddlePos.y,
          }}
        >
          {labelMiddle}
        </div>
      ) : null}
      {labelEnd ? (
        <div
          style={{
            transform:
              st.dx > 0 ? "translate(-100% , -50%)" : "translate(-0% , -50%)",
            width: "max-content",
            position: "absolute",
            left: st.cx0 + st.labelEndPos.x,
            top: st.cy0 + st.labelEndPos.y + strokeWidth + 5,
          }}
        >
          {labelEnd}
        </div>
      ) : null}
    </div>
  );
};

const pAnchorPositionType = PropTypes.oneOf([
  "middle",
  "left",
  "right",
  "top",
  "bottom",
  "auto",
]);
const pAnchorCustomPositionType = PropTypes.shape({
  position: pAnchorPositionType.isRequired,
  offset: PropTypes.shape({
    rightness: PropTypes.number,
    bottomness: PropTypes.number,
  }),
});

const pAnchorType = PropTypes.oneOfType([
  pAnchorPositionType,
  pAnchorCustomPositionType,
  PropTypes.arrayOf(
    PropTypes.oneOfType([pAnchorPositionType, pAnchorCustomPositionType])
  ),
]);

const pRefType = PropTypes.oneOfType([PropTypes.string, PropTypes.object]);

Xarrow.propTypes = {
  start: pRefType.isRequired,
  end: pRefType.isRequired,
  startAnchor: pAnchorType,
  endAnchor: pAnchorType,
  label: PropTypes.oneOfType([PropTypes.elementType, PropTypes.object]),
  color: PropTypes.string,
  lineColor: PropTypes.string,
  headColor: PropTypes.string,
  strokeWidth: PropTypes.number,
  headSize: PropTypes.number,
  path: PropTypes.oneOf(["smooth", "grid", "straight"]),
  curveness: PropTypes.number,
  dashness: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  passProps: PropTypes.object,
};

Xarrow.defaultProps = {
  startAnchor: "auto",
  endAnchor: "auto",
  label: null,
  color: "CornflowerBlue",
  lineColor: null,
  headColor: null,
  strokeWidth: 4,
  headSize: 6,
  path: "smooth",
  curveness: 0.8,
  dashness: false,
  passProps: {},
  advanced: {
    extendSVGcanvas: 0,
    passProps: { arrowBody: {}, arrowHead: {}, SVGcanvas: {} },
  },
};

export default Xarrow;
