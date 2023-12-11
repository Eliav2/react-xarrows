import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { xarrowPropsType } from '../types';
import useXarrowProps from './useXarrowProps';
import { XarrowContext } from '../Xwrapper';
import XarrowPropTypes from './propTypes';
import { getPosition } from './utils/GetPosition';

const log = console.log;

const Xarrow: React.FC<xarrowPropsType> = (props: xarrowPropsType) => {
  // log('xarrow update');

  const mainRef = useRef({
    svgRef: useRef<SVGSVGElement>(null),
    lineRef: useRef<SVGPathElement>(null),
    headRef: useRef<SVGElement>(null),
    tailRef: useRef<SVGElement>(null),
    lineDrawAnimRef: useRef<SVGElement>(null),
    lineDashAnimRef: useRef<SVGElement>(null),
    headOpacityAnimRef: useRef<SVGElement>(null),
  });
  const { svgRef, lineRef, headRef, tailRef, lineDrawAnimRef, lineDashAnimRef, headOpacityAnimRef } = mainRef.current;
  useContext(XarrowContext);
  const xProps = useXarrowProps(props, mainRef.current);
  const [propsRefs] = xProps;

  let {
    labels,
    lineColor,
    headColor,
    tailColor,
    strokeWidth,
    showHead,
    showTail,
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
    _debug,
    shouldUpdatePosition,
    SVGbodyExtension,
  } = propsRefs;

  animateDrawing = props.animateDrawing as number;
  const [drawAnimEnded, setDrawAnimEnded] = useState(!animateDrawing);

  const [, setRender] = useState({});
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
  useLayoutEffect(() => {
    if (shouldUpdatePosition.current) {
      // log('xarrow getPosition');
      const pos = getPosition(xProps, mainRef);
      // log('pos', pos);
      setSt(pos);
      shouldUpdatePosition.current = false;
    }
  });

  // log('st', st);

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
        // @ts-ignore
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
            style={{
              position: 'absolute',
              left: st.cx0,
              top: st.cy0,
              pointerEvents: 'none',
              border: _debug ? '1px dashed yellow' : null,
              ...SVGcanvasStyle,
            }}
            overflow="auto"
            {...SVGcanvasProps}>
            {SVGbodyExtension}
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
              <g
                fill={tailColor}
                pointerEvents="auto"
                transform={`translate(${xOffsetTail},${yOffsetTail}) rotate(${st.tailOrient}) scale(${st.fTailSize})`}
                {...(passProps as any)}
                {...arrowTailProps}>
                {tailShape.svgElem}
              </g>
            ) : null}

            {/* head of the arrow */}
            {showHead ? (
              <g
                ref={headRef as any}
                // d={normalArrowShape}
                fill={headColor}
                pointerEvents="auto"
                transform={`translate(${xOffsetHead},${yOffsetHead}) rotate(${st.headOrient}) scale(${st.fHeadSize})`}
                opacity={animateDrawing && !drawAnimEnded ? 0 : 1}
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

                {headShape.svgElem}
              </g>
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

          {labels.start ? (
            <div
              style={{
                transform: st.dx < 0 ? 'translate(-100% , -50%)' : 'translate(-0% , -50%)',
                width: 'max-content',
                position: 'absolute',
                left: st.cx0 + st.labelStartPos.x,
                top: st.cy0 + st.labelStartPos.y - strokeWidth - 5,
              }}>
              {labels.start}
            </div>
          ) : null}
          {labels.middle ? (
            <div
              style={{
                display: 'table',
                width: 'max-content',
                transform: 'translate(-50% , -50%)',
                position: 'absolute',
                left: st.cx0 + st.labelMiddlePos.x,
                top: st.cy0 + st.labelMiddlePos.y,
              }}>
              {labels.middle}
            </div>
          ) : null}
          {labels.end ? (
            <div
              style={{
                transform: st.dx > 0 ? 'translate(-100% , -50%)' : 'translate(-0% , -50%)',
                width: 'max-content',
                position: 'absolute',
                left: st.cx0 + st.labelEndPos.x,
                top: st.cy0 + st.labelEndPos.y + strokeWidth + 5,
              }}>
              {labels.end}
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

Xarrow.propTypes = XarrowPropTypes;

export default Xarrow;
