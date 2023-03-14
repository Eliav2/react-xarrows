import React, { useLayoutEffect, useRef, useState } from 'react';
import {
  anchorCustomPositionType,
  anchorType,
  labelsType,
  pathType,
  svgCustomEdgeType,
  svgEdgeShapeType,
  svgElemType,
  xarrowPropsType,
} from '../types';
import { getElementByPropGiven, getElemPos, xStr2absRelative } from './utils';
import isEqual from 'lodash/isEqual';
import { arrowShapes, cAnchorEdge, cArrowShapes } from '../constants';
import { anchorEdgeType, dimensionType } from '../privateTypes';

const parseLabels = (label: xarrowPropsType['labels']): labelsType => {
  let parsedLabel = { start: null, middle: null, end: null };
  if (label) {
    if (typeof label === 'string' || React.isValidElement(label)) parsedLabel.middle = label;
    else {
      for (let key in label) {
        parsedLabel[key] = label[key];
      }
    }
  }
  return parsedLabel;
};

// remove 'auto' as possible anchor from anchorCustomPositionType.position
interface anchorCustomPositionType2 extends Omit<Required<anchorCustomPositionType>, 'position'> {
  position: Exclude<typeof cAnchorEdge[number], 'auto'>;
}

const parseAnchor = (anchor: anchorType) => {
  // convert to array
  let anchorChoice = Array.isArray(anchor) ? anchor : [anchor];

  //convert to array of objects
  let anchorChoice2 = anchorChoice.map((anchorChoice) => {
    if (typeof anchorChoice === 'string') {
      return { position: anchorChoice };
    } else return anchorChoice;
  });

  //remove any invalid anchor names
  anchorChoice2 = anchorChoice2.filter((an) => cAnchorEdge.includes(an.position));
  if (anchorChoice2.length == 0) anchorChoice2 = [{ position: 'auto' }];

  //replace any 'auto' with ['left','right','bottom','top']
  let autosAncs = anchorChoice2.filter((an) => an.position === 'auto');
  if (autosAncs.length > 0) {
    anchorChoice2 = anchorChoice2.filter((an) => an.position !== 'auto');
    anchorChoice2.push(
      ...autosAncs.flatMap((anchorObj) => {
        return (['left', 'right', 'top', 'bottom'] as anchorEdgeType[]).map((anchorName) => {
          return { ...anchorObj, position: anchorName };
        });
      })
    );
  }

  // default values
  let anchorChoice3 = anchorChoice2.map((anchorChoice) => {
    if (typeof anchorChoice === 'object') {
      let anchorChoiceCustom = anchorChoice as anchorCustomPositionType;
      if (!anchorChoiceCustom.position) anchorChoiceCustom.position = 'auto';
      if (!anchorChoiceCustom.offset) anchorChoiceCustom.offset = { x: 0, y: 0 };
      if (!anchorChoiceCustom.offset.y) anchorChoiceCustom.offset.y = 0;
      if (!anchorChoiceCustom.offset.x) anchorChoiceCustom.offset.x = 0;
      anchorChoiceCustom = anchorChoiceCustom as Required<anchorCustomPositionType>;
      return anchorChoiceCustom;
    } else return anchorChoice;
  }) as Required<anchorCustomPositionType>[];

  return anchorChoice3 as anchorCustomPositionType2[];
};

const parseDashness = (dashness, props) => {
  let dashStroke = 0,
    dashNone = 0,
    animDashSpeed,
    animDirection = 1;
  if (typeof dashness === 'object') {
    dashStroke = dashness.strokeLen || props.strokeWidth * 2;
    dashNone = dashness.strokeLen ? dashness.nonStrokeLen : props.strokeWidth;
    animDashSpeed = dashness.animation ? dashness.animation : null;
  } else if (typeof dashness === 'boolean' && dashness) {
    dashStroke = props.strokeWidth * 2;
    dashNone = props.strokeWidth;
    animDashSpeed = null;
  }
  return { strokeLen: dashStroke, nonStrokeLen: dashNone, animation: animDashSpeed, animDirection } as {
    strokeLen: number;
    nonStrokeLen: number;
    animation: number;
  };
};

const parseEdgeShape = (svgEdge): svgCustomEdgeType => {
  if (typeof svgEdge == 'string') {
    if (svgEdge in arrowShapes) svgEdge = arrowShapes[svgEdge as svgEdgeShapeType];
    else {
      console.warn(
        `'${svgEdge}' is not supported arrow shape. the supported arrow shapes is one of ${cArrowShapes}.
           reverting to default shape.`
      );
      svgEdge = arrowShapes['arrow1'];
    }
  }
  svgEdge = svgEdge as svgCustomEdgeType;
  if (svgEdge?.offsetForward === undefined) svgEdge.offsetForward = 0.25;
  if (svgEdge?.svgElem === undefined) svgEdge.svgElem = 'path';
  // if (svgEdge?.svgProps === undefined) svgEdge.svgProps = arrowShapes.arrow1.svgProps;
  return svgEdge;
};

