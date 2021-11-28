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
var react_1 = require("react");
var utils_1 = require("../utils");
var XarrowAnchors_1 = require("./XarrowAnchors");
var classes_1 = require("../classes/classes");
var PATH_MARGIN = 10;
var XarrowPathShape = function (props) {
    var _a, _b, _c, _d;
    var getPathState = props.getPathState;
    var posState = getPathState(undefined, null);
    var ps = new classes_1.Vector(posState.start.x, posState.start.y);
    var pe = new classes_1.Vector(posState.end.x, posState.end.y);
    var ll = new classes_1.Line(ps, pe);
    var startDir = new classes_1.Dir(XarrowAnchors_1.anchorsInwardOffset[props.anchors.chosenStart.anchor.position]).mul(-1);
    var endDir = new classes_1.Dir(XarrowAnchors_1.anchorsInwardOffset[props.anchors.chosenEnd.anchor.position]);
    // for 'middle' anchors
    if (startDir.size() === 0)
        startDir = new classes_1.Dir(ll.diff.abs().x > ll.diff.abs().y ? new classes_1.Vector(ll.diff.x, 0) : new classes_1.Vector(0, ll.diff.y));
    if (endDir.size() === 0)
        endDir = new classes_1.Dir(ll.diff.abs().x > ll.diff.abs().y ? new classes_1.Vector(ll.diff.x, 0) : new classes_1.Vector(0, ll.diff.y));
    var gridBreak = (_a = (0, utils_1.xStr2absRelative)(props.gridBreak)) !== null && _a !== void 0 ? _a : { relative: 0, abs: 0 };
    var cu = (_b = (0, utils_1.xStr2absRelative)(props.curveness)) !== null && _b !== void 0 ? _b : { relative: 0, abs: 0 };
    var cp1 = new classes_1.Vector(ps), cp2 = new classes_1.Vector(pe);
    var cps1 = '';
    var cps2 = '';
    if (props.path === 'straight') {
        getPathState = getPathState(function (pos) { return pos; }, function (pos) { return "M " + pos.start.x + " " + pos.start.y + " L " + pos.end.x + " " + pos.end.y; });
    }
    else {
        if (startDir.abs().eq(endDir.abs())) {
            //two control points
            var dd = startDir.mul(ll.diff.abs().add(startDir.mul(gridBreak.abs).abs())).mul(gridBreak.relative);
            if (ll.diff.projection(startDir).mul(startDir).size() < -PATH_MARGIN) {
                // cases where path is drawn in negative direction to the start or end anchors directions
                dd = startDir.mul(PATH_MARGIN);
            }
            cp1 = ps.add(dd);
            cp2 = cp1.add(ll.diff.mul(startDir.rotate(90).abs()));
            // handle custom curveness
            var l1 = new classes_1.Line(ps, cp1);
            var dd2 = startDir.mul(l1.diff.abs().mul(cu.relative).add(cu.abs));
            cp1 = cp1.add(dd2);
            cp2 = cp2.sub(dd2);
        }
        else {
            //one control point
            var d = startDir.add(endDir.mul(-1)).mul(0.5);
            cp1 = ps;
            cp2 = ps.add(startDir.abs().mul(ll.diff));
            var dd2 = d.mul(ll.diff.abs().mul(cu.relative).add(cu.abs));
            cp2 = cp2.add(dd2);
        }
        getPathState = getPathState(function (pos) { return (__assign(__assign({}, pos), { cp1: cp1, cp2: cp2 })); });
        if (props.path === 'grid') {
            cps1 = cp1 ? "L " + cp1.x + " " + cp1.y : '';
            cps2 = "L " + cp2.x + " " + cp2.y;
            getPathState = getPathState(function (pos) { return pos; }, function (pos) { return "M " + pos.start.x + " " + pos.start.y + " " + cps1 + " " + cps2 + " L " + pos.end.x + " " + pos.end.y; });
        }
        else if (props.path === 'smooth') {
            getPathState = getPathState(function (pos) { return pos; }, function (pos) { return "M " + pos.start.x + " " + pos.start.y + " C " + cp1.x + " " + cp1.y + ", " + cp2.x + " " + cp2.y + " " + pos.end.x + " " + pos.end.y; });
        }
    }
    var jsx = (<>
      <path d={getPathState()} stroke="black" strokeWidth={props.strokeWidth}/>
      {props.tailEdgeJsx}
      {props.headEdgeJsx}
    </>);
    var child = (_d = (_c = props.children) === null || _c === void 0 ? void 0 : _c.call(props, getPathState)) !== null && _d !== void 0 ? _d : jsx;
    return (<>
      {child}
      {props._debug && (<>
          <circle cx={cp1.x} cy={cp1.y} r="3" stroke="black" fill="red"/>
          <circle cx={cp2.x} cy={cp2.y} r="3" stroke="black" fill="blue"/>
        </>)}
    </>);
};
XarrowPathShape.defaultProps = {
    path: 'smooth',
    gridBreak: '50%',
    curveness: '0%',
    _debug: false,
};
exports.default = XarrowPathShape;
