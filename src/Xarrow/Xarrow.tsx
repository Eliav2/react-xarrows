import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { getShortestLine, getSvgPos } from '../utils';
import _ from 'lodash';
import PT from 'prop-types';
import { buzzierMinSols, bzFunction } from '../utils/buzzier';
import { calcAnchors } from './anchors';
import { arrowShapes, svgCustomEdgeType, tAnchorEdge, tPaths, tSvgElems, xarrowPropsType } from '../types';
import useXarrowProps from './useXarrowProps';
import { XarrowContext } from '../Xwrapper';

const Xarrow: React.FC<xarrowPropsType> = (props: xarrowPropsType) => {
  useContext(XarrowContext);
  const svgRef = useRef(null);
  const lineRef = useRef(null);
  const headRef = useRef(null);
  const tailRef = useRef(null);
  const lineDrawAnimRef = useRef(null);
  const lineDashAnimRef = useRef(null);
  const headOpacityAnimRef = useRef<SVGAnimationElement>(null);
  const [propsRefs, valVars] = useXarrowProps(props, { headRef, tailRef });

  // console.log('xarrow');

  let {
    start,
    end,
    startAnchor,
    endAnchor,
    label,
    color,
    lineColor,
    headColor,
    tailColor,
    strokeWidth,
    showHead,
    headSize,
    showTail,
    tailSize,
    path,
    curveness,
    gridBreak,
    dashness,
    headShape,
    tailShape,
    showXarrow,
    animateDrawing,
    zIndex,
    passProps,
    arrowBodyProps,
    arrowHeadProps,
    arrowTailProps,
    SVGcanvasProps,
    divContainerProps,
    divContainerStyle,
    SVGcanvasStyle,
    _extendSVGcanvas,
    _debug,
    _cpx1Offset,
    _cpy1Offset,
    _cpx2Offset,
    _cpy2Offset,
    shouldUpdatePosition,
  } = propsRefs;
  const { startPos, endPos } = valVars;

  animateDrawing = props.animateDrawing as number;
  const [drawAnimEnded, setDrawAnimEnded] = useState(!animateDrawing);

  const [render, setRender] = useState({});
  const forceRerender = () => setRender({});

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
    lineLength: 0,
    fHeadSize: 1,
    fTailSize: 1,
    arrowPath: ``,
    labelStartPos: { x: 0, y: 0 },
    labelMiddlePos: { x: 0, y: 0 },
    labelEndPos: { x: 0, y: 0 },
  });

  /**
   * The Main logic of path calculation for the arrow.
   * calculate new path, adjusting canvas, and set state based on given properties.
   * */
  const updatePosition = (): void => {
    let headOrient: number = 0;
    let tailOrient: number = 0;

    // convert startAnchor and endAnchor to list of objects represents allowed anchors.
    let startPoints = calcAnchors(startAnchor, startPos);
    let endPoints = calcAnchors(endAnchor, endPos);

    // choose the smallest path for 2 points from these possibilities.
    let { chosenStart, chosenEnd } = getShortestLine(startPoints, endPoints);

    let startAnchorPosition = chosenStart.anchor.position,
      endAnchorPosition = chosenEnd.anchor.position;
    let startPoint = _.pick(chosenStart, ['x', 'y']),
      endPoint = _.pick(chosenEnd, ['x', 'y']);

    headShape = headShape as svgCustomEdgeType;
    tailShape = tailShape as svgCustomEdgeType;

    let mainDivPos = getSvgPos(svgRef);
    let cx0 = Math.min(startPoint.x, endPoint.x) - mainDivPos.x;
    let cy0 = Math.min(startPoint.y, endPoint.y) - mainDivPos.y;
    let dx = endPoint.x - startPoint.x;
    let dy = endPoint.y - startPoint.y;
    let absDx = Math.abs(endPoint.x - startPoint.x);
    let absDy = Math.abs(endPoint.y - startPoint.y);
    let xSign = dx > 0 ? 1 : -1;
    let ySign = dy > 0 ? 1 : -1;
    let [headOffset, tailOffset] = [headShape.offsetForward, tailShape.offsetForward];
    let fHeadSize = headSize * strokeWidth; //factored head size
    let fTailSize = tailSize * strokeWidth; //factored head size

    // const { current: _headBox } = headBox;
    let xHeadOffset = 0;
    let yHeadOffset = 0;
    let xTailOffset = 0;
    let yTailOffset = 0;

    let _headOffset = fHeadSize * headOffset;
    let _tailOffset = fTailSize * tailOffset;

    let cu = Number(curveness);
    // gridRadius = Number(gridRadius);
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
          xHeadOffset += _headOffset * xSign;
          x2 -= fHeadSize * (1 - headOffset) * xSign; //same!
          yHeadOffset += (fHeadSize * xSign) / 2;
          if (endAnchorPosition === 'left') {
            headOrient = 0;
            if (xSign < 0) headOrient += 180;
          } else {
            headOrient = 180;
            if (xSign > 0) headOrient += 180;
          }
        } else if (['top', 'bottom'].includes(endAnchorPosition)) {
          xHeadOffset += (fHeadSize * -ySign) / 2;
          yHeadOffset += _headOffset * ySign;
          y2 -= fHeadSize * ySign - yHeadOffset;
          if (endAnchorPosition === 'top') {
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
      if (['left', 'right'].includes(startAnchorPosition)) {
        xTailOffset += _tailOffset * -xSign;
        x1 += fTailSize * xSign + xTailOffset;
        yTailOffset += -(fTailSize * xSign) / 2;
        if (startAnchorPosition === 'left') {
          tailOrient = 180;
          if (xSign < 0) tailOrient += 180;
        } else {
          tailOrient = 0;
          if (xSign > 0) tailOrient += 180;
        }
      } else if (['top', 'bottom'].includes(startAnchorPosition)) {
        yTailOffset += _tailOffset * -ySign;
        y1 += fTailSize * ySign + yTailOffset;
        xTailOffset += (fTailSize * ySign) / 2;
        if (startAnchorPosition === 'top') {
          tailOrient = 90;
          if (ySign > 0) tailOrient += 180;
        } else {
          tailOrient = 270;
          if (ySign < 0) tailOrient += 180;
        }
      }
    }

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
        },
        vv: () => {
          //vertical - from top to bottom or opposite
          cpy1 += absDy * cu * ySign;
          cpy2 -= absDy * cu * ySign;
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
          cpx1 += (absDx * gridBreak.relative + gridBreak.abs) * xSign;
          cpx2 -= (absDx * (1 - gridBreak.relative) - gridBreak.abs) * xSign;
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
          cpy1 += (absDy * gridBreak.relative + gridBreak.abs) * ySign;
          cpy2 -= (absDy * (1 - gridBreak.relative) - gridBreak.abs) * ySign;
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

    let arrowPath;
    if (path === 'grid') {
      // todo: support gridRadius
      //  arrowPath = `M ${x1} ${y1} L  ${cpx1 - 10} ${cpy1} a10,10 0 0 1 10,10
      // L ${cpx2} ${cpy2 - 10} a10,10 0 0 0 10,10 L  ${x2} ${y2}`;
      arrowPath = `M ${x1} ${y1} L  ${cpx1} ${cpy1} L ${cpx2} ${cpy2} ${x2} ${y2}`;
    } else if (path === 'smooth') arrowPath = `M ${x1} ${y1} C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${x2} ${y2}`;
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
      lineLength: lineRef.current.getTotalLength(),
      fHeadSize,
      fTailSize,
      arrowPath,
    });
  };

  if (shouldUpdatePosition.current) {
    // update position if one of the relevant props changed
    updatePosition();
    shouldUpdatePosition.current = false;
  }

  const xOffsetHead = st.x2 - st.arrowHeadOffset.x;
  const yOffsetHead = st.y2 - st.arrowHeadOffset.y;
  const xOffsetTail = st.x1 - st.arrowTailOffset.x;
  const yOffsetTail = st.y1 - st.arrowTailOffset.y;

  let dashoffset = dashness.strokeLen + dashness.nonStrokeLen;
  let animDirection = 1;
  if (dashness.animation < 0) {
    dashness.animation *= -1;
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
  } else {
    dashArray = `${dashness.strokeLen} ${dashness.nonStrokeLen}`;
    animation = `${1 / dashness.animation}s`;
    animStartValue = dashoffset * animDirection;
    animRepeatCount = 'indefinite';
    animEndValue = 0;
  }

  // handle draw animation
  useLayoutEffect(() => {
    if (lineRef.current) setSt((prevSt) => ({ ...prevSt, lineLength: lineRef.current?.getTotalLength() ?? 0 }));
  }, [lineRef.current]);

  // set all props on first render
  useEffect(() => {
    const monitorDOMchanges = () => {
      window.addEventListener('resize', forceRerender);

      const handleDrawAmimEnd = () => {
        setDrawAnimEnded(true);
        // @ts-ignore
        headOpacityAnimRef.current?.beginElement();
        lineDashAnimRef.current?.beginElement();
      };
      const handleDrawAmimBegin = () => (headRef.current.style.opacity = '0');
      if (lineDrawAnimRef.current && headRef.current) {
        lineDrawAnimRef.current.addEventListener('endEvent', handleDrawAmimEnd);
        lineDrawAnimRef.current.addEventListener('beginEvent', handleDrawAmimBegin);
      }
      return () => {
        window.removeEventListener('resize', forceRerender);
        if (lineDrawAnimRef.current) {
          lineDrawAnimRef.current.removeEventListener('endEvent', handleDrawAmimEnd);
          if (headRef.current) lineDrawAnimRef.current.removeEventListener('beginEvent', handleDrawAmimBegin);
        }
      };
    };

    const cleanMonitorDOMchanges = monitorDOMchanges();
    return () => {
      setDrawAnimEnded(false);
      cleanMonitorDOMchanges();
    };
  }, [showXarrow]);

  //todo: could make some advanced generic typescript inferring. for example get type from headShape.elem:T and
  // tailShape.elem:K force the type for passProps,arrowHeadProps,arrowTailProps property. for now `as any` is used to
  // avoid typescript conflicts
  // so todo- fix all the `passProps as any` assertions

  return (
    <div {...divContainerProps} style={{ position: 'absolute', zIndex, ...divContainerStyle }}>
      {showXarrow ? (
        <>
          <svg
            ref={svgRef}
            width={st.cw}
            height={st.ch}
            // width="100%"
            // height="100%"
            // preserveAspectRatio="none"
            // viewBox={'auto'}
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
              d={st.arrowPath}
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
                    {dashness.animation ? (
                      <animate
                        ref={lineDashAnimRef}
                        attributeName="stroke-dashoffset"
                        values={`${dashoffset * animDirection};0`}
                        dur={`${1 / dashness.animation}s`}
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
                transform={`translate(${xOffsetTail},${yOffsetTail}) rotate(${st.tailOrient}) scale(${st.fTailSize})`}
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
                transform={`translate(${xOffsetHead},${yOffsetHead}) rotate(${st.headOrient}) scale(${st.fHeadSize})`}
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
          </svg>

          {label.start ? (
            <div
              style={{
                transform: st.dx < 0 ? 'translate(-100% , -50%)' : 'translate(-0% , -50%)',
                width: 'max-content',
                position: 'absolute',
                left: st.cx0 + st.labelStartPos.x,
                top: st.cy0 + st.labelStartPos.y - strokeWidth - 5,
              }}>
              {label.start}
            </div>
          ) : null}
          {label.middle ? (
            <div
              style={{
                display: 'table',
                width: 'max-content',
                transform: 'translate(-50% , -50%)',
                position: 'absolute',
                left: st.cx0 + st.labelMiddlePos.x,
                top: st.cy0 + st.labelMiddlePos.y,
              }}>
              {label.middle}
            </div>
          ) : null}
          {label.end ? (
            <div
              style={{
                transform: st.dx > 0 ? 'translate(-100% , -50%)' : 'translate(-0% , -50%)',
                width: 'max-content',
                position: 'absolute',
                left: st.cx0 + st.labelEndPos.x,
                top: st.cy0 + st.labelEndPos.y + strokeWidth + 5,
              }}>
              {label.end}
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

//////////////////////////////
// propTypes

const pAnchorPositionType = PT.oneOf(tAnchorEdge);

const pAnchorCustomPositionType = PT.exact({
  position: pAnchorPositionType.isRequired,
  offset: PT.exact({
    x: PT.number,
    y: PT.number,
  }).isRequired,
});

const _pAnchorType = PT.oneOfType([pAnchorPositionType, pAnchorCustomPositionType]);

const pAnchorType = PT.oneOfType([_pAnchorType, PT.arrayOf(_pAnchorType)]);

const pRefType = PT.oneOfType([PT.string, PT.exact({ current: PT.any })]);

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
  gridBreak: PT.string,
  dashness: PT.oneOfType([PT.bool, PT.object]),
  headShape: pSvgEdgeType,
  tailShape: pSvgEdgeType,
  animateDrawing: PT.oneOfType([PT.bool, PT.number]),
  zIndex: PT.number,
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
