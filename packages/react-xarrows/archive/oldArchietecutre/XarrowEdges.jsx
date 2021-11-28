"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var XEdge_1 = require("./XEdge");
var classes_1 = require("../classes/classes");
var XarrowAnchors_1 = require("./XarrowAnchors");
var NormalizedGSvg_1 = require("./NormalizedGSvg");
var constants_1 = require("../constants");
var HooksUtils_1 = require("../hooks/HooksUtils");
var parseEdgeShape = function (svgEdge) {
    var parsedProp = constants_1.arrowShapes['arrow1'];
    if (react_1.default.isValidElement(svgEdge)) {
        parsedProp.svgElem = svgEdge;
    }
    else if (typeof svgEdge == 'string') {
        if (svgEdge in constants_1.arrowShapes)
            parsedProp = constants_1.arrowShapes[svgEdge];
        else {
            console.warn("'" + svgEdge + "' is not supported arrow shape. the supported arrow shapes is one of " + constants_1.cArrowShapes + ".\n           reverting to default shape.");
            parsedProp = constants_1.arrowShapes['arrow1'];
        }
    }
    else {
        svgEdge = svgEdge;
        parsedProp = svgEdge;
        if ((parsedProp === null || parsedProp === void 0 ? void 0 : parsedProp.offsetForward) === undefined)
            parsedProp.offsetForward = 0.5;
        if ((parsedProp === null || parsedProp === void 0 ? void 0 : parsedProp.svgElem) === undefined)
            parsedProp.svgElem = constants_1.arrowShapes['arrow1'].svgElem;
    }
    return parsedProp;
};
var XarrowEdges = function (props) {
    console.log('XarrowEdges');
    var reRender = (0, HooksUtils_1.useRerender)();
    var _a = props.showHead, showHead = _a === void 0 ? true : _a, _b = props.showTail, showTail = _b === void 0 ? true : _b, _c = props.color, color = _c === void 0 ? 'cornflowerBlue' : _c, _d = props.headColor, headColor = _d === void 0 ? color : _d, _e = props.tailColor, tailColor = _e === void 0 ? color : _e, _f = props.headShape, headShape = _f === void 0 ? constants_1.arrowShapes.arrow1 : _f, _g = props.tailShape, tailShape = _g === void 0 ? constants_1.arrowShapes.arrow1 : _g, _h = props.headSize, headSize = _h === void 0 ? 40 : _h, _j = props.tailSize, tailSize = _j === void 0 ? 40 : _j, _k = props.headRotate, headRotate = _k === void 0 ? 0 : _k, _l = props.tailRotate, tailRotate = _l === void 0 ? 0 : _l, _m = props.arrowHeadProps, arrowHeadProps = _m === void 0 ? {} : _m, _o = props.arrowTailProps, arrowTailProps = _o === void 0 ? {} : _o;
    var parsedHeadShape = parseEdgeShape(headShape);
    var parsedTailShape = parseEdgeShape(tailShape);
    var getPathState = props.getPathState;
    var pos = getPathState(undefined, null);
    (0, react_1.useLayoutEffect)(function () {
        reRender();
    }, [showHead, showTail]);
    // tail logic
    /////////////
    var tailDir = new classes_1.Dir(XarrowAnchors_1.anchorsInwardOffset[props.anchors.chosenStart.anchor.position]);
    var startEdgeRef = (0, react_1.useRef)();
    var tailEdgeJsx = showTail && (<XEdge_1.default pos={{ x: pos.start.x, y: pos.start.y }} dir={tailDir.reverse()} size={tailSize} containerRef={startEdgeRef} svgElem={parsedTailShape.svgElem} color={tailColor} props={arrowTailProps} rotate={tailRotate}/>);
    var tailEdgeBbox = (0, NormalizedGSvg_1.useGetBBox)(startEdgeRef, tailEdgeJsx);
    // head logic
    /////////////
    var headDir = new classes_1.Dir(XarrowAnchors_1.anchorsInwardOffset[props.anchors.chosenEnd.anchor.position]);
    var headEdgeRef = (0, react_1.useRef)();
    var headEdgeJsx = showHead && (<XEdge_1.default pos={{ x: pos.end.x, y: pos.end.y }} dir={headDir.reverse()} size={headSize} containerRef={headEdgeRef} svgElem={parsedHeadShape.svgElem} color={headColor} props={arrowHeadProps} rotate={headRotate}/>);
    var headEdgeBbox = (0, NormalizedGSvg_1.useGetBBox)(headEdgeRef, headEdgeJsx);
    //offset path start and ending
    var newGetPathState = getPathState(function (pos) {
        var _a, _b;
        pos.start = pos.start.add(tailDir.reverse().mul(((_a = tailEdgeBbox === null || tailEdgeBbox === void 0 ? void 0 : tailEdgeBbox.width) !== null && _a !== void 0 ? _a : 0) * parsedTailShape.offsetForward));
        pos.end = pos.end.add(headDir.reverse().mul(((_b = headEdgeBbox === null || headEdgeBbox === void 0 ? void 0 : headEdgeBbox.width) !== null && _b !== void 0 ? _b : 0) * parsedHeadShape.offsetForward));
        return pos;
    });
    return props.children(newGetPathState, tailEdgeJsx, headEdgeJsx);
};
exports.default = XarrowEdges;
