import React from 'react';
import { DelayedComponentPropsAPI } from './DelayedComponent';
import XarrowAnchors, { XarrowAnchorsPropsAPI } from './XarrowAnchors';
import XarrowCore, { XarrowCorePropsAPI } from './XarrowCore';
import XarrowBasicPath, { XarrowBasicPropsAPI } from './XarrowBasicPath';
import XarrowPathShape, { XarrowPathShapePropsAPI } from './XarrowPathShape';
import XarrowEdges, { XarrowEdgesPropsAPI } from './XarrowEdges';

export interface XarrowMainProps extends XarrowMainPropsAPI {
  children?: undefined;
}
export interface XarrowMainPropsAPI
  extends DelayedComponentPropsAPI,
    XarrowCorePropsAPI,
    XarrowBasicPropsAPI,
    XarrowAnchorsPropsAPI,
    XarrowPathShapePropsAPI,
    XarrowEdgesPropsAPI {}

const XarrowMain: React.FC<XarrowMainProps> = (props) => {
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
                      <XarrowEdges {...{ ...props, getPathState, anchors }}>
                        {(getPathState, tailEdgeJsx, headEdgeJsx) => {
                          return <XarrowPathShape {...{ ...props, getPathState, anchors, tailEdgeJsx, headEdgeJsx }} />;
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
