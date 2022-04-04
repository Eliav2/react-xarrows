import React, { LegacyRef, ReactSVG, useRef } from 'react';
import { svgCustomEdgeType, svgElemStrType, svgElemType } from '../types';
import { PlainObject } from '../privateTypes';
import { arrowShapes } from '../constants';
import { Dir, Vector } from '../classes/path';
import NormalizedGSvg, { useGetBBox } from './NormalizedGSvg';
import { posStType } from '../features/Core';

export interface XEdgeProps {
  /**
   * API
   */
  // a jsx element of type svg like <circle .../> or <path .../>
  // svgElem: JSX.Element;
  svgElem: svgCustomEdgeType;

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
  // pos: { x: number; y: number }; // initial offset pos
  pos: Vector; // initial offset pos
  containerRef?: LegacyRef<SVGGElement>; // internal
  posSt: posStType;
  vName: 'start' | 'end';
  deps: any[];
  state: any;
}

const XEdge: React.FC<XEdgeProps> = (props) => {
  const { vName, svgElem, deps, pos, show, containerRef } = props;
  const NormShape = props.normalizeSvg ? NormalizedGSvg : React.Fragment;
  const normedshape = <NormShape>{svgElem.svgElem}</NormShape>;
  const dir = pos._chosenFaceDir;
  // const endEdgeRef = useRef();
  // let edgeBbox = useGetBBox(endEdgeRef, deps);
  // let offset = dir.reverse().mul((edgeBbox?.width ?? 0) * svgElem.offsetForward);
  // props.state[`${vName}Offset`] = offset;
  // if (!show) offset = offset.mul(0);
  return (
    <g {...props.props}>
      <g
        ref={containerRef}
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
          {normedshape}
        </g>
      </g>
    </g>
  );
};
XEdge.defaultProps = {
  size: 30,
  svgElem: arrowShapes.arrow1,
  color: 'cornflowerBlue',
  normalizeSvg: true,
  rotate: 0,
};

export default XEdge;
