import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import isEqual from "lodash.isequal";
import pick from "lodash.pick";
import { getElementByPropGiven } from "./utils";
import PT from "prop-types";
import { buzzierMinSols, bzFunction } from "./utils/buzzier";
import { getShortestLine, prepareAnchorLines } from "./utils/anchors";

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
  tailColor?: string | null;
  strokeWidth?: number;
  showHead?: boolean;
  headSize?: number;
  showTail?: boolean;
  tailSize?: number;
  path?: "smooth" | "grid" | "straight";
  curveness?: number;
  dashness?:
    | boolean
    | {
        strokeLen?: number;
        nonStrokeLen?: number;
        animation?: boolean | number;
      };
  passProps?: React.SVGProps<SVGPathElement>;
  SVGcanvasProps?: React.SVGAttributes<SVGSVGElement>;
  arrowBodyProps?: React.SVGProps<SVGPathElement>;
  arrowHeadProps?: React.SVGProps<SVGPathElement>;
  arrowTailProps?: React.SVGProps<SVGPathElement>;
  divContainerProps?: React.HTMLProps<HTMLDivElement>;
  SVGcanvasStyle?: React.CSSProperties;
  divContainerStyle?: React.CSSProperties;
  _extendSVGcanvas?: number;
  _debug?: boolean;
  _cpx1Offset?: number;
  _cpy1Offset?: number;
  _cpx2Offset?: number;
  _cpy2Offset?: number;
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
  offset: { rightness?: number; bottomness?: number };
};
export type refType = React.MutableRefObject<any> | string;
export type labelsType = {
  start?: labelType;
  middle?: labelType;
  end?: labelType;
};
export type labelType = JSX.Element | string;
export type domEventType = keyof GlobalEventHandlersEventMap;

