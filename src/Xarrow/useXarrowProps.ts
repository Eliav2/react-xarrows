import React, { useLayoutEffect, useRef, useState } from 'react';
import {
  anchorCustomPositionType,
  anchorType,
  labelsType,
  pathType,
  svgCustomEdgeType,
  svgEdgeShapeType,
  svgElemPropsType,
  xarrowPropsType,
} from '../types';
import { getElementByPropGiven, getElemPos, xStr2absRelative } from './utils';
import { arrowShapes, cAnchorEdge, cArrowShapes } from '../constants';
import {
  anchorEdgeType,
  dimensionType,
  parsedAnchorType,
  parsedEdgeShapeType,
  parsedLabelsType,
} from '../privateTypes';

const parseLabels = (label: xarrowPropsType['labels']): parsedLabelsType => {
  const parsedLabel: parsedLabelsType = { start: null, middle: null, end: null };
  if (label) {
    // isValidElement is not a narrowing guard for this union, so the else
    // branch still looks like it could hold a JSX element without the cast.
    if (typeof label === 'string' || React.isValidElement(label)) parsedLabel.middle = label;
    else {
      const labels = label as labelsType;
      // Left as for..in rather than Object.keys: for..in also walks the
      // prototype chain, and swapping it would quietly stop honouring a labels
      // object that inherits its keys.
      for (const key in labels) {
        parsedLabel[key as keyof labelsType] = labels[key as keyof labelsType] ?? null;
      }
    }
  }
  return parsedLabel;
};

