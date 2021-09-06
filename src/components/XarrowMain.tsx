import React, { useContext } from 'react';
import { XarrowContext } from '../Xwrapper';
import { DelayedComponent } from './DelayedComponent';
import XarrowAnchors, { XarrowAnchorsProps } from './XarrowAnchors';
import XarrowCore, { XarrowCoreProps } from './XarrowCore';
import XarrowBasicPath, { XarrowBasicProps } from './XarrowBasicPath';

// const XarrowMain: React.FC<XarrowAnchorsProps> = (props) => {
//   const { _delayRenders = 1 } = props;
//   // console.log('DelayedXArrow');
//   useContext(XarrowContext);
//   return <DelayedComponent delay={_delayRenders}>{() => <XarrowAnchors {...props} />}</DelayedComponent>;
// };

// OmitChildren
type OmitCh<T> = Omit<T, 'children'>;

//top to down(core down)
interface XarrowMainProps extends OmitCh<XarrowCoreProps>, OmitCh<XarrowBasicProps> {
  _delayRenders: number;
}

const XarrowMain: React.FC<XarrowMainProps> = (props) => {
  const { _delayRenders = 1, ...rest } = props;
  // console.log('DelayedXArrow');
  useContext(XarrowContext);
  return (
    <DelayedComponent delay={_delayRenders}>
      {() => {
        const { start, end, SVGcanvasProps, SVGcanvasStyle, divContainerProps, ..._rest } = rest;
        return (
          <XarrowCore {...{ start, end, SVGcanvasProps, SVGcanvasStyle, divContainerProps }} {..._rest}>
            {(elems) => {
              return (
                <XarrowBasicPath {...elems}>
                  {(getPath) => {
                    let { startElem, endElem } = elems;
                    return <XarrowAnchors {...{ startElem, endElem, getPath }} {..._rest} />;
                  }}
                </XarrowBasicPath>
              );
            }}
          </XarrowCore>
        );
      }}
    </DelayedComponent>
  );
};

export default XarrowMain;
