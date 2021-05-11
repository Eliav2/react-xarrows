import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import isEqual from 'lodash.isequal';
import pick from 'lodash.pick';
import { getElementByPropGiven } from './utils';
import PT from 'prop-types';
import { buzzierMinSols, bzFunction } from './utils/buzzier';
import { getShortestLine, prepareAnchorLines } from './utils/anchors';
import { _prevPosType, labelsType, svgCustomEdgeType, svgEdgeShapeType, xarrowPropsType } from './types';
import useCallOnNextRender from 'react-use-call-onnext-render';

export type { labelsType, svgCustomEdgeType, svgEdgeShapeType, xarrowPropsType };

// constants used for typescript and proptypes definitions
export const tAnchorEdge = ['middle', 'left', 'right', 'top', 'bottom', 'auto'] as const;
export const tPaths = ['smooth', 'grid', 'straight'] as const;
export const tSvgElems = ['circle', 'ellipse', 'line', 'path', 'polygon', 'polyline', 'rect'] as const;

//default arrows svgs
export const arrowShapes = {
  arrow1: { svgElem: 'path', svgProps: { d: `M 0 0 L 1 0.5 L 0 1 L 0.25 0.5 z` }, offsetForward: 0.25 },
  heart: {
    svgElem: 'path',
    svgProps: {
      d: `M 0,0.25 A 0.125,0.125 0,0,1 0.5,0.25 A 0.125,0.125 0,0,1 1,0.25 Q 1,0.625 0.5,1 Q 0,0.625 0,0.25 z`,
    },
    offsetForward: 0.1,
  },
  circle: {
    svgElem: 'circle',
    svgProps: {
      r: 0.5,
      cx: 0.5,
      cy: 0.5,
      // children: <animate attributeName="r" values={'0.25;0.5;0.25'} dur="1s" repeatCount={'indefinite'} />,
    },
    offsetForward: 0.1,
  },
  arrow2: {
    svgElem: 'path',
    svgProps: {
      //// handle automatic resize of the svg
      // d: `M 0.5 1 l -0.171749 -0.16666 0.3333 -0.3333 -0.3333 -0.3333 0.171749 -0.16666 0.494916 0.5 z`,
      // d: `M 0 1 l -0.171749 -0.16666 0.3333 -0.3333 -0.3333 -0.3333 0.171749 -0.16666 0.494916 0.5 z`,
      d: `M 0 24 l -4.122     -4      8      -8      -8      -8       4.122    -4 11.878 12 z`,
    },
    // offsetForward: -0.65,
  },
  // todo: add more default shapes
} as const;

