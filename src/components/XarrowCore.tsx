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
import { appendPropsToChildren } from '../utils/reactUtils';
import PT from 'prop-types';

export const log = console.log;

export interface XarrowCoreAPIProps {
  start: refType;
  end: refType;

  SVGcanvasProps?: AutoResizeSvgProps;
  SVGcanvasStyle?: React.CSSProperties;
  divContainerProps?: React.HTMLProps<HTMLDivElement>;

  // the phase that xarrow will sample the DOM. can be useEffect or useLayoutEffect
  _updatePhase?: (effect: EffectCallback, deps?: DependencyList) => void;
}

export interface XarrowCoreProps extends XarrowCoreAPIProps {
  children: (state: { startElem: XElementType; endElem: XElementType; rootElem: XElementType }) => React.ReactElement;
}

/**
 * this component responsible holding state for start and end element. returns svg canvas and state of the elements.
 * used as extensible component for extra features.
 */
export const XarrowCore: React.FC<XarrowCoreProps> = (props) => {
  console.log('XarrowCore');
  const { _updatePhase: effect = useLayoutEffect } = props;

  const rootDivRef = useRef<HTMLDivElement>(null);

  const startElem = useElement(props.start);
  const endElem = useElement(props.end);
  const rootElem = useElement(rootDivRef);

  // on mount
  const [, setRender] = useState({});
  const forceRerender = () => setRender({});
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

  const elemsSt = { startElem, endElem, rootElem };
  return (
    <div ref={rootDivRef} style={{ position: 'absolute', pointerEvents: 'none' }} {...props.divContainerProps}>
      <svg
        style={{
          position: 'absolute',
          ...props.SVGcanvasStyle,
        }}
        overflow="visible">
        {props.children(elemsSt)}
      </svg>
    </div>
  );
};

const pRefType = PT.oneOfType([PT.string, PT.exact({ current: PT.any })]);

XarrowCore.propTypes = {
  start: pRefType.isRequired,
  end: pRefType.isRequired,
};

XarrowCore.defaultProps = {
  children: () => <div />,
};

// XarrowCore.whyDidYouRender = true;

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
export default XarrowCore;
