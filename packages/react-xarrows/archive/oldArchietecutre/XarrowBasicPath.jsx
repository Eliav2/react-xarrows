"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPosition = void 0;
var react_1 = require("react");
var XarrowUtils_1 = require("../../src/utils/XarrowUtils");
var classes_1 = require("../../src/classes/classes");
/**
 * receives the position of the start, end , and the root elements(which is the position of the main div).
 * will calculate a simple path. if no children is provided will return a <path/> element. else will pass down the
 * updated path for farther customization.
 */
var XarrowBasicPath = function (props) {
    // console.log('XarrowBasicPath');
    var startElem = props.startElem, endElem = props.endElem, rootElem = props.rootElem;
    var elems = Object.values({ startElem: startElem, endElem: endElem, rootElem: rootElem });
    var getPathState = exports.getPosition.apply(void 0, elems);
    if (!props.children) {
        // in case this component is used without children(means that A UI feedback is expected) return a simple line connecting the chosen points
        return <path d={getPathState()} stroke="black"/>;
    }
    return props.children(getPathState);
};
XarrowBasicPath.defaultProps = {
    strokeWidth: 4,
};
exports.default = XarrowBasicPath;
// export type getPathType = (extendPos?: extendPosType, pos?: basicPos) => getPathType | string;
var getPosition = function (startElem, endElem, rootElem) {
    var _a = rootElem.position, xr = _a.x, yr = _a.y;
    var startPos = startElem.position;
    var endPos = endElem.position;
    var x1 = startPos.x - xr;
    var y1 = startPos.y - yr;
    var x2 = endPos.x - xr;
    var y2 = endPos.y - yr;
    var posSt = { start: new classes_1.Vector(x1, y1), end: new classes_1.Vector(x2, y2) };
    // return posSt;
    return (0, XarrowUtils_1.getPathState)(function (pos) { return pos; }, function (pos) { return "M " + pos.start.x + " " + pos.start.y + " L " + pos.end.x + " " + pos.end.y; }, posSt);
};
exports.getPosition = getPosition;