const parseAnchor = (anchor: anchorType) => {
  // convert to array
  const anchorChoice = Array.isArray(anchor) ? anchor : [anchor];

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
  const autosAncs = anchorChoice2.filter((an) => an.position === 'auto');
  if (autosAncs.length > 0) {
    anchorChoice2 = anchorChoice2.filter((an) => an.position !== 'auto');
    anchorChoice2.push(
      ...autosAncs.flatMap((anchorObj) => {
        return (['left', 'right', 'top', 'bottom'] as anchorEdgeType[]).map((anchorName) => {
          return { ...anchorObj, position: anchorName };
        });
      }),
    );
  }

  // default values
  const anchorChoice3 = anchorChoice2.map((anchorChoice) => {
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

  return anchorChoice3 as parsedAnchorType[];
};

const parseDashness = (dashness: xarrowPropsType['dashness'], props: { strokeWidth: number }) => {
  let dashStroke = 0,
    dashNone = 0,
    animDashSpeed: number | null = null;
  const animDirection = 1;
  if (typeof dashness === 'object') {
    dashStroke = dashness.strokeLen || props.strokeWidth * 2;
    // nonStrokeLen is optional, and used to be passed straight through when
    // strokeLen was given, rendering a stroke-dasharray of "<n> undefined".
    // Only that fallback is new: `??` keeps an explicit 0, and the outer
    // condition is left as it was so that no other input changes meaning.
    dashNone = dashness.strokeLen ? (dashness.nonStrokeLen ?? props.strokeWidth) : props.strokeWidth;
    // `animation: true` means the documented default of 1s. It used to fall
    // through as a boolean and only worked because `1 / true` is 1.
    animDashSpeed = dashness.animation === true ? 1 : dashness.animation || null;
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

const parseEdgeShape = (svgEdge: svgEdgeShapeType | svgCustomEdgeType): parsedEdgeShapeType => {
  let shape: Partial<svgCustomEdgeType> | undefined;
  if (typeof svgEdge == 'string') {
    if (svgEdge in arrowShapes) shape = arrowShapes[svgEdge as svgEdgeShapeType];
    else {
      console.warn(
        `'${svgEdge}' is not supported arrow shape. the supported arrow shapes is one of ${cArrowShapes}.
           reverting to default shape.`,
      );
      shape = arrowShapes['arrow1'];
    }
  } else shape = svgEdge;

  // Returns a new object rather than filling in the one it was handed. For a
  // shape name that object is the shared arrowShapes constant, and for a custom
  // shape it is the caller's own, so the old in-place defaulting wrote into
  // whichever of the two it happened to get.
  //
  // Both fields keep the `=== undefined` test the in-place version used, rather
  // than `??`, so that an explicitly passed null still means what it used to.
  // Only the svgElem fallback value changes: it was the bare string 'path',
  // which React renders as the literal text "path" rather than an element.
  return {
    svgElem: shape?.svgElem === undefined ? arrowShapes.arrow1.svgElem : shape.svgElem,
    offsetForward: shape?.offsetForward === undefined ? 0.25 : shape.offsetForward,
  };
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
const withUpdate = <T>(propVal: T, updateRef?: updatePosRef): T => {
  if (updateRef) updateRef.current = true;
  return propVal;
};

const noParse = <T>(userProp: T): T => userProp;
const noParseWithUpdatePos = <T>(userProp: T, _: unknown, updatePos?: updatePosRef): T =>
  withUpdate(userProp, updatePos);
const parseNumWithUpdatePos = (userProp: unknown, _: unknown, updatePos?: updatePosRef): number =>
  withUpdate(Number(userProp), updatePos);
const parseNum = (userProp: unknown): number => Number(userProp);

type updatePosRef = React.MutableRefObject<boolean>;

// Still `any` in and out. Making this generic over the prop name is what ties
// xarrowPropsType[K] to parsedXarrowProps[K], and it is a large enough change
// to want its own pass.
type ParsePropFunc = (userProp: any, prevProp?: any, updatePos?: updatePosRef) => any;

const parsePropsFuncs: Required<{ [key in keyof xarrowPropsType]: ParsePropFunc }> = {
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
  // Resolved against strokeWidth in getPosition rather than here, so that this
  // parser does not depend on strokeWidth having been parsed first.
  gridRadius: noParseWithUpdatePos,
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

type propName = keyof xarrowPropsType;

//build dependencies
const propsDeps = {} as Record<propName, propName[]>;
//each prop depends on himself
for (const propName of Object.keys(parsePropsFuncs) as propName[]) {
  propsDeps[propName] = [propName];
}
// 'lineColor', 'headColor', 'tailColor' props also depends on 'color' prop
for (const propName of ['lineColor', 'headColor', 'tailColor'] as const) {
  propsDeps[propName].push('color');
}

// Only ever called with the defaults table, which carries nulls where a prop
// has no default.
const parseGivenProps = (props: defaultPropsType, propsRef: parsedXarrowProps) => {
  for (const name of Object.keys(props) as propName[]) {
    // Correlating the parser's return type with propsRef[name] needs the
    // generic ParsePropFunc above; until then this write is unchecked.
    (propsRef as Record<string, unknown>)[name] = parsePropsFuncs?.[name]?.(props[name], propsRef);
  }
  return propsRef;
};

/**
 * Every prop's default. null means "no default": start and end are required of
 * the user, and labels are absent until given. Declaring this as
 * Required<xarrowPropsType> claimed those three were always present.
 */
type defaultPropsType = { [K in keyof Required<xarrowPropsType>]: Required<xarrowPropsType>[K] | null };

const defaultProps: defaultPropsType = {
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
  gridRadius: false,
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
  start: Element | null;
  end: Element | null;
  startAnchor: parsedAnchorType[];
  endAnchor: parsedAnchorType[];
  labels: parsedLabelsType;
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
  gridRadius: boolean | number;
  dashness: {
    strokeLen: number;
    nonStrokeLen: number;
    animation: number;
  };
  headShape: parsedEdgeShapeType;
  tailShape: parsedEdgeShapeType;
  animateDrawing: number;
  zIndex: number;
  passProps: svgElemPropsType;
  SVGcanvasProps: React.SVGAttributes<SVGSVGElement>;
  arrowBodyProps: React.SVGProps<SVGPathElement>;
  arrowHeadProps: svgElemPropsType;
  arrowTailProps: svgElemPropsType;
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

// The only values ever compared here are element positions, which getElemPos
// always returns as four numbers, including on its null-element branch. A
// general deep-equality helper (this used to be lodash isEqual) is more than
// this needs, and would also have to be careful around the refs and React
// elements that appear elsewhere in the props.
const samePosition = (a: dimensionType | undefined, b: dimensionType | undefined) => {
  if (a === b) return true;
  if (!a || !b) return false;
  return a.x === b.x && a.y === b.y && a.right === b.right && a.bottom === b.bottom;
};

function usePositionMemoize(value: dimensionType) {
  const ref = useRef<dimensionType>();

  if (!samePosition(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
}

function usePositionEffect(callback: () => void, dependencies: dimensionType[]) {
  useLayoutEffect(callback, dependencies.map(usePositionMemoize));
}

/**
 * smart hook that provides parsed props to Xarrow and will trigger rerender whenever given prop is changed.
 */
const useXarrowProps = (
  userProps: xarrowPropsType,
  refs: { headRef: React.MutableRefObject<any>; tailRef: React.MutableRefObject<any> },
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
  for (const propName of Object.keys(defaultProps) as propName[]) {
    useLayoutEffect(
      () => {
        // Same unchecked write as parseGivenProps - see the note there.
        (propsRefs as Record<string, unknown>)[propName] = parsePropsFuncs?.[propName]?.(
          curProps[propName],
          propsRefs,
          shouldUpdatePosition,
        );
        // console.log('prop update:', propName, 'with value', propsRefs[propName]);
        setPropsRefs({ ...propsRefs });
      },
      propsDeps[propName].map((name) => userProps[name]),
    );
  }

  // rerender whenever position of start element or end element changes
  const [valVars, setValVars] = useState(initialValVars);
  const startPos = getElemPos(propsRefs.start);
  usePositionEffect(() => {
    valVars.startPos = startPos;
    shouldUpdatePosition.current = true;
    setValVars({ ...valVars });
    // console.log('start update pos', startPos);
  }, [startPos]);
  const endPos = getElemPos(propsRefs.end);
  usePositionEffect(() => {
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