const parseGridBreak = (gridBreak: string): { relative: number; abs: number } => {
  let resGridBreak = xStr2absRelative(gridBreak);
  if (!resGridBreak) resGridBreak = { relative: 0.5, abs: 0 };
  return resGridBreak;
};

/**
 * should be wrapped with any changed prop that is affecting the points path positioning
 * @param propVal
 * @param updateRef
 */
const withUpdate = (propVal, updateRef) => {
  if (updateRef) updateRef.current = true;
  return propVal;
};

const noParse = (userProp) => userProp;
const noParseWithUpdatePos = (userProp, _, updatePos) => withUpdate(userProp, updatePos);
const parseNumWithUpdatePos = (userProp, _, updatePos) => withUpdate(Number(userProp), updatePos);
const parseNum = (userProp) => Number(userProp);

const parsePropsFuncs: Required<{ [key in keyof xarrowPropsType]: Function }> = {
  start: (userProp) => getElementByPropGiven(userProp),
  end: (userProp) => getElementByPropGiven(userProp),
  startAnchor: (userProp, _, updatePos) => withUpdate(parseAnchor(userProp), updatePos),
  endAnchor: (userProp, _, updatePos) => withUpdate(parseAnchor(userProp), updatePos),
  labels: (userProp) => parseLabels(userProp),
  color: noParse,
  lineColor: (userProp, propsRefs) => userProp || propsRefs.color,
  headColor: (userProp, propsRefs) => userProp || propsRefs.color,
  tailColor: (userProp, propsRefs) => userProp || propsRefs.color,
  strokeWidth: parseNumWithUpdatePos,
  showHead: noParseWithUpdatePos,
  headSize: parseNumWithUpdatePos,
  showTail: noParseWithUpdatePos,
  tailSize: parseNumWithUpdatePos,
  path: noParseWithUpdatePos,
  curveness: parseNumWithUpdatePos,
  gridBreak: (userProp, _, updatePos) => withUpdate(parseGridBreak(userProp), updatePos),
  // // gridRadius = strokeWidth * 2, //todo
  dashness: (userProp, propsRefs) => parseDashness(userProp, propsRefs),
  headShape: (userProp) => parseEdgeShape(userProp),
  tailShape: (userProp) => parseEdgeShape(userProp),
  showXarrow: noParse,
  animateDrawing: noParse,
  zIndex: parseNum,
  passProps: noParse,
  arrowBodyProps: noParseWithUpdatePos,
  arrowHeadProps: noParseWithUpdatePos,
  arrowTailProps: noParseWithUpdatePos,
  SVGcanvasProps: noParseWithUpdatePos,
  divContainerProps: noParseWithUpdatePos,
  divContainerStyle: noParseWithUpdatePos,
  SVGcanvasStyle: noParseWithUpdatePos,
  _extendSVGcanvas: noParseWithUpdatePos,
  _debug: noParseWithUpdatePos,
  _cpx1Offset: noParseWithUpdatePos,
  _cpy1Offset: noParseWithUpdatePos,
  _cpx2Offset: noParseWithUpdatePos,
  _cpy2Offset: noParseWithUpdatePos,
};

//build dependencies
const propsDeps = {};
//each prop depends on himself
for (let propName in parsePropsFuncs) {
  propsDeps[propName] = [propName];
}
// 'lineColor', 'headColor', 'tailColor' props also depends on 'color' prop
for (let propName of ['lineColor', 'headColor', 'tailColor']) {
  propsDeps[propName].push('color');
}

const parseGivenProps = (props: xarrowPropsType, propsRef) => {
  for (let [name, val] of Object.entries(props)) {
    propsRef[name] = parsePropsFuncs?.[name]?.(val, propsRef);
  }
  return propsRef;
};

const defaultProps: Required<xarrowPropsType> = {
  start: null,
  end: null,
  startAnchor: 'auto',
  endAnchor: 'auto',
  labels: null,
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
  curveness: 0.8,
  gridBreak: '50%',
  // gridRadius : strokeWidth * 2, //todo
  dashness: false,
  headShape: 'arrow1',
  tailShape: 'arrow1',
  showXarrow: true,
  animateDrawing: false,
  zIndex: 0,
  passProps: {},
  arrowBodyProps: {},
  arrowHeadProps: {},
  arrowTailProps: {},
  SVGcanvasProps: {},
  divContainerProps: {},
  divContainerStyle: {},
  SVGcanvasStyle: {},
  _extendSVGcanvas: 0,
  _debug: false,
  _cpx1Offset: 0,
  _cpy1Offset: 0,
  _cpx2Offset: 0,
  _cpy2Offset: 0,
} as const;

