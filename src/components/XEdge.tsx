import React, { ReactSVG } from 'react';
import { svgElemStrType, svgElemType } from '../types';
import { PlainObject } from '../privateTypes';
import { arrowShapes } from '../constants';
import { Dir, Vector } from '../classes/classes';
import NormalizedGSvg from './NormalizedGSvg';

export interface XEdgeProps {
  /**
   * API
   */
  // a jsx element of type svg like <circle .../> or <path .../>
  svgElem: svgElemType;

  // should the svg be normalized to size 1x1 pixels anc origin centers at (0.5,0.5)?
  normalizeSvg?: boolean;

  // the color of the svg shape
  // default to use always 'fill' and not 'stroke' so svg normalization would work as expected
  color?: string;

  // show the svg ?
  show?: boolean;

  // the size (width X height) in pixels
  size?: number;

  // props that will be passed to top level <g/> element wrapping the svg shape
  props?: JSX.IntrinsicElements[svgElemStrType];

  /**
   * Custom
   */
  // rotate in degrees after normal positioning
  rotate?: number;

  /**
   * Internal
   */
  pos: { x: number; y: number }; // initial offset pos
  dir: Dir; // facing direction of the svg
  containerRef?: React.MutableRefObject<any>; // internal
}

const XEdge: React.FC<XEdgeProps> = (props) => {
  const { pos, dir } = props;
  const NormShape = props.normalizeSvg ? NormalizedGSvg : React.Fragment;
  return (
    <g {...props.props}>
      <g
        ref={props.containerRef}
        style={{
          transformBox: 'fill-box',
          transformOrigin: 'center',
          transform: `translate(${dir.x * 50}%,${dir.y * 50}%) rotate(${dir.reverse().toDegree() + props.rotate}deg) `,
          fill: props.color,
          pointerEvents: 'auto',
        }}>
        <g
          style={{
            transform: `translate(${pos.x}px,${pos.y}px) scale(${props.size})`,
            pointerEvents: 'auto',
          }}>
          <NormShape>{props.svgElem}</NormShape>
        </g>
      </g>
    </g>
  );
};
XEdge.defaultProps = {
  size: 30,
  svgElem: arrowShapes.arrow1.svgElem,
  color: 'cornflowerBlue',
  normalizeSvg: true,
  rotate: 0,
};

export default XEdge;
