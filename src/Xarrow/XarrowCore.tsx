import React, { ReactNode, SVGProps, useState } from 'react';
import PropTypes from 'prop-types';
import { refType, svgElemType } from '../types';
import { getElementByPropGiven } from './utils';

export type xarrowCorePropsType = {
  start: refType;
  end: refType;
  strokeWidth?: number;
  lineColor?: string | null;
  SVGcanvasProps?: React.SVGAttributes<SVGSVGElement>;
  SVGcanvasStyle?: React.CSSProperties;
  divContainerStyle?: React.CSSProperties;
  passProps?: JSX.IntrinsicElements[svgElemType];
  arrowBodyProps?: React.SVGProps<SVGPathElement>;
};

const getPosition = (props: xarrowCorePropsType) => {};
// type Contains<T extends object> = { [key in keyof T]: T[key] } & { [key: string]: any };
type Contains<T extends object> = T & { [key in string | number]: any };

/**
 * what should i do to demonstrate the ability to extend features?
 *      first i should write plugin that draw the arrow
 *          next should add the ability to choose color to the arrow, and the width
 *
 */

interface XSimpleArrowPropsType {
  start: refType;
  end: refType;
  SVGcanvasProps?: SVGProps<SVGSVGElement>;
  SVGcanvasStyle?: React.CSSProperties;
  SVGChildren?: ReactNode | undefined;
  arrowBodyProps?: SVGProps<SVGPathElement>;
}

const XSimpleArrow: React.FC<XSimpleArrowPropsType> = (props) => {
  const start = getElementByPropGiven(props.start);
  const end = getElementByPropGiven(props.end);

  // const [position, setPosition] = useState({
  //   //initial state
  //   cx0: 0, //x start position of the canvas
  //   cy0: 0, //y start position of the canvas
  //   cw: 0, // the canvas width
  //   ch: 0, // the canvas height
  //   arrowPath: ``,
  // });

  return (
    <svg
      width={st.cw}
      height={st.ch}
      style={{
        position: 'absolute',
        left: st.cx0,
        top: st.cy0,
        pointerEvents: 'none',
        ...props.SVGcanvasStyle,
      }}
      overflow="auto"
      {...props.SVGcanvasProps}>
      {/* body of the arrow */}
      <path d={st.arrowPath} {...props.arrowBodyProps} />

      {/* other optional possibilities */}
      {props.SVGChildren}
    </svg>
  );
};

interface XSimpleArrowWithOptionsPropsType extends XSimpleArrowPropsType {
  lineColor?: string;
  strokeWidth?: number;
  arrowBodyProps?: SVGProps<SVGPathElement>;
}

const XSimpleArrowWithOptions: React.FC<XSimpleArrowWithOptionsPropsType> = (
  props,
  { lineColor, strokeWidth, arrowBodyProps }
) => {
  return <XSimpleArrow {...props} arrowBodyProps={{ stroke: lineColor, strokeWidth, ...arrowBodyProps }} />;
};

const CustomXarrow: React.FC = (props, children) => {
  const [st, setSt] = useState({});

  console.log('xarrowCore call', children);

  return <div>{/*<XSimpleArrowWithOptions start={} end={} />*/}</div>;
};

CustomXarrow.propTypes = {};

export default CustomXarrow;
