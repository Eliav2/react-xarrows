import React, { useContext } from 'react';
import { XarrowContext } from '../Xwrapper';
import { DelayedComponent, DelayedComponentPropsAPI } from './DelayedComponent';
import XarrowAnchors, { XarrowAnchorsAPIProps } from './XarrowAnchors';
import XarrowCore, { XarrowCoreAPIProps } from './XarrowCore';
import XarrowBasicPath, { XarrowBasicAPIProps } from './XarrowBasicPath';
import XarrowPathShape, { XarrowPathShapeAPIProps } from './XarrowPathShape';
import XarrowEdges from './XarrowEdges';
import _ from 'lodash';

//top to down(core down)
export interface XarrowMainProps extends XarrowMainPropsAPI {
  children?: undefined;
}
export interface XarrowMainPropsAPI
  extends DelayedComponentPropsAPI,
    XarrowCoreAPIProps,
    XarrowBasicAPIProps,
    XarrowAnchorsAPIProps,
    XarrowPathShapeAPIProps {}

const XarrowMain: React.FC<XarrowMainProps> = (props) => {
  const { _delayRenders = 1 } = props;
  // console.log('XarrowMain');
  useContext(XarrowContext);
  return (
    <DelayedComponent _delayRenders={_delayRenders}>
      {() => {
        return (
          <XarrowCore {...props}>
            {(elems) => {
              return (
                <XarrowBasicPath {...elems}>
                  {(getPathState) => {
                    return (
                      <XarrowAnchors {...{ ...elems, getPathState, ...props }}>
                        {(getPathState, anchors) => {
                          return (
                            // <XarrowPathShape {...{ ...props, getPathState, anchors }}>
                            //   {(getPathState) => {
                            //     return <XarrowEdges {...{ ...props, getPathState, anchors }} />;
                            //   }}
                            <XarrowEdges {...{ ...props, getPathState, anchors }}>
                              {(getPathState, startEdgeJsx) => {
                                return <XarrowPathShape {...{ ...props, getPathState, anchors, startEdgeJsx }} />;
                              }}
                            </XarrowEdges>
                          );
                        }}
                      </XarrowAnchors>
                    );
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

// export interface CustomXarrowProps extends XarrowCoreAPIProps, XarrowBasicAPIProps, XarrowAnchorsAPIProps {}
//
// const CustomXarrow: React.FC<CustomXarrowProps> = (props) => {
//   const { start, end, SVGcanvasProps, SVGcanvasStyle, divContainerProps, ...rest } = props;
//   return (
//     <XarrowCore {...{ start, end, SVGcanvasProps, SVGcanvasStyle, divContainerProps }} {...rest}>
//       {(elems) => {
//         return (
//           <XarrowBasicPath {...elems}>
//             {(getPath) => {
//               return <XarrowAnchors {...{ ...elems, getPath, ...rest }} />;
//             }}
//           </XarrowBasicPath>
//         );
//       }}
//     </XarrowCore>
//   );
// };

export default XarrowMain;
