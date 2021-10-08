import React, { useRef } from 'react';
import { getPathStateType, simplePosType } from '../utils/XarrowUtils';
import { svgEdgeType, svgElemType } from '../types';
import XEdge from './XEdge';
import { XarrowMainProps, XarrowMainPropsAPI } from './XarrowMain';
import { choosenAnchorType } from '../utils';
import { Dir } from '../classes/classes';
import { anchorsInwardOffset } from './XarrowAnchors';
import { useGetBBox } from './NormalizedGSvg';
import { arrowShapes } from '../constants';

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
  arrowHeadProps?: JSX.IntrinsicElements[svgElemType];
  arrowTailProps?: JSX.IntrinsicElements[svgElemType];
}

export interface XarrowEdgesProps extends XarrowEdgesAPIProps, XarrowMainPropsAPI {
  getPathState: getPathStateType<simplePosType>;
  children?: (posState: getPathStateType, startEdgeJsx: JSX.Element) => React.ReactElement;
  anchors: { chosenStart: choosenAnchorType; chosenEnd: choosenAnchorType };
}

const XarrowEdges: React.FC<XarrowEdgesProps> = (props) => {
  const {
    showHead = true,
    showTail = true,
    color = 'cornflowerBlue',
    headColor = color,
    tailColor = color,
    headSize = 40,
    tailSize = 40,
    headShape = arrowShapes.arrow1,
    tailShape = arrowShapes.arrow1,
    arrowHeadProps = {},
    arrowTailProps = {},
  } = props;
  let getPathState = props.getPathState;
  let pos = getPathState(undefined, null);
  let startDir = new Dir(anchorsInwardOffset[props.anchors.chosenStart.anchor.position]);
  const startEdgeRef = useRef();
  let startEdgeJsx = (
    <XEdge
      pos={{ x: pos.start.x, y: pos.start.y }}
      dir={startDir.reverse()}
      size={props.tailSize}
      containerRef={startEdgeRef}
      svgElem={headShape}
    />
  );
  let startEdgeBbox = useGetBBox(startEdgeRef, startEdgeJsx);
  let newGetPathState = getPathState((pos) => {
    //todo: offsetForward for custom shapes

    pos.start = pos.start.add(startDir.reverse().mul(startEdgeBbox.width * (headShape?.offsetForward ?? 0.5)));
    return pos;
  });

  return props.children(newGetPathState, startEdgeJsx);
};

export default XarrowEdges;
