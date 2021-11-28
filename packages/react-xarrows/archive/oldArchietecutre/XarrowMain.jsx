"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
// import '../wdyr';
var react_1 = require("react");
var XarrowAnchors_1 = require("./XarrowAnchors");
var XarrowCore_1 = require("./XarrowCore");
var XarrowBasicPath_1 = require("./XarrowBasicPath");
var XarrowPathShape_1 = require("./XarrowPathShape");
var XarrowEdges_1 = require("./XarrowEdges");
var XarrowMain = function (props) {
    return (<XarrowCore_1.default {...props}>
      {function (elems) {
            return (<XarrowBasicPath_1.default {...elems}>
            {function (getPathState) {
                    return (<XarrowAnchors_1.default {...__assign(__assign(__assign({}, elems), { getPathState: getPathState }), props)}>
                  {function (getPathState, anchors) {
                            return (<XarrowEdges_1.default {...__assign(__assign({}, props), { getPathState: getPathState, anchors: anchors })}>
                        {function (getPathState, tailEdgeJsx, headEdgeJsx) {
                                    return <XarrowPathShape_1.default {...__assign(__assign({}, props), { getPathState: getPathState, anchors: anchors, tailEdgeJsx: tailEdgeJsx, headEdgeJsx: headEdgeJsx })}/>;
                                }}
                      </XarrowEdges_1.default>);
                        }}
                </XarrowAnchors_1.default>);
                }}
          </XarrowBasicPath_1.default>);
        }}
    </XarrowCore_1.default>);
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
exports.default = XarrowMain;