////////////////
// private types

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
    showHead,
    headSize,
    showTail,
    tailColor,
    tailSize,
    path,
    curveness,
    dashness,
    passProps,
    SVGcanvasProps,
    arrowBodyProps,
    arrowHeadProps,
    arrowTailProps,
    divContainerProps,
    SVGcanvasStyle,
    divContainerStyle,
    _extendSVGcanvas,
    _debug,
    _cpx1Offset,
    _cpy1Offset,
    _cpx2Offset,
    _cpy2Offset,
    ...extraProps
  } = props;

  const selfRef = useRef(null);
  const [anchorsRefs, setAnchorsRefs] = useState({ start: null, end: null });

  const [prevPosState, setPrevPosState] = useState<prevPos>(null);
  const [prevProps, setPrevProps] = useState<xarrowPropsType>(null);


  /**
   * determine if an update is needed and update if so.
   * update is needed if one of the connected elements position was changed since last render, or if the ref to one
   * of the elements has changed(it points to a different element).
   */
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
    setPrevProps(props);
  };

  const monitorDOMchanges = () => {
    window.addEventListener("resize", updateIfNeeded);
  };
  const cleanMonitorDOMchanges = () => {
    window.removeEventListener("resize", updateIfNeeded);
  };

  useEffect(() => {
    // console.log("xarrow mounted");
    initProps();
    initAnchorsRefs();
    monitorDOMchanges();
    return () => {
      cleanMonitorDOMchanges();
    };
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
    tailOrient: 0, // determines to what side the arrow tail will point
    labelStartPos: { x: 0, y: 0 },
    labelMiddlePos: { x: 0, y: 0 },
    labelEndPos: { x: 0, y: 0 },
    arrowEnd: { x: 0, y: 0 },
    arrowHeadOffset: { x: 0, y: 0 },
    arrowTailOffset: { x: 0, y: 0 },
    headOffset: 0,
    excRight: 0, //expand canvas to the right
    excLeft: 0, //expand canvas to the left
    excUp: 0, //expand canvas upwards
    excDown: 0, // expand canvas downward
  });

  headSize = Number(headSize);
  strokeWidth = Number(strokeWidth);
  headColor = headColor ? headColor : color;
  tailColor = tailColor ? tailColor : color;
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
    else if (
      ["start", "middle", "end"].some((key) => key in (label as labelsType))
    ) {
      label = label as labelsType;
      ({ start: labelStart, middle: labelMiddle, end: labelEnd } = label);
    }
  }

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
    let s = anchorsRefs.start.getBoundingClientRect();
    let e = anchorsRefs.end.getBoundingClientRect();
    return {
      start: {
        x: s.left,
        y: s.top,
        right: s.right,
        bottom: s.bottom,
      },
      end: {
        x: e.left,
        y: e.top,
        right: e.right,
        bottom: e.bottom,
      },
    };
  };

  /**
   * The Main logic of path calculation for the arrow.
   * calculate new path and adjust canvas based on given properties.
   * */
  const updatePosition = (positions: prevPos): void => {
    let { start: sPos } = positions;
    let { end: ePos } = positions;
    let headOrient: number = 0;
    let tailOrient: number = 0;

    // convert startAnchor and endAnchor to list of objects represents allowed anchors.
    let startPointsObj = prepareAnchorLines(startAnchor, sPos);
    let endPointsObj = prepareAnchorLines(endAnchor, ePos);

    // choose the smallest path for 2 points from these possibilities.
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
    let tailOffset = ((tailSize * 3) / 4) * strokeWidth;
    let cu = Number(curveness);
    if (path === "straight") {
      cu = 0;
      path = "smooth";
    }

    let biggerSide = headSize > tailSize ? headSize : tailSize;
    let calc = strokeWidth + (strokeWidth * biggerSide) / 2;
    let excRight = calc;
    let excLeft = calc;
    let excUp = calc;
    let excDown = calc;
    excLeft += Number(_extendSVGcanvas);
    excRight += Number(_extendSVGcanvas);
    excUp += Number(_extendSVGcanvas);
    excDown += Number(_extendSVGcanvas);

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
    let xTailOffset = 0;
    let yTailOffset = 0;

    if (cu === 0) {
      // in case of straight path
      let headAngel = Math.atan(absDy / absDx);

      if (showHead) {
        x2 -= headOffset * xSign * Math.cos(headAngel);
        y2 -= headOffset * ySign * Math.sin(headAngel);

        // cpx2 -= headOffset * xSign * Math.cos(headAngel);
        // cpy2 -= headOffset * ySign * Math.sin(headAngel);
        headAngel *= ySign;
        if (xSign < 0) headAngel = (Math.PI - headAngel * xSign) * xSign;
        xHeadOffset =
          (Math.cos(headAngel) * headOffset) / 3 -
          (Math.sin(headAngel) * (headSize * strokeWidth)) / 2;
        yHeadOffset =
          (Math.cos(headAngel) * (headSize * strokeWidth)) / 2 +
          (Math.sin(headAngel) * headOffset) / 3;
        headOrient = (headAngel * 180) / Math.PI;
      }

      let tailAngel = Math.atan(absDy / absDx);
      if (showTail) {
        x1 += tailOffset * xSign * Math.cos(tailAngel);
        y1 += tailOffset * ySign * Math.sin(tailAngel);
        // cpx2 -= headOffset * xSign * Math.cos(headAngel);
        // cpy2 -= headOffset * ySign * Math.sin(headAngel);
        tailAngel *= -ySign;
        if (xSign > 0) tailAngel = (Math.PI - tailAngel * xSign) * xSign;
        xTailOffset =
          (Math.cos(tailAngel) * tailOffset) / 3 -
          (Math.sin(tailAngel) * (tailSize * strokeWidth)) / 2;
        yTailOffset =
          (Math.cos(tailAngel) * (tailSize * strokeWidth)) / 2 +
          (Math.sin(tailAngel) * tailOffset) / 3;
        tailOrient = (tailAngel * 180) / Math.PI;
      }

      //todo: add tail support
    } else {
      // in case of smooth path
      if (endAnchorPosition === "middle") {
        // in case a middle anchor is chosen for endAnchor choose from which side to attach to the middle of the element
        if (absDx > absDy) {
          endAnchorPosition = xSign ? "left" : "right";
        } else {
          endAnchorPosition = ySign ? "top" : "bottom";
        }
      }
      if (showHead) {
        if (["left", "right"].includes(endAnchorPosition)) {
          x2 -= headOffset * xSign;
          // cpx2 -= headOffset * xSign * 2;
          // cpx1 += headOffset * xSign;
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
          // cpy1 += headOffset * ySign;
          // cpy2 -= headOffset * ySign;
          if (endAnchorPosition === "top") {
            headOrient = 270;
            if (ySign > 0) headOrient += 180;
          } else {
            headOrient = 90;
            if (ySign < 0) headOrient += 180;
          }
        }
      }
    }

    if (showTail && cu !== 0) {
      if (["left", "right"].includes(startAnchorPosition)) {
        x1 += tailOffset * xSign;
        xTailOffset = -(tailOffset * xSign) / 3;
        yTailOffset = -(tailSize * strokeWidth * xSign) / 2;
        if (startAnchorPosition === "left") {
          tailOrient = 180;
          if (xSign < 0) tailOrient += 180;
        } else {
          tailOrient = 0;
          if (xSign > 0) tailOrient += 180;
        }
      } else if (["top", "bottom"].includes(startAnchorPosition)) {
        yTailOffset = -(tailOffset * ySign) / 3;
        xTailOffset = -(tailSize * strokeWidth * -ySign) / 2;
        y1 += tailOffset * ySign;
        // cpy1 += tailOffset * ySign;
        // cpy2 -= tailOffset * ySign;
        if (startAnchorPosition === "top") {
          tailOrient = 90;
          if (ySign > 0) tailOrient += 180;
        } else {
          tailOrient = 270;
          if (ySign < 0) tailOrient += 180;
        }
      }
    }

    // if (endAnchorPosition == startAnchorPosition) headOrient += 180;
    let arrowHeadOffset = { x: xHeadOffset, y: yHeadOffset };
    let arrowTailOffset = { x: xTailOffset, y: yTailOffset };

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
          // if (absDx < 2 * headOffset) {
          //   cpx1 += headOffset * xSign - absDx / 2;
          //   cpx2 -= headOffset * xSign * 2 - absDx;
          // }
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
          // cpx1 += (absDx * 0.5 - headOffset / 2) * xSign;
          // cpx2 -= (absDx * 0.5 - headOffset / 2) * xSign;
          cpx1 += absDx * 0.5 * xSign;
          cpx2 -= absDx * 0.5 * xSign;
          if (showHead) {
            cpx1 -= (headOffset / 2) * xSign;
            cpx2 += (headOffset / 2) * xSign;
          }
          if (showTail) {
            cpx1 -= (tailOffset / 2) * xSign;
            cpx2 += (tailOffset / 2) * xSign;
          }
        },
        vv: () => {
          // cpy1 += (absDy * 0.5 - headOffset / 2) * ySign;
          // cpy2 -= (absDy * 0.5 - headOffset / 2) * ySign;
          cpy1 += absDy * 0.5 * ySign;
          cpy2 -= absDy * 0.5 * ySign;
          if (showHead) {
            cpy1 -= (headOffset / 2) * ySign;
            cpy2 += (headOffset / 2) * ySign;
          }
          if (showTail) {
            cpy1 -= (tailOffset / 2) * ySign;
            cpy2 += (tailOffset / 2) * ySign;
          }
        },
        hv: () => {
          cpx1 = x2;
        },
        vh: () => {
          cpy1 = y2;
        },
      };
    }

    // smart select best curve for the current anchors
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

    cpx1 += _cpx1Offset;
    cpy1 += _cpy1Offset;
    cpx2 += _cpx2Offset;
    cpy2 += _cpy2Offset;

    ////////////////////////////////////
    // canvas smart size adjustments
    const [xSol1, xSol2] = buzzierMinSols(x1, cpx1, cpx2, x2);
    const [ySol1, ySol2] = buzzierMinSols(y1, cpy1, cpy2, y2);
    if (xSol1 < 0) excLeft += -xSol1;
    if (xSol2 > absDx) excRight += xSol2 - absDx;
    if (ySol1 < 0) excUp += -ySol1;
    if (ySol2 > absDy) excDown += ySol2 - absDy;

    if (path === "grid") {
      excLeft += calc;
      excRight += calc;
      excUp += calc;
      excDown += calc;
    }

    x1 += excLeft;
    x2 += excLeft;
    y1 += excUp;
    y2 += excUp;
    cpx1 += excLeft;
    cpx2 += excLeft;
    cpy1 += excUp;
    cpy2 += excUp;

    const cw = absDx + excLeft + excRight,
      ch = absDy + excUp + excDown;
    cx0 -= excLeft;
    cy0 -= excUp;

    //labels
    const bzx = bzFunction(x1, cpx1, cpx2, x2);
    const bzy = bzFunction(y1, cpy1, cpy2, y2);
    const labelStartPos = { x: bzx(0.01), y: bzy(0.01) };
    const labelMiddlePos = { x: bzx(0.5), y: bzy(0.5) };
    const labelEndPos = { x: bzx(0.99), y: bzy(0.99) };
    const arrowEnd = { x: bzx(1), y: bzy(1) };

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
      tailOrient,
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
      arrowTailOffset,
    });
  };

  const fHeadSize = headSize * strokeWidth; //factored head size
  const fTailSize = tailSize * strokeWidth; //factored head size
  const xOffsetHead = st.x2 - st.arrowHeadOffset.x;
  const yOffsetHead = st.y2 - st.arrowHeadOffset.y;
  const xOffsetTail = st.x1 - st.arrowTailOffset.x;
  const yOffsetTail = st.y1 - st.arrowTailOffset.y;

  // console.log("x1,x2,tailOrient\n:", st.x1, st.x2, st.tailOrient);

  let arrowPath = `M ${st.x1} ${st.y1} C ${st.cpx1} ${st.cpy1}, ${st.cpx2} ${st.cpy2}, ${st.x2} ${st.y2} `;
  if (path === "straight") arrowPath = `M ${st.x1} ${st.y1}  ${st.x2} ${st.y2}`;
  if (path === "grid")
    arrowPath = `M ${st.x1} ${st.y1} L  ${st.cpx1} ${st.cpy1} L ${st.cpx2} ${st.cpy2} L  ${st.x2} ${st.y2}`;

  return (
    <div
      {...divContainerProps}
      style={{ position: "absolute", ...divContainerStyle }}
      {...extraProps}
    >
      <svg
        ref={(selfRef as unknown) as React.LegacyRef<SVGSVGElement>}
        width={st.cw}
        height={st.ch}
        style={{
          position: "absolute",
          left: st.cx0,
          top: st.cy0,
          pointerEvents: "none",
          border: _debug ? "1px dashed yellow" : null,
          ...SVGcanvasStyle,
          // overflow: "hidden",
        }}
        overflow="auto"
        {...SVGcanvasProps}
      >
        {/* debug elements */}
        {_debug ? (
          <>
            {/* control points circles */}
            <circle r="5" cx={st.cpx1} cy={st.cpy1} fill="green" />
            <circle r="5" cx={st.cpx2} cy={st.cpy2} fill="blue" />
            {/* start to end rectangle wrapper */}
            <rect
              x={st.excLeft}
              y={st.excUp}
              width={st.absDx}
              height={st.absDy}
              fill="none"
              stroke="pink"
              strokeWidth="2px"
            />
          </>
        ) : null}

        {/* arrow tail */}
        {showTail ? (
          <path
            d={`M 0 0 L ${fTailSize} ${fTailSize / 2} L 0 ${fTailSize} L ${
              fTailSize / 4
            } ${fTailSize / 2} z`}
            fill={tailColor}
            pointerEvents="all"
            transform={`translate(${xOffsetTail},${yOffsetTail}) rotate(${st.tailOrient})`}
            // transform={`translate(${xOffsetHead},${yOffsetHead}) rotate(${st.headOrient})`}
            {...passProps}
            {...arrowTailProps}
          />
        ) : null}

        {/* body of the arrow */}
        <path
          d={arrowPath}
          stroke={lineColor}
          strokeDasharray={`${dashStroke} ${dashNone}`}
          strokeWidth={strokeWidth}
          fill="transparent"
          pointerEvents="visibleStroke"
          {...passProps}
          // style = {...passStyle}
          {...arrowBodyProps}
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
        {showHead ? (
          <path
            d={`M 0 0 L ${fHeadSize} ${fHeadSize / 2} L 0 ${fHeadSize} L ${
              fHeadSize / 4
            } ${fHeadSize / 2} z`}
            fill={headColor}
            pointerEvents="all"
            transform={`translate(${xOffsetHead},${yOffsetHead}) rotate(${st.headOrient})`}
            {...passProps}
            {...arrowHeadProps}
          />
        ) : null}
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

//////////////////////////////
// propTypes

const pAnchorPositionType = PT.oneOf([
  "middle",
  "left",
  "right",
  "top",
  "bottom",
  "auto",
] as const);

const pAnchorCustomPositionType = PT.exact({
  position: pAnchorPositionType.isRequired,
  offset: PT.shape({
    rightness: PT.number,
    bottomness: PT.number,
  }).isRequired,
});

const _pAnchorType = PT.oneOfType([
  pAnchorPositionType,
  pAnchorCustomPositionType,
]);

const pAnchorType = PT.oneOfType([_pAnchorType, PT.arrayOf(_pAnchorType)]);

const pRefType = PT.oneOfType([
  PT.string,
  PT.exact({ current: PT.instanceOf(Element) }),
]);

const _pLabelType = PT.oneOfType([PT.element, PT.string]);

const pLabelsType = PT.exact({
  start: _pLabelType,
  middle: _pLabelType,
  end: _pLabelType,
});

Xarrow.propTypes = {
  start: pRefType.isRequired,
  end: pRefType.isRequired,
  startAnchor: pAnchorType,
  endAnchor: pAnchorType,
  label: PT.oneOfType([_pLabelType, pLabelsType]),
  color: PT.string,
  lineColor: PT.string,
  showHead: PT.bool,
  headColor: PT.string,
  headSize: PT.number,
  tailSize: PT.number,
  tailColor: PT.string,
  strokeWidth: PT.number,
  showTail: PT.bool,
  path: PT.oneOf(["smooth", "grid", "straight"]),
  curveness: PT.number,
  dashness: PT.oneOfType([PT.bool, PT.object]),
  passProps: PT.object,
  arrowBodyProps: PT.object,
  arrowHeadProps: PT.object,
  arrowTailProps: PT.object,
  SVGcanvasProps: PT.object,
  divContainerProps: PT.object,
  _extendSVGcanvas: PT.number,
  _debug: PT.bool,
  _cpx1Offset: PT.number,
  _cpy1Offset: PT.number,
  _cpx2Offset: PT.number,
  _cpy2Offset: PT.number,
};

Xarrow.defaultProps = {
  startAnchor: "auto",
  endAnchor: "auto",
  label: null,
  color: "CornflowerBlue",
  lineColor: null,
  headColor: null,
  tailColor: null,
  strokeWidth: 4,
  showHead: true,
  headSize: 6,
  showTail: false,
  tailSize: 6,
  path: "smooth",
  curveness: 0.8,
  dashness: false,
  passProps: {},
  arrowBodyProps: {},
  arrowHeadProps: {},
  arrowTailProps: {},
  SVGcanvasProps: {},
  divContainerProps: {},
  _extendSVGcanvas: 0,
  _debug: false,
  _cpx1Offset: 0,
  _cpy1Offset: 0,
  _cpx2Offset: 0,
  _cpy2Offset: 0,
};

export default Xarrow;