export const tArrowShapes = Object.keys(arrowShapes) as Array<keyof typeof arrowShapes>;

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
    showXarrow,
    curveness,
    dashness,
    headShape,
    tailShape,
    animateDrawing,
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

  const mainDivRef = useRef(null);
  const lineRef = useRef(null);
  const headRef = useRef(null);
  const tailRef = useRef(null);
  const lineDrawAnimRef = useRef(null);
  const lineDashAnimRef = useRef(null);
  const headOpacityAnimRef = useRef<SVGAnimationElement>(null);

  const startRef = useRef(null);
  const endRef = useRef(null);

  const prevPosState = useRef<_prevPosType>(null);
  const prevProps = useRef<xarrowPropsType>(null);

  // const [headBox, setHeadBox] = useState({ x: 0, y: 0, width: 1, height: 1 });
  // const [tailBox, setTailBox] = useState({ x: 0, y: 0, width: 1, height: 1 });

  const [drawAnimEnded, setDrawAnimEnded] = useState(!animateDrawing);

  const [_, setRerender] = useState({});
  const dumyRenderer = () => setRerender({});

  if (process.env.NODE_ENV === 'development') {
    // debug
    var _render = useRef(0);
    var _call = useRef(-1);
    _call.current += 1;
    var consoleState = () => `{call:${_call.current},render:${_render.current}}`;
    var log = (...args) => console.log(...args, consoleState());
  }

  /**
   * determine if an update is needed and update if so.
   * update is needed if one of the connected elements position was changed since last render,
   * or if the ref to one of the elements has changed(it points to a different element)
   * or if one of the given props has changed
   */
  const updateIfNeeded = () => {
    // in case one of the elements does not mounted skip any update
    if (startRef == null || endRef == null || showXarrow == false) return;

    if (!isEqual(props, prevProps.current)) {
      //first check if any properties changed
      if (prevProps.current) {
        initProps();
        prevPosState.current = getElemsPos();
        updatePosition();
      }
    } else {
      //if the properties did not changed - update position if needed
      let posState = getElemsPos();
      if (!isEqual(prevPosState.current, posState)) {
        prevPosState.current = posState;
        updatePosition();
      }
    }
  };

  const initAnchorsRefs = () => {
    startRef.current = getElementByPropGiven(props.start);
    endRef.current = getElementByPropGiven(props.end);
  };

  const initProps = () => {
    prevProps.current = props;
  };

  const monitorDOMchanges = () => {
    window.addEventListener('resize', updateIfNeeded);

    const handleDrawAmimEnd = () => {
      setDrawAnimEnded(true);
      // @ts-ignore
      headOpacityAnimRef.current.beginElement();
      lineDashAnimRef.current?.beginElement();
    };
    const handleDrawAmimBegin = () => (headRef.current.style.opacity = '0');
    if (lineDrawAnimRef.current && headRef.current) {
      lineDrawAnimRef.current.addEventListener('endEvent', handleDrawAmimEnd);
      lineDrawAnimRef.current.addEventListener('beginEvent', handleDrawAmimBegin);
    }
    return () => {
      window.removeEventListener('resize', updateIfNeeded);
      if (lineDrawAnimRef.current) {
        lineDrawAnimRef.current.removeEventListener('endEvent', handleDrawAmimEnd);
        if (headRef.current) lineDrawAnimRef.current.removeEventListener('beginEvent', handleDrawAmimBegin);
      }
    };
  };

  // const headBox = headRef.current?.getBBox({ stroke: true }) ?? { x: 0, y: 0, width: 1, height: 1 };

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
    startPoints: [],
    endPoints: [],
    mainDivPos: { x: 0, y: 0 },
    xSign: 1,
    ySign: 1,
    headBox: { x: 0, y: 0, width: 1, height: 1 },
    lineLength: 0,
  });

  headSize = Number(headSize);
  strokeWidth = Number(strokeWidth);
  headColor = headColor ? headColor : color;
  tailColor = tailColor ? tailColor : color;
  lineColor = lineColor ? lineColor : color;
  let dashStroke = 0,
    dashNone = 0,
    animDashSpeed,
    animDirection = 1;
  if (dashness) {
    if (typeof dashness === 'object') {
      dashStroke = dashness.strokeLen ? Number(dashness.strokeLen) : Number(strokeWidth) * 2;
      dashNone = dashness.strokeLen ? Number(dashness.nonStrokeLen) : Number(strokeWidth);
      animDashSpeed = dashness.animation ? Number(dashness.animation) : null;
    } else if (typeof dashness === 'boolean') {
      dashStroke = Number(strokeWidth) * 2;
      dashNone = Number(strokeWidth);
      animDashSpeed = null;
    }
  }

  let labelStart = null,
    labelMiddle = null,
    labelEnd = null;
  if (label) {
    if (typeof label === 'string' || 'type' in label) labelMiddle = label;
    else if (['start', 'middle', 'end'].some((key) => key in (label as labelsType))) {
      label = label as labelsType;
      ({ start: labelStart, middle: labelMiddle, end: labelEnd } = label);
    }
  }

  const defaultEdge = (svgEdge): svgCustomEdgeType => {
    if (typeof svgEdge == 'string') {
      if (svgEdge in arrowShapes) svgEdge = arrowShapes[svgEdge as svgEdgeShapeType];
      else {
        console.warn(
          `'${svgEdge}' is not supported arrow shape. the supported arrow shapes is one of ${tArrowShapes}.
           reverting to default shape.`
        );
        svgEdge = arrowShapes['arrow1'];
      }
    }
    svgEdge = svgEdge as svgCustomEdgeType;
    if (svgEdge?.offsetForward === undefined) svgEdge.offsetForward = 0.25;
    if (svgEdge?.svgElem === undefined) svgEdge.svgElem = 'path';
    if (svgEdge?.svgProps === undefined) svgEdge.svgProps = arrowShapes.arrow1.svgProps;
    return svgEdge;
  };
  headShape = defaultEdge(headShape);
  tailShape = defaultEdge(tailShape);

  let fHeadSize = headSize * strokeWidth; //factored head size
  let fTailSize = tailSize * strokeWidth; //factored head size

  const getSelfPos = () => {
    // if (!mainDivRef.current) return { x: 0, y: 0 };
    let { left: xarrowElemX, top: xarrowElemY } = mainDivRef.current.getBoundingClientRect();
    let xarrowStyle = getComputedStyle(mainDivRef.current);
    let xarrowStyleLeft = Number(xarrowStyle.left.slice(0, -2));
    let xarrowStyleTop = Number(xarrowStyle.top.slice(0, -2));
    return {
      x: xarrowElemX - xarrowStyleLeft,
      y: xarrowElemY - xarrowStyleTop,
    };
  };

  const getElemPos = (elem: HTMLElement) => {
    const pos = elem.getBoundingClientRect();
    return {
      x: pos.left,
      y: pos.top,
      right: pos.right,
      bottom: pos.bottom,
    };
  };

  const getElemsPos = (): _prevPosType => {
    let start = getElemPos(startRef.current);
    let end = getElemPos(endRef.current);
    return { start, end };
  };

  /**
   * The Main logic of path calculation for the arrow.
   * calculate new path, adjusting canvas, and set state based on given properties.
   * */
  const updatePosition = (positions: _prevPosType = prevPosState.current): void => {
    let { start: sPos } = positions;
    let { end: ePos } = positions;
    let headOrient: number = 0;
    let tailOrient: number = 0;

    // convert startAnchor and endAnchor to list of objects represents allowed anchors.
    let startPoints = prepareAnchorLines(startAnchor, sPos);
    let endPoints = prepareAnchorLines(endAnchor, ePos);

    // choose the smallest path for 2 ponts from these possibilities.
    let { startPointObj, endPointObj } = getShortestLine(startPoints, endPoints);

    let startAnchorPosition = startPointObj.anchorPosition,
      endAnchorPosition = endPointObj.anchorPosition;
    let startPoint = pick(startPointObj, ['x', 'y']),
      endPoint = pick(endPointObj, ['x', 'y']);

    headShape = headShape as svgCustomEdgeType;
    tailShape = tailShape as svgCustomEdgeType;

    let mainDivPos = getSelfPos();
    let cx0 = Math.min(startPoint.x, endPoint.x) - mainDivPos.x;
    let cy0 = Math.min(startPoint.y, endPoint.y) - mainDivPos.y;
    let dx = endPoint.x - startPoint.x;
    let dy = endPoint.y - startPoint.y;
    let absDx = Math.abs(endPoint.x - startPoint.x);
    let absDy = Math.abs(endPoint.y - startPoint.y);
    let xSign = dx > 0 ? 1 : -1;
    let ySign = dy > 0 ? 1 : -1;
    let [headOffset, tailOffset] = [headShape.offsetForward, tailShape.offsetForward];
    let _headOffset = fHeadSize * headOffset;
    let _tailOffset = fTailSize * tailOffset;
    const headBox = headRef.current?.getBBox({ stroke: true }) ?? { x: 0, y: 0, width: 1, height: 1 };
    // const headBox = measureFunc(() => headRef.current?.getBBox({ stroke: true }), 'getBBox') ?? {
    //   x: 0,
    //   y: 0,
    //   width: 0,
    //   height: 0,
    // };

    // console.log(headRef.current?.getBBox({ stroke: true }));
    // const headBox = { x: 0, y: 0, width: 1, height: 1 };

    let cu = Number(curveness);
    if (!tPaths.includes(path)) path = 'smooth';
    if (path === 'straight') {
      cu = 0;
      path = 'smooth';
    }

    let biggerSide = headSize > tailSize ? headSize : tailSize;
    let _calc = strokeWidth + (strokeWidth * biggerSide) / 2;
    let excRight = _calc;
    let excLeft = _calc;
    let excUp = _calc;
    let excDown = _calc;
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
        x2 -= fHeadSize * (1 - headOffset) * xSign * Math.cos(headAngel);
        y2 -= fHeadSize * (1 - headOffset) * ySign * Math.sin(headAngel);

        headAngel *= ySign;
        if (xSign < 0) headAngel = (Math.PI - headAngel * xSign) * xSign;
        xHeadOffset = Math.cos(headAngel) * _headOffset - (Math.sin(headAngel) * fHeadSize) / 2;
        yHeadOffset = (Math.cos(headAngel) * fHeadSize) / 2 + Math.sin(headAngel) * _headOffset;
        headOrient = (headAngel * 180) / Math.PI;
      }

      let tailAngel = Math.atan(absDy / absDx);
      if (showTail) {
        x1 += fTailSize * (1 - tailOffset) * xSign * Math.cos(tailAngel);
        y1 += fTailSize * (1 - tailOffset) * ySign * Math.sin(tailAngel);
        tailAngel *= -ySign;
        if (xSign > 0) tailAngel = (Math.PI - tailAngel * xSign) * xSign;
        xTailOffset = Math.cos(tailAngel) * _tailOffset - (Math.sin(tailAngel) * fTailSize) / 2;
        yTailOffset = (Math.cos(tailAngel) * fTailSize) / 2 + Math.sin(tailAngel) * _tailOffset;
        tailOrient = (tailAngel * 180) / Math.PI;
      }
    } else {
      // in case of smooth path
      if (endAnchorPosition === 'middle') {
        // in case a middle anchor is chosen for endAnchor choose from which side to attach to the middle of the element
        if (absDx > absDy) {
          endAnchorPosition = xSign ? 'left' : 'right';
        } else {
          endAnchorPosition = ySign ? 'top' : 'bottom';
        }
      }
      if (showHead) {
        if (['left', 'right'].includes(endAnchorPosition)) {
          //todo: rotate all transforms(and arrows svg) by 90
          //// for 90 deg turn
          // xHeadOffset = -fHeadSize + _headOffset * xSign;
          // x2 -= fHeadSize * (1 - headOffset) * xSign;
          // yHeadOffset = (fHeadSize / 2) * xSign;
          // if (endAnchorPosition === "left") {
          //   headOrient = 90;
          // ...

          // const headBox = headRef.current.getBBox({ stroke: true });

          xHeadOffset = _headOffset * xSign;
          x2 -= fHeadSize * xSign - xHeadOffset;
          // x2 -= fHeadSize * (1 - headOffset) * xSign; //same!
          yHeadOffset = (fHeadSize * xSign * headBox.height) / 2;
          // const xm = 1 - (headBox.width + headBox.x);
          // xHeadOffset = xHeadOffset - xm * strokeWidth * xHeadOffset;
          // yHeadOffset = yHeadOffset - (1 - headBox.height - headBox.y) * strokeWidth * yHeadOffset;

          if (endAnchorPosition === 'left') {
            headOrient = 0;
            if (xSign < 0) headOrient += 180;
          } else {
            headOrient = 180;
            if (xSign > 0) headOrient += 180;
          }
        } else if (['top', 'bottom'].includes(endAnchorPosition)) {
          xHeadOffset = (fHeadSize * -ySign) / 2;
          yHeadOffset = _headOffset * ySign;
          y2 -= fHeadSize * ySign - yHeadOffset;
          if (endAnchorPosition === 'top') {
            headOrient = 270;
            if (ySign > 0) headOrient += 180;
          } else {
            headOrient = 90;
            if (ySign < 0) headOrient += 180;
          }
          // const xm = 1 - headBox.width - headBox.x;
          // yHeadOffset = yHeadOffset - xm * strokeWidth * yHeadOffset;
        }
      }
    }
    if (showTail && cu !== 0) {
      if (['left', 'right'].includes(startAnchorPosition)) {
        xTailOffset = _tailOffset * -xSign;
        x1 += fTailSize * xSign + xTailOffset;
        yTailOffset = -(fTailSize * xSign) / 2;
        if (startAnchorPosition === 'left') {
          tailOrient = 180;
          if (xSign < 0) tailOrient += 180;
        } else {
          tailOrient = 0;
          if (xSign > 0) tailOrient += 180;
        }
      } else if (['top', 'bottom'].includes(startAnchorPosition)) {
        yTailOffset = _tailOffset * -ySign;
        y1 += fTailSize * ySign + yTailOffset;
        xTailOffset = (fTailSize * ySign) / 2;
        if (startAnchorPosition === 'top') {
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
    if (path === 'smooth')
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
    else if (path === 'grid') {
      curvesPossibilities = {
        hh: () => {
          // cpx1 += (absDx * 0.5 - headOffset / 2) * xSign;
          // cpx2 -= (absDx * 0.5 - headOffset / 2) * xSign;
          cpx1 += absDx * 0.5 * xSign;
          cpx2 -= absDx * 0.5 * xSign;
          if (showHead) {
            cpx1 -= ((fHeadSize * (1 - headOffset)) / 2) * xSign;
            cpx2 += ((fHeadSize * (1 - headOffset)) / 2) * xSign;
          }
          if (showTail) {
            cpx1 -= ((fTailSize * (1 - tailOffset)) / 2) * xSign;
            cpx2 += ((fTailSize * (1 - tailOffset)) / 2) * xSign;
          }
        },
        vv: () => {
          cpy1 += absDy * 0.5 * ySign;
          cpy2 -= absDy * 0.5 * ySign;
          if (showHead) {
            cpy1 -= ((fHeadSize * (1 - headOffset)) / 2) * ySign;
            cpy2 += ((fHeadSize * (1 - headOffset)) / 2) * ySign;
          }
          if (showTail) {
            cpy1 -= ((fTailSize * (1 - tailOffset)) / 2) * ySign;
            cpy2 += ((fTailSize * (1 - tailOffset)) / 2) * ySign;
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
    let selectedCurviness = '';
    if (['left', 'right'].includes(startAnchorPosition)) selectedCurviness += 'h';
    else if (['bottom', 'top'].includes(startAnchorPosition)) selectedCurviness += 'v';
    else if (startAnchorPosition === 'middle') selectedCurviness += 'm';
    if (['left', 'right'].includes(endAnchorPosition)) selectedCurviness += 'h';
    else if (['bottom', 'top'].includes(endAnchorPosition)) selectedCurviness += 'v';
    else if (endAnchorPosition === 'middle') selectedCurviness += 'm';
    if (absDx > absDy) selectedCurviness = selectedCurviness.replace(/m/g, 'h');
    else selectedCurviness = selectedCurviness.replace(/m/g, 'v');
    curvesPossibilities[selectedCurviness]();

    cpx1 += _cpx1Offset;
    cpy1 += _cpy1Offset;
    cpx2 += _cpx2Offset;
    cpy2 += _cpy2Offset;

    ////////////////////////////////////
    // canvas smart size adjustments
    // todo: fix: calc edges size and adjust canvas
    const [xSol1, xSol2] = buzzierMinSols(x1, cpx1, cpx2, x2);
    const [ySol1, ySol2] = buzzierMinSols(y1, cpy1, cpy2, y2);
    if (xSol1 < 0) excLeft += -xSol1;
    if (xSol2 > absDx) excRight += xSol2 - absDx;
    if (ySol1 < 0) excUp += -ySol1;
    if (ySol2 > absDy) excDown += ySol2 - absDy;

    if (path === 'grid') {
      excLeft += _calc;
      excRight += _calc;
      excUp += _calc;
      excDown += _calc;
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
      headOffset: _headOffset,
      arrowHeadOffset,
      arrowTailOffset,
      startPoints,
      endPoints,
      mainDivPos,
      xSign,
      ySign,
      headBox,
      lineLength: lineRef.current.getTotalLength(),
    });
  };

  const xOffsetHead = st.x2 - st.arrowHeadOffset.x;
  const yOffsetHead = st.y2 - st.arrowHeadOffset.y;
  const xOffsetTail = st.x1 - st.arrowTailOffset.x;
  const yOffsetTail = st.y1 - st.arrowTailOffset.y;

  let dashoffset = dashStroke + dashNone;
  if (animDashSpeed < 0) {
    animDashSpeed *= -1;
    animDirection = -1;
  }
  let dashArray,
    animation,
    animRepeatCount,
    animStartValue,
    animEndValue = 0;

  if (animateDrawing && drawAnimEnded == false) {
    if (typeof animateDrawing === 'boolean') animateDrawing = 1;
    animation = animateDrawing + 's';
    dashArray = st.lineLength;
    animStartValue = st.lineLength;
    animRepeatCount = 1;
    if (animateDrawing < 0) {
      [animStartValue, animEndValue] = [animEndValue, animStartValue];
      animation = animateDrawing * -1 + 's';
    }
    // }
  } else {
    dashArray = `${dashStroke} ${dashNone}`;
    animation = `${1 / animDashSpeed}s`;
    animStartValue = dashoffset * animDirection;
    animRepeatCount = 'indefinite';
    animEndValue = 0;
  }

  let arrowPath = `M ${st.x1} ${st.y1} C ${st.cpx1} ${st.cpy1}, ${st.cpx2} ${st.cpy2}, ${st.x2} ${st.y2} `;
  if (path === 'straight') arrowPath = `M ${st.x1} ${st.y1}  ${st.x2} ${st.y2}`;
  if (path === 'grid')
    arrowPath = `M ${st.x1} ${st.y1} L  ${st.cpx1} ${st.cpy1} L ${st.cpx2} ${st.cpy2} L  ${st.x2} ${st.y2}`;

  const initXarrow = () => {
    initProps();
    initAnchorsRefs();
  };

  useLayoutEffect(() => {
    updateIfNeeded();

    if (process.env.NODE_ENV === 'development') {
      // log('xarrow has rendered!');
      _render.current += 1;
    }
  });

  // update refs to elements if needed
  useLayoutEffect(() => {
    startRef.current = getElementByPropGiven(props.start);
  }, [props.start]);
  useLayoutEffect(() => {
    endRef.current = getElementByPropGiven(props.end);
  }, [props.end]);

  // handle draw animation
  useLayoutEffect(() => {
    if (lineRef.current) setSt((prevSt) => ({ ...prevSt, lineLength: lineRef.current.getTotalLength() }));
  }, [lineRef.current]);

  // set all props on first render
  useLayoutEffect(() => {
    if (showXarrow) {
      initXarrow();
      updateIfNeeded();
    }
    const cleanMonitorDOMchanges = monitorDOMchanges();
    return () => {
      setDrawAnimEnded(false);
      cleanMonitorDOMchanges();
    };
  }, [showXarrow]);

  // console.log(st.headBox.height);
  fHeadSize /= 1;
  // todo: fix! probabely related to updatePosition func which change the state
  // fHeadSize /= st.headBox.height;
  // console.log(fHeadSize, st.headBox.height);
  // fHeadSize /= 24;

  //todo: could make some advanced generic typescript inferring. for example get type from headShape.elem:T and
  // tailShape.elem:K force the type for passProps,arrowHeadProps,arrowTailProps property. for now `as any` is used to
  // avoid typescript conflicts
  // so todo- fix all the `passProps as any` assertions

  return (
    <div {...divContainerProps} style={{ position: 'absolute', ...divContainerStyle }} {...extraProps}>
      {showXarrow ? (
        <>
          <svg
            ref={mainDivRef}
            width={st.cw}
            height={st.ch}
            style={{
              position: 'absolute',
              left: st.cx0,
              top: st.cy0,
              pointerEvents: 'none',
              border: _debug ? '1px dashed yellow' : null,
              ...SVGcanvasStyle,
              // overflow: "hidden",
            }}
            overflow="auto"
            {...SVGcanvasProps}>
            {/* body of the arrow */}
            <path
              ref={lineRef}
              d={arrowPath}
              stroke={lineColor}
              strokeDasharray={dashArray}
              // strokeDasharray={'0 0'}
              strokeWidth={strokeWidth}
              fill="transparent"
              pointerEvents="visibleStroke"
              {...(passProps as any)}
              {...arrowBodyProps}>
              <>
                {drawAnimEnded ? (
                  <>
                    {/* moving dashed line animation */}
                    {animDashSpeed ? (
                      <animate
                        ref={lineDashAnimRef}
                        attributeName="stroke-dashoffset"
                        values={`${dashoffset * animDirection};0`}
                        dur={`${1 / animDashSpeed}s`}
                        repeatCount="indefinite"
                      />
                    ) : null}
                  </>
                ) : (
                  <>
                    {/* the creation of the line animation */}
                    {animateDrawing ? (
                      <animate
                        ref={lineDrawAnimRef}
                        id={`svgEndAnimate`}
                        attributeName="stroke-dashoffset"
                        values={`${animStartValue};${animEndValue}`}
                        dur={animation}
                        repeatCount={animRepeatCount}
                      />
                    ) : null}
                  </>
                )}
              </>
            </path>
            {/* arrow tail */}
            {showTail ? (
              <tailShape.svgElem
                // d={normalArrowShape}
                fill={tailColor}
                pointerEvents="auto"
                transform={`translate(${xOffsetTail},${yOffsetTail}) rotate(${st.tailOrient}) scale(${fTailSize})`}
                // transform={`translate(${xOffsetTail},${yOffsetTail}) rotate(${st.tailOrient}) scale(${fTailSize})`}
                // transform={`translate(${xOffsetHead},${yOffsetHead}) rotate(${st.headOrient})`}
                {...tailShape.svgProps}
                {...(passProps as any)}
                {...arrowTailProps}
              />
            ) : null}

            {/* head of the arrow */}
            {showHead ? (
              <headShape.svgElem
                ref={headRef as any}
                // d={normalArrowShape}
                fill={headColor}
                pointerEvents="auto"
                transform={`translate(${xOffsetHead},${yOffsetHead}) rotate(${st.headOrient}) scale(${fHeadSize})`}
                opacity={animateDrawing && !drawAnimEnded ? 0 : 1}
                {...headShape.svgProps}
                {...(passProps as any)}
                {...arrowHeadProps}>
                <animate
                  ref={headOpacityAnimRef}
                  dur={'0.4'}
                  attributeName="opacity"
                  from="0"
                  to="1"
                  begin={`indefinite`}
                  repeatCount="0"
                  fill="freeze"
                />
                ) : null
              </headShape.svgElem>
            ) : null}
          </svg>

          {labelStart ? (
            <div
              style={{
                transform: st.dx < 0 ? 'translate(-100% , -50%)' : 'translate(-0% , -50%)',
                width: 'max-content',
                position: 'absolute',
                left: st.cx0 + st.labelStartPos.x,
                top: st.cy0 + st.labelStartPos.y - strokeWidth - 5,
              }}>
              {labelStart}
            </div>
          ) : null}
          {labelMiddle ? (
            <div
              style={{
                display: 'table',
                width: 'max-content',
                transform: 'translate(-50% , -50%)',
                position: 'absolute',
                left: st.cx0 + st.labelMiddlePos.x,
                top: st.cy0 + st.labelMiddlePos.y,
              }}>
              {labelMiddle}
            </div>
          ) : null}
          {labelEnd ? (
            <div
              style={{
                transform: st.dx > 0 ? 'translate(-100% , -50%)' : 'translate(-0% , -50%)',
                width: 'max-content',
                position: 'absolute',
                left: st.cx0 + st.labelEndPos.x,
                top: st.cy0 + st.labelEndPos.y + strokeWidth + 5,
              }}>
              {labelEnd}
            </div>
          ) : null}
          {_debug ? (
            <>
              {/* possible anchor connections */}
              {[...st.startPoints, ...st.endPoints].map((p, i) => {
                return (
                  <div
                    key={i}
                    style={{
                      background: 'gray',
                      opacity: 0.5,
                      borderRadius: '50%',
                      transform: 'translate(-50%, -50%)',
                      height: 5,
                      width: 5,
                      position: 'absolute',
                      left: p.x - st.mainDivPos.x,
                      top: p.y - st.mainDivPos.y,
                    }}
                  />
                );
              })}
            </>
          ) : null}
        </>
      ) : null}
    </div>
  );
};

Xarrow.defaultProps = {
  startAnchor: 'auto',
  endAnchor: 'auto',
  label: null,
  color: 'CornflowerBlue',
  lineColor: null,
  headColor: null,
  tailColor: null,
  strokeWidth: 4,
  showHead: true,
  headSize: 6,
  showTail: false,
  tailSize: 6,
  path: 'smooth',
  showXarrow: true,
  curveness: 0.8,
  dashness: false,
  headShape: 'arrow1',
  tailShape: 'arrow1',
  animateDrawing: false,
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

//////////////////////////////
// propTypes

const pAnchorPositionType = PT.oneOf(tAnchorEdge);

const pAnchorCustomPositionType = PT.exact({
  position: pAnchorPositionType.isRequired,
  offset: PT.exact({
    rightness: PT.number,
    bottomness: PT.number,
  }).isRequired,
});

const _pAnchorType = PT.oneOfType([pAnchorPositionType, pAnchorCustomPositionType]);

const pAnchorType = PT.oneOfType([_pAnchorType, PT.arrayOf(_pAnchorType)]);

const pRefType = PT.oneOfType([PT.string, PT.exact({ current: PT.instanceOf(Element) })]);

const _pLabelType = PT.oneOfType([PT.element, PT.string]);

const pLabelsType = PT.exact({
  start: _pLabelType,
  middle: _pLabelType,
  end: _pLabelType,
});

const pSvgEdgeShapeType = PT.oneOf(Object.keys(arrowShapes) as Array<keyof typeof arrowShapes>);
const pSvgElemType = PT.oneOf(tSvgElems);
const pSvgEdgeType = PT.oneOfType([
  pSvgEdgeShapeType,
  PT.exact({
    svgElem: pSvgElemType,
    svgProps: PT.any,
    offsetForward: PT.number,
  }).isRequired,
]);

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
  path: PT.oneOf(tPaths),
  showXarrow: PT.bool,
  curveness: PT.number,
  dashness: PT.oneOfType([PT.bool, PT.object]),
  headShape: pSvgEdgeType,
  tailShape: pSvgEdgeType,
  animateDrawing: PT.oneOfType([PT.bool, PT.number]),
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

export default Xarrow;
