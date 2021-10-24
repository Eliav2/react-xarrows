import { XarrowFeature } from '../components/XarrowBuilder';
import React from 'react';
import { svgCustomEdgeType, svgEdgeType, svgElemStrType, svgElemType } from '../types';
import { arrowShapes, cArrowShapes } from '../constants';
import { useRerender } from '../hooks/HooksUtils';

export interface EdgesProps {
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

const Edges: XarrowFeature<EdgesProps> = {
  propTypes: {},
  defaultProps: {},
  state: (state, props) => {
    // console.log('Edges');
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

    const reRender = useRerender();
    let parsedHeadShape = parseEdgeShape(headShape);
    let parsedTailShape = parseEdgeShape(tailShape);
    let getPathState = props.getPathState;
    let pos = state.
  },

  jsx: (state, props, nextJsx) => {
    return <></>;
  },
};

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
export default Edges;
