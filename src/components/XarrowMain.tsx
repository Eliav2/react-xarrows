import React, { useContext } from 'react';
import { XarrowContext } from '../Xwrapper';
import { DelayedComponent } from './DelayedComponent';
import XarrowAnchors, { XarrowAnchorsAPIProps } from './XarrowAnchors';
import XarrowCore, { XarrowCoreAPIProps } from './XarrowCore';
import XarrowBasicPath, { XarrowBasicAPIProps } from './XarrowBasicPath';

//top to down(core down)
export interface XarrowMainProps extends XarrowCoreAPIProps, XarrowBasicAPIProps, XarrowAnchorsAPIProps {
  // the number of idle renders (cached result is returned) before running the actual expensive render that sample the DOM.
  // can be used to sample the DOM after other components updated, that your xarrow maybe depends on.
  _delayRenders?: number;
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

export interface CustomXarrowProps extends XarrowCoreAPIProps, XarrowBasicAPIProps, XarrowAnchorsAPIProps {}

const CustomXarrow: React.FC<CustomXarrowProps> = (props) => {
  const { start, end, SVGcanvasProps, SVGcanvasStyle, divContainerProps, ...rest } = props;
  return (
    <XarrowCore {...{ start, end, SVGcanvasProps, SVGcanvasStyle, divContainerProps }} {...rest}>
      {(elems) => {
        return (
          <XarrowBasicPath {...elems}>
            {(getPath) => {
              let { startElem, endElem } = elems;
              return <XarrowAnchors {...{ startElem, endElem, getPath }} {...rest} />;
            }}
          </XarrowBasicPath>
        );
      }}
    </XarrowCore>
  );
};

export default XarrowMain;