type parsedXarrowProps = {
  shouldUpdatePosition: React.MutableRefObject<boolean>;
  start: HTMLElement;
  end: HTMLElement;
  startAnchor: anchorCustomPositionType[];
  endAnchor: anchorCustomPositionType[];
  labels: Required<labelsType>;
  color: string;
  lineColor: string;
  headColor: string;
  tailColor: string;
  strokeWidth: number;
  showHead: boolean;
  headSize: number;
  showTail: boolean;
  tailSize: number;
  path: pathType;
  showXarrow: boolean;
  curveness: number;
  gridBreak: { relative: number; abs: number };
  // gridRadius: number;
  dashness: {
    strokeLen: number;
    nonStrokeLen: number;
    animation: number;
  };
  headShape: svgCustomEdgeType;
  tailShape: svgCustomEdgeType;
  animateDrawing: number;
  zIndex: number;
  passProps: JSX.IntrinsicElements[svgElemType];
  SVGcanvasProps: React.SVGAttributes<SVGSVGElement>;
  arrowBodyProps: React.SVGProps<SVGPathElement>;
  arrowHeadProps: JSX.IntrinsicElements[svgElemType];
  arrowTailProps: JSX.IntrinsicElements[svgElemType];
  divContainerProps: React.HTMLProps<HTMLDivElement>;
  SVGcanvasStyle: React.CSSProperties;
  divContainerStyle: React.CSSProperties;
  _extendSVGcanvas: number;
  _debug: boolean;
  _cpx1Offset: number;
  _cpy1Offset: number;
  _cpx2Offset: number;
  _cpy2Offset: number;
};

let initialParsedProps = {} as parsedXarrowProps;
initialParsedProps = parseGivenProps(defaultProps, initialParsedProps);

const initialValVars = {
  startPos: { x: 0, y: 0, right: 0, bottom: 0 } as dimensionType,
  endPos: { x: 0, y: 0, right: 0, bottom: 0 } as dimensionType,
};

// const parseAllProps = () => parseGivenProps(defaultProps, initialParsedProps);

function deepCompareEquals(a, b) {
  return isEqual(a, b);
}

function useDeepCompareMemoize(value) {
  const ref = useRef();
  // it can be done by using useMemo as well
  // but useRef is rather cleaner and easier

  if (!deepCompareEquals(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
}

function useDeepCompareEffect(callback, dependencies) {
  useLayoutEffect(callback, dependencies.map(useDeepCompareMemoize));
}

/**
 * smart hook that provides parsed props to Xarrow and will trigger rerender whenever given prop is changed.
 */
const useXarrowProps = (
  userProps: xarrowPropsType,
  refs: { headRef: React.MutableRefObject<any>; tailRef: React.MutableRefObject<any> }
) => {
  const [propsRefs, setPropsRefs] = useState(initialParsedProps);
  const shouldUpdatePosition = useRef(false);
  // const _propsRefs = useRef(initialParsedProps);
  // const propsRefs = _propsRefs.current;
  propsRefs['shouldUpdatePosition'] = shouldUpdatePosition;
  const curProps = { ...defaultProps, ...userProps };

  // react states the number of hooks per render must stay constant,
  // this is ok we are using these hooks in a loop, because the number of props in defaultProps is constant,
  // so the number of hook we will fire each render will always be the same.

  // update the value of the ref that represents the corresponding prop
  // for example: if given 'start' prop would change call getElementByPropGiven(props.start) and save value into propsRefs.start.current
  // why to save refs to props parsed values? some of the props require relatively expensive computations(like 'start' and 'startAnchor').
  // this will always run in the same order and THAT'S WAY ITS LEGAL
  for (let propName in defaultProps) {
    useLayoutEffect(
      () => {
        propsRefs[propName] = parsePropsFuncs?.[propName]?.(curProps[propName], propsRefs, shouldUpdatePosition);
        // console.log('prop update:', propName, 'with value', propsRefs[propName]);
        setPropsRefs({ ...propsRefs });
      },
      propsDeps[propName].map((name) => userProps[name])
    );
  }

  // rerender whenever position of start element or end element changes
  const [valVars, setValVars] = useState(initialValVars);
  const startPos = getElemPos(propsRefs.start);
  useDeepCompareEffect(() => {
    valVars.startPos = startPos;
    shouldUpdatePosition.current = true;
    setValVars({ ...valVars });
    // console.log('start update pos', startPos);
  }, [startPos]);
  const endPos = getElemPos(propsRefs.end);
  useDeepCompareEffect(() => {
    valVars.endPos = endPos;
    shouldUpdatePosition.current = true;
    setValVars({ ...valVars });
    // console.log('end update pos', endPos);
  }, [endPos]);

  useLayoutEffect(() => {
    // console.log('svg shape changed!');
    shouldUpdatePosition.current = true;
    setValVars({ ...valVars });
  }, [propsRefs.headShape.svgElem, propsRefs.tailShape.svgElem]);

  return [propsRefs, valVars] as const;
};

export type useXarrowPropsResType = ReturnType<typeof useXarrowProps>;
export default useXarrowProps;
