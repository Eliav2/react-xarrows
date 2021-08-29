import React, {
  DependencyList,
  EffectCallback,
  ReactNode,
  SVGProps,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { refType } from '../types';
import { getElementByPropGiven, getElemPos } from './utils';
import _ from 'lodash';
import { XarrowContext } from '../Xwrapper';
import { AutoResizeSvg } from '../components/AutoResizeSvg';
import { DelayedComponent } from '../components/DelayedComponent';

export const log = console.log;
// console.log = () => {};
/**
 * what should i do to demonstrate the ability to extend features?
 *      first i should write plugin that draw the arrow
 *          next should add the ability to choose color to the arrow, and the width
 *
 */

const useUpdatedVal = (
  getVal: () => any,
  effect: (effect: React.EffectCallback, deps?: React.DependencyList, ...rest) => void = useLayoutEffect,
  ...effectRest
) => {
  const [val, setVal] = useState(getVal());
  let curVal = getVal();
  // trigger render with new value as it may have UI meaning
  effect(
    () => {
      setVal(curVal);
    },
    [curVal],
    ...effectRest
  );
  return [curVal, setVal];
};

const getPosition = (start: refType, end: refType, root: HTMLDivElement) => {
  const startElem = getElementByPropGiven(start);
  const endElem = getElementByPropGiven(end);
  const rootPos = getElemPos(root);
  const { x: xr, y: yr } = rootPos;
  const startPos = getElemPos(startElem);
  const endPos = getElemPos(endElem);
  let xs = (startPos.x + startPos.right) / 2;
  let ys = (startPos.y + startPos.bottom) / 2;
  let xe = (endPos.x + endPos.right) / 2;
  let ye = (endPos.y + endPos.bottom) / 2;
  const cw = Math.abs(xe - xs);
  const ch = Math.abs(ye - ys);
  let cx0 = Math.min(xs, xe);
  let cy0 = Math.min(ys, ye);
  xs -= cx0;
  xe -= cx0;
  ys -= cy0;
  ye -= cy0;
  cx0 -= xr;
  cy0 -= yr;
  const path = `M ${xs} ${ys} L ${xe} ${ye}`;
  return { path, cw, ch, cx0, cy0 };
};

interface XSimpleArrowPropsType {
  start: refType;
  end: refType;
  SVGcanvasProps?: SVGProps<SVGSVGElement>;
  SVGcanvasStyle?: React.CSSProperties;
  SVGChildren?: ReactNode | undefined;
  arrowBodyProps?: SVGProps<SVGPathElement>;
  divContainerProps?: React.HTMLProps<HTMLDivElement>;
  // the phase that xarrow will sample the DOM. can be useEffect or useLayoutEffect
  _updatePhase?: (effect: EffectCallback, deps?: DependencyList) => void;
  // the number of idle renders (cached result is returned) before running the actual expensive render that sample the DOM.
  // can be used to sample the DOM after other components updated, that your xarrow maybe depends on.
  idleRenders?: number;
}

const XSimpleArrow: React.FC<XSimpleArrowPropsType> = (props) => {
  // console.log('XSimpleArrow');
  const rootDivRef = useRef<HTMLDivElement>(null);
  const { _updatePhase: effect, start, end } = props;

  const [st, setSt] = useState(getPosition(start, end, rootDivRef.current));

  effect(() => {
    let curSt = getPosition(start, end, rootDivRef.current);
    if (!_.isEqual(curSt, st)) setSt(curSt);
  });

  return (
    <div ref={rootDivRef} style={{ position: 'absolute', pointerEvents: 'none' }} {...props.divContainerProps}>
      <AutoResizeSvg
        effectPhase={effect}
        style={{
          border: 'solid yellow 1px',
          position: 'absolute',
          left: st.cx0,
          top: st.cy0,
          ...props.SVGcanvasStyle,
        }}
        overflow="auto"
        {...props.SVGcanvasProps}>
        {/* body of the arrow */}
        <path d={st.path} {...props.arrowBodyProps} stroke="black" />
        {/* other optional possibilities */}
        {props.SVGChildren}
      </AutoResizeSvg>
    </div>
  );
};

XSimpleArrow.defaultProps = {
  _updatePhase: useLayoutEffect,
};

const DelayedXArrow: React.FC<XSimpleArrowPropsType> = (props) => {
  const { idleRenders = 1 } = props;
  useContext(XarrowContext);
  return <DelayedComponent delay={idleRenders} componentCB={() => <XSimpleArrow {...props} />} />;
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
  return <div>{/*<XSimpleArrowWithOptions start={} end={} />*/}</div>;
};

CustomXarrow.propTypes = {};

// export default XSimpleArrow;
export default DelayedXArrow;
