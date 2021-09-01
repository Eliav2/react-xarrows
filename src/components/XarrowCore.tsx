import React, {
  DependencyList,
  EffectCallback,
  ReactNode,
  SVGProps,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { refType } from '../types';
import { XarrowContext } from '../Xwrapper';
import { AutoResizeSvg, AutoResizeSvgProps } from './AutoResizeSvg';
import { DelayedComponent } from './DelayedComponent';
import { XElementType } from '../privateTypes';
import { useDeepCompareEffect } from '../hooks/useDeepCompareEffect';
import { useElement } from '../hooks/useElement';

export const log = console.log;

export interface XarrowCoreProps {
  start: refType;
  end: refType;
  SVGcanvasProps?: AutoResizeSvgProps;
  SVGcanvasStyle?: React.CSSProperties;
  SVGChildren?: ReactNode | undefined;
  arrowBodyProps?: SVGProps<SVGPathElement>;
  divContainerProps?: React.HTMLProps<HTMLDivElement>;

  _getPosition: (
    startElem: XElementType,
    endElem: XElementType,
    rootElem: XElementType
  ) => { path: string; cw: number; ch: number; cx0: number; cy0: number };

  // the phase that xarrow will sample the DOM. can be useEffect or useLayoutEffect
  _updatePhase?: (effect: EffectCallback, deps?: DependencyList) => void;

  // the number of idle renders (cached result is returned) before running the actual expensive render that sample the DOM.
  // can be used to sample the DOM after other components updated, that your xarrow maybe depends on.
  _delayRenders?: number;
}

const defaultGetPosition = () => ({ path: '', cw: 0, ch: 0, cx0: 0, cy0: 0 });

/**
 * this basic arrow component that responsible holding state for start and end element.
 * used as extensible component for extra features.
 * also delay (using memorization) the actual render so the DOM would be updated.
 */
const XarrowCore: React.FC<XarrowCoreProps> = (props) => {
  console.log('XarrowCore');
  const { _updatePhase: effect = useLayoutEffect, _getPosition = defaultGetPosition } = props;

  const [, setRender] = useState({});
  const forceRerender = () => setRender({});

  const rootDivRef = useRef<HTMLDivElement>(null);

  const startElem = useElement(props.start);
  const endElem = useElement(props.end);
  const rootElem = useElement(rootDivRef);

  const [st, setSt] = useState(() => _getPosition(startElem, endElem, rootElem));

  useDeepCompareEffect(() => {
    setSt(_getPosition(startElem, endElem, rootElem));
  }, [startElem, endElem]);

  // on mount
  useEffect(() => {
    // set all props on first render
    const monitorDOMchanges = () => {
      window.addEventListener('resize', forceRerender);
      return () => {
        window.removeEventListener('resize', forceRerender);
      };
    };

    const cleanMonitorDOMchanges = monitorDOMchanges();
    return () => {
      cleanMonitorDOMchanges();
    };
  }, []);

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

// XarrowCore.whyDidYouRender = true;

const DelayedXArrow: React.FC<XarrowCoreProps> = (props) => {
  const { _delayRenders = 1 } = props;
  // console.log('DelayedXArrow');
  useContext(XarrowContext);
  return <DelayedComponent delay={_delayRenders} componentCB={() => <XarrowCore {...props} />} />;
};

// interface XSimpleArrowWithOptionsPropsType extends XarrowCoreProps {
//   lineColor?: string;
//   strokeWidth?: number;
//   arrowBodyProps?: SVGProps<SVGPathElement>;
// }
//
// const XSimpleArrowWithOptions: React.FC<XSimpleArrowWithOptionsPropsType> = (
//   props,
//   { lineColor, strokeWidth, arrowBodyProps }
// ) => {
//   return <XarrowCore {...props} arrowBodyProps={{ stroke: lineColor, strokeWidth, ...arrowBodyProps }} />;
// };

// export default XarrowCore;
export default DelayedXArrow;
