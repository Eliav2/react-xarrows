import { createFeature } from '../components/XarrowBuilder';
import React, { useRef } from 'react';
import { svgCustomEdgeType, svgEdgeType, svgElemStrType, svgElemType } from '../types';
import { arrowShapes, cArrowShapes } from '../constants';
import { PathProps } from './Path';
import { Dir, Line, Vector } from '../classes/classes';
import XEdge from '../components/XEdge';
import { AnchorsProps, AnchorsStateChange } from './Anchors';
import { CoreProps, CoreStateChange } from './Core';
import { Spread } from '../privateTypes';
import PT from 'prop-types';
import { anchorsInwardOffset } from '../utils/XarrowUtils';
import { useGetBBox } from '../components/NormalizedGSvg';

export interface EdgesProps {
  showHead?: boolean;
  headColor?: string;
  tailColor?: string;
  headSize?: number;
  showTail?: boolean;
  tailSize?: number;
  headShape?: svgEdgeType;
  tailShape?: svgEdgeType;
  headRotate?: number;
  tailRotate?: number;
  arrowHeadProps?: JSX.IntrinsicElements[svgElemStrType];
  arrowTailProps?: JSX.IntrinsicElements[svgElemStrType];
  normalizeSvg?: boolean;
}

export type EdgesStateChange = {
  headOffset: Vector;
  tailOffset: Vector;
};

const pSvgEdgeShapeType = PT.oneOf(Object.keys(arrowShapes) as Array<keyof typeof arrowShapes>);
const pSvgElemType = PT.any;
const pSvgEdgeType = PT.oneOfType([
  pSvgEdgeShapeType,
  PT.exact({
    svgElem: pSvgElemType,
    offsetForward: PT.number,
  }).isRequired,
]);

const Edges = createFeature<
  Spread<[EdgesProps, AnchorsProps, CoreProps, PathProps]>,
  CoreStateChange &
    AnchorsStateChange & {
      startOffset: Vector | undefined;
      endOffset: Vector | undefined;
      headEdgeRef: React.LegacyRef<SVGGElement>;
      tailEdgeRef: React.LegacyRef<SVGGElement>;
    },
  EdgesStateChange,
  {
    headShape: svgCustomEdgeType;
    tailShape: svgCustomEdgeType;
  }
>({
  propTypes: {
    showHead: PT.bool,
    headColor: PT.string,
    tailColor: PT.string,
    headSize: PT.number,
    showTail: PT.bool,
    tailSize: PT.number,
    headShape: pSvgEdgeType,
    tailShape: pSvgEdgeType,
    headRotate: PT.number,
    tailRotate: PT.number,
    arrowHeadProps: PT.object,
    arrowTailProps: PT.object,
    normalizeSvg: PT.bool,
  },
  defaultProps: { normalizeSvg: true, headShape: arrowShapes.arrow1, tailShape: arrowShapes.arrow1 },
  parseProps: {
    headShape: (headShape) => parseEdgeShape(headShape),
    tailShape: (tailShape) => parseEdgeShape(tailShape),
  },
  state: ({ state, props }) => {
    // console.log('Edges');

    let { posSt, chosenStart, chosenEnd, getPath } = state;

    // for 'middle' anchors
    let startDir = new Dir(anchorsInwardOffset[chosenStart.anchor.position]);
    let endDir = new Dir(anchorsInwardOffset[chosenEnd.anchor.position]);

    const ll = new Line(posSt.start, posSt.end);
    if (startDir.size() === 0)
      startDir = new Dir(ll.diff.abs().x > ll.diff.abs().y ? new Vector(ll.diff.x, 0) : new Vector(0, ll.diff.y));
    if (endDir.size() === 0)
      endDir = new Dir(
        ll.diff.abs().x > ll.diff.abs().y ? new Vector(ll.diff.x, 0) : new Vector(0, ll.diff.y)
      ).reverse();
    posSt.originalStart = new Vector(posSt.start);
    posSt.originalEnd = new Vector(posSt.end);

    posSt.start._chosenFaceDir = startDir.reverse();
    posSt.end._chosenFaceDir = endDir.reverse();

    state.headEdgeRef = useRef();
    let headBbox = useGetBBox(state.headEdgeRef, [props.headSize, props.showHead]);
    let headOffset = posSt.end._chosenFaceDir.mul((headBbox?.width ?? 0) * props.headShape.offsetForward);
    if (props.showHead) posSt.end = posSt.end.add(headOffset);

    state.tailEdgeRef = useRef();
    let tailBbox = useGetBBox(state.tailEdgeRef, [props.tailSize, props.showTail]);
    let tailOffset = posSt.start._chosenFaceDir.reverse().mul((tailBbox?.width ?? 0) * props.tailShape.offsetForward);
    if (props.showTail) posSt.start = posSt.start.sub(tailOffset);

    return { headOffset, tailOffset };
  },

  jsx: ({ state, props, nextJsx }) => {
    const { posSt } = state;
    const {
      showHead = true,
      showTail = false,
      color = 'cornflowerBlue',
      headColor = color,
      tailColor = color,
      headShape = arrowShapes.arrow1 as svgCustomEdgeType,
      tailShape = arrowShapes.arrow1 as svgCustomEdgeType,
      headSize = 40,
      tailSize = 40,
      headRotate = 0,
      tailRotate = 0,
      arrowHeadProps = {},
      arrowTailProps = {},
    } = props;
    return (
      <>
        {showHead && (
          <XEdge
            containerRef={state.headEdgeRef}
            show={showHead}
            state={state}
            pos={posSt.end.sub(state.headOffset)}
            size={headSize}
            svgElem={headShape}
            color={headColor}
            props={arrowHeadProps}
            rotate={headRotate}
            posSt={posSt}
            vName={'end'}
            deps={[headSize]}
          />
        )}
        {showTail && (
          <XEdge
            containerRef={state.tailEdgeRef}
            show={showTail}
            state={state}
            pos={posSt.start.add(state.tailOffset)}
            size={tailSize}
            svgElem={tailShape}
            color={tailColor}
            props={arrowTailProps}
            rotate={tailRotate}
            posSt={posSt}
            vName={'start'}
            deps={[tailSize]}
          />
        )}
        {nextJsx()}
      </>
    );
  },
});

const parseEdgeShape = (svgEdge: svgEdgeType): Required<svgCustomEdgeType> => {
  let parsedProp: Required<svgCustomEdgeType> = arrowShapes['arrow1'];
  if (React.isValidElement(svgEdge)) {
    parsedProp.svgElem = svgEdge as svgElemType;
  } else if (typeof svgEdge == 'string') {
    if (svgEdge in arrowShapes) parsedProp = arrowShapes[svgEdge];
    else {
      console.warn(
        `'${svgEdge}' is not supported arrow shape. the supported arrow shapes is one of ${cArrowShapes}.
           reverting to default shape.`
      );
      parsedProp = arrowShapes['arrow1'];
    }
  } else {
    parsedProp = svgEdge as Required<svgCustomEdgeType>;
    if (parsedProp?.offsetForward === undefined) parsedProp.offsetForward = 0.5;
    if (parsedProp?.svgElem === undefined) parsedProp.svgElem = arrowShapes['arrow1'].svgElem;
  }
  return parsedProp;
};
export default Edges;
