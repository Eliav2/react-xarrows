import { createFeature, XarrowFeature } from '../components/XarrowBuilder';
import React, { useRef } from 'react';
import { svgCustomEdgeType, svgEdgeType, svgElemStrType, svgElemType } from '../types';
import { arrowShapes, cArrowShapes } from '../constants';
import { useRerender } from '../hooks/HooksUtils';
import { PathProps, PathStateChange } from './Path';
import { Dir, Line, Vector } from '../classes/classes';
import XEdge from '../components/XEdge';
import NormalizedGSvg, { useGetBBox } from '../components/NormalizedGSvg';
import { anchorsInwardOffset, AnchorsProps, AnchorsStateChange } from './Anchors';
import { CoreProps, CoreStateChange, posStType } from './Core';
import { Merge, PlainObject, Spread } from '../privateTypes';
import * as Path from 'path';

export interface EdgesProps {
  showHead?: boolean;
  color?: string;
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

type GetJsx = null | ((p: Vector) => JSX.Element);

type tRet = { headEdgeJsx: (endVector: Vector) => JSX.Element; tailEdgeJsx: (startVector: Vector) => JSX.Element };

const Edges = createFeature<
  Spread<[EdgesProps, AnchorsProps, CoreProps, PathProps]>,
  CoreStateChange & AnchorsStateChange,
  tRet
>({
  propTypes: {},
  defaultProps: { normalizeSvg: true },
  state: ({ state, props }) => {
    // console.log('Edges');
    const {
      showHead = true,
      showTail = false,
      color = 'cornflowerBlue',
      headColor = color,
      tailColor = color,
      headShape = arrowShapes.arrow1,
      tailShape = arrowShapes.arrow1,
      headSize = 40,
      tailSize = 40,
      headRotate = 0,
      tailRotate = 0,
      arrowHeadProps = {},
      arrowTailProps = {},
    } = props;

    const reRender = useRerender();
    let parsedHeadShape = parseEdgeShape(headShape);
    let parsedTailShape = parseEdgeShape(tailShape);
    // let getPathState = state.getPath();
    let pos = state.posSt;

    const extendSt: PlainObject = {};

    // // tail logic
    // /////////////
    // if (showTail) {
    //   let tailEdgeJsx: GetJsx | null;
    //   const startEdgeRef = useRef();
    //   const NormShape = props.normalizeSvg ? NormalizedGSvg : React.Fragment;
    //   const normedTailShape = <NormShape>{parsedTailShape.svgElem}</NormShape>;
    //   let tailEdgeBbox = useGetBBox(startEdgeRef, normedTailShape);
    //   let tailDir = new Dir(anchorsInwardOffset[state.chosenStart.anchor.position]);
    //   let tailOffset = tailDir.reverse().mul((tailEdgeBbox?.width ?? 0) * parsedTailShape.offsetForward);
    //   pos.start = pos.start.add(tailOffset);
    //   tailEdgeJsx = (p: Vector) => (
    //     <XEdge
    //       pos={{ x: p.x - tailOffset.x, y: p.y - tailOffset.y }}
    //       dir={tailDir.reverse()}
    //       size={tailSize}
    //       containerRef={startEdgeRef}
    //       svgElem={parsedTailShape.svgElem}
    //       color={tailColor}
    //       props={arrowTailProps}
    //       rotate={tailRotate}
    //     />
    //   );
    //   extendSt.tailEdgeJsx = tailEdgeJsx;
    // }

    // head logic
    /////////////
    extendSt.headEdgeJsx = prepareEdgeJsx(
      props,
      state,
      pos,
      'end',
      parsedHeadShape,
      showHead,
      headSize,
      headColor,
      arrowHeadProps,
      headRotate,
      new Dir(anchorsInwardOffset[state.chosenEnd.anchor.position]),
      [props.headSize]
    );
    extendSt.tailEdgeJsx = prepareEdgeJsx(
      props,
      state,
      pos,
      'start',
      parsedTailShape,
      showTail,
      tailSize,
      tailColor,
      arrowTailProps,
      headRotate,
      new Dir(anchorsInwardOffset[state.chosenStart.anchor.position]),
      [props.tailSize]
    );

    // head logic
    /////////////
    // const NormShape = props.normalizeSvg ? NormalizedGSvg : React.Fragment;
    // const normedHeadShape = <NormShape>{parsedHeadShape.svgElem}</NormShape>;
    // const endEdgeRef = useRef();
    // let headEdgeBbox = useGetBBox(endEdgeRef, normedHeadShape);
    // if (showHead) {
    //   let headEdgeJsx: GetJsx | null;
    //   let headDir = new Dir(anchorsInwardOffset[state.chosenEnd.anchor.position]);
    //   let headOffset = headDir.reverse().mul((headEdgeBbox?.width ?? 0) * parsedHeadShape.offsetForward);
    //   pos.end = pos.end.add(headOffset);
    //   headEdgeJsx = (p: Vector) => (
    //     <XEdge
    //       pos={{ x: p.x - headOffset.x, y: p.y - headOffset.y }}
    //       dir={headDir.reverse()}
    //       size={headSize}
    //       containerRef={endEdgeRef}
    //       svgElem={normedHeadShape}
    //       color={headColor}
    //       props={arrowHeadProps}
    //       rotate={headRotate}
    //     />
    //   );
    //   extendSt.headEdgeJsx = headEdgeJsx;
    // }

    return extendSt as tRet;
  },

  jsx: ({ state, props, nextJsx }) => {
    const { tailEdgeJsx, headEdgeJsx } = state;

    return (
      <>
        {tailEdgeJsx?.(state.posSt.start)}
        {headEdgeJsx?.(state.posSt.end)}
        {nextJsx()}
      </>
    );
  },
});
const prepareEdgeJsx = (props, state, pos, vName, parsedShape, show, size, color, arrowProps, rotate, dir, deps) => {
  const NormShape = props.normalizeSvg ? NormalizedGSvg : React.Fragment;
  const normedshape = <NormShape>{parsedShape.svgElem}</NormShape>;
  const endEdgeRef = useRef();
  let edgeBbox = useGetBBox(endEdgeRef, deps);

  // todo: edges when path is straight
  // for 'middle' anchors
  // let offset = new Vector(1, 1).mul((edgeBbox?.width ?? 0) * parsedShape.offsetForward);
  if (dir.size() === 0) {
    console.log('middle');

    // let vLen = ll.diff.abs().add(offset);
    // dir = new Dir(vLen.x > vLen.y ? new Vector(vLen.x, 0) : new Vector(0, vLen.y));
    // if (vName == 'start') dir = dir.reverse();
  }

  if (show) {
    if (props.path === 'straight') {
      console.log('test1');
    }
    let edgeJsx: GetJsx | null;
    // todo: fix middle anchors
    // if (dir.size() === 0) {
    //   let ll = new Line(pos.start, pos.end);
    //   dir = new Dir(ll.diff.abs().x > ll.diff.abs().y ? new Vector(ll.diff.x, 0) : new Vector(0, ll.diff.y));
    //   if (vName === 'start') dir = dir.reverse();
    // }
    let offset = dir.reverse().mul((edgeBbox?.width ?? 0) * parsedShape.offsetForward);

    pos[vName].add(offset, true, true);
    // let ll = new Line(pos.start, pos.end);
    // dir = new Dir(ll.diff.abs().x > ll.diff.abs().y ? new Vector(ll.diff.x, 0) : new Vector(0, ll.diff.y));

    edgeJsx = (p: Vector) => (
      <XEdge
        pos={{ x: p.x - offset.x, y: p.y - offset.y }}
        dir={dir.reverse()}
        size={size}
        containerRef={endEdgeRef}
        svgElem={normedshape}
        color={color}
        props={arrowProps}
        rotate={rotate}
      />
    );
    return edgeJsx;
  }
};

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
