import React, { SVGFactory, useEffect, useLayoutEffect, useRef } from 'react';
import { getPathStateType, simplePosType } from '../utils/XarrowUtils';
import { svgCustomEdgeType, svgEdgeDefaultShapeType, svgEdgeType, svgElemStrType, svgElemType } from '../types';
import XEdge from './XEdge';
import { XarrowMainProps, XarrowMainPropsAPI } from './XarrowMain';
import { choosenAnchorType } from '../utils';
import { Dir } from '../classes/classes';
import { anchorsInwardOffset } from './XarrowAnchors';
import { useGetBBox } from './NormalizedGSvg';
import { arrowShapes, cArrowShapes } from '../constants';
import { useRerender } from '../hooks/HooksUtils';

const parseEdgeShape = (svgEdge: svgEdgeType): svgCustomEdgeType => {
  let parsedProp: svgCustomEdgeType = arrowShapes['arrow1'] as unknown as svgCustomEdgeType;
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
    svgEdge = svgEdge as svgCustomEdgeType;
    parsedProp = svgEdge;
    if (parsedProp?.offsetForward === undefined) parsedProp.offsetForward = 0.5;
    if (parsedProp?.svgElem === undefined) parsedProp.svgElem = arrowShapes['arrow1'].svgElem;
  }
  return parsedProp;
};

export interface XarrowEdgesAPIProps {
  showHead?: boolean;
  color?: string;
  headColor?: string | null;
  tailColor?: string | null;
  headSize?: number;
  showTail?: boolean;
  tailSize?: number;
  headShape?: svgEdgeType;
  tailShape?: svgEdgeType;
  headRotate?: number;
  tailRotate?: number;
  arrowHeadProps?: JSX.IntrinsicElements[svgElemStrType];
  arrowTailProps?: JSX.IntrinsicElements[svgElemStrType];
}

export interface XarrowEdgesProps extends XarrowEdgesAPIProps, XarrowMainPropsAPI {
  getPathState: getPathStateType<simplePosType>;
  children?: (posState: getPathStateType, tailEdgeJsx: JSX.Element, headEdgeJsx: JSX.Element) => React.ReactElement;
  anchors: { chosenStart: choosenAnchorType; chosenEnd: choosenAnchorType };
}

const XarrowEdges: React.FC<XarrowEdgesProps> = (props) => {
  const reRender = useRerender();
  const {
    showHead = true,
    showTail = true,
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
  let parsedHeadShape = parseEdgeShape(headShape);
  let parsedTailShape = parseEdgeShape(tailShape);
  let getPathState = props.getPathState;
  let pos = getPathState(undefined, null);

  useLayoutEffect(() => {
    reRender();
  }, [showHead, showTail]);

  // tail logic
  /////////////
  let tailDir = new Dir(anchorsInwardOffset[props.anchors.chosenStart.anchor.position]);
  const startEdgeRef = useRef();
  let tailEdgeJsx = showTail && (
    <XEdge
      pos={{ x: pos.start.x, y: pos.start.y }}
      dir={tailDir.reverse()}
      size={tailSize}
      containerRef={startEdgeRef}
      svgElem={parsedTailShape.svgElem}
      color={tailColor}
      props={arrowTailProps}
      rotate={tailRotate}
    />
  );
  let tailEdgeBbox = useGetBBox(startEdgeRef, tailEdgeJsx);
  // head logic
  /////////////
  let headDir = new Dir(anchorsInwardOffset[props.anchors.chosenEnd.anchor.position]);
  const headEdgeRef = useRef();
  let headEdgeJsx = showHead && (
    <XEdge
      pos={{ x: pos.end.x, y: pos.end.y }}
      dir={headDir.reverse()}
      size={headSize}
      containerRef={headEdgeRef}
      svgElem={parsedHeadShape.svgElem}
      color={headColor}
      props={arrowHeadProps}
      rotate={headRotate}
    />
  );
  let headEdgeBbox = useGetBBox(headEdgeRef, headEdgeJsx);

  //offset path start and ending
  let newGetPathState = getPathState((pos) => {
    pos.start = pos.start.add(tailDir.reverse().mul((tailEdgeBbox?.width ?? 0) * parsedTailShape.offsetForward));
    pos.end = pos.end.add(headDir.reverse().mul((headEdgeBbox?.width ?? 0) * parsedHeadShape.offsetForward));
    return pos;
  });

  return props.children(newGetPathState, tailEdgeJsx, headEdgeJsx);
};

export default XarrowEdges;
