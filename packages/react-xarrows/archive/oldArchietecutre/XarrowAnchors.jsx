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
exports.calcAnchors = exports.anchorsSidewardsOffset = exports.anchorsInwardOffset = exports.parseAnchor = void 0;
var react_1 = require("react");
var prop_types_1 = require("prop-types");
var constants_1 = require("../constants");
var utils_1 = require("../utils");
var lodash_1 = require("lodash");
/**
 * assumes that the provided path is on the center of start and end element
 * will smartly chose anchor based on given props and will calculate the offset.
 */
var XarrowAnchors = function (props) {
    // let startPoints: t1[];
    // let endPoints: t1[];
    var startAnchors = (0, react_1.useMemo)(function () { return (0, exports.parseAnchor)(props.startAnchor); }, [props.startAnchor]);
    var startPoints = (0, exports.calcAnchors)(startAnchors, props.startElem.position);
    var endAnchors = (0, react_1.useMemo)(function () { return (0, exports.parseAnchor)(props.endAnchor); }, [props.endAnchor]);
    var endPoints = (0, exports.calcAnchors)(endAnchors, props.endElem.position);
    var _a = (0, utils_1.getShortestLine)(startPoints, endPoints), chosenStart = _a.chosenStart, chosenEnd = _a.chosenEnd;
    // alter the state - offset connection points to the selected anchors
    var newGetPath = props.getPathState(function (posSt) {
        posSt.start.x += chosenStart.x - props.startElem.position.x;
        posSt.start.y += chosenStart.y - props.startElem.position.y;
        posSt.end.x += chosenEnd.x - props.endElem.position.x;
        posSt.end.y += chosenEnd.y - props.endElem.position.y;
        return posSt;
    });
    if (!props.children) {
        return <path d={newGetPath()} stroke="black"/>;
    }
    return props.children(newGetPath, { chosenStart: chosenStart, chosenEnd: chosenEnd });
};
var pAnchorPositionType = prop_types_1.default.oneOf(constants_1.cAnchorEdge);
var pAnchorCustomPositionType = prop_types_1.default.exact({
    position: pAnchorPositionType,
    offset: prop_types_1.default.shape({
        x: prop_types_1.default.number,
        y: prop_types_1.default.number,
        inwards: prop_types_1.default.number,
        sidewards: prop_types_1.default.number,
    }),
});
var _pAnchorType = prop_types_1.default.oneOfType([pAnchorPositionType, pAnchorCustomPositionType]);
var pAnchorType = prop_types_1.default.oneOfType([_pAnchorType, prop_types_1.default.arrayOf(_pAnchorType)]);
exports.default = XarrowAnchors;
XarrowAnchors.propTypes = {
    startAnchor: pAnchorType,
    endAnchor: pAnchorType,
};
XarrowAnchors.defaultProps = {
    startAnchor: 'auto',
    endAnchor: 'auto',
};
var parseAnchor = function (anchor) {
    // console.log('parseAnchor');
    // convert to array
    var anchorChoice = Array.isArray(anchor) ? anchor : [anchor];
    //convert to array of objects
    var anchorChoice2 = anchorChoice.map(function (anchorChoice) {
        if (typeof anchorChoice !== 'object') {
            var obj = {
                position: anchorChoice,
            };
            if ((0, utils_1.isRelativeOrAbsStr)(anchorChoice)) {
                obj.position = 'auto';
                lodash_1.default.set(obj, 'offset.sidewards', anchorChoice);
                // obj.offset.sidewards = anchorChoice;
            }
            return obj;
        }
        else {
            // it's object
            if (!('position' in anchorChoice))
                anchorChoice.position = 'auto';
            return anchorChoice;
        }
    });
    //remove any invalid anchor names
    anchorChoice2 = anchorChoice2.filter(function (an) { return (lodash_1.default.isString(an) && (0, utils_1.isPercentStr)(an)) || (lodash_1.default.isObject(an) && constants_1.cAnchorEdge.includes(an === null || an === void 0 ? void 0 : an.position)); });
    if (anchorChoice2.length == 0)
        anchorChoice2 = [{ position: 'auto' }];
    //replace any 'auto' with ['left','right','bottom','top']
    var autosAncs = anchorChoice2.filter(function (an) { return an.position === 'auto'; });
    if (autosAncs.length > 0) {
        anchorChoice2 = anchorChoice2.filter(function (an) { return an.position !== 'auto'; });
        anchorChoice2.push.apply(anchorChoice2, autosAncs.flatMap(function (anchorObj) {
            return ['left', 'right', 'top', 'bottom'].map(function (anchorName) {
                return __assign(__assign({}, anchorObj), { position: anchorName });
            });
        }));
    }
    // default values
    var anchorChoice3 = anchorChoice2.map(function (anchorChoice) {
        var _a, _b, _c, _d;
        if (typeof anchorChoice === 'object') {
            var anchorChoiceCustom = anchorChoice;
            anchorChoiceCustom.offset || (anchorChoiceCustom.offset = { x: 0, y: 0 });
            (_a = anchorChoiceCustom.offset).y || (_a.y = 0);
            (_b = anchorChoiceCustom.offset).x || (_b.x = 0);
            (_c = anchorChoiceCustom.offset).inwards || (_c.inwards = 0);
            (_d = anchorChoiceCustom.offset).sidewards || (_d.sidewards = 0);
            anchorChoiceCustom = anchorChoiceCustom;
            return anchorChoiceCustom;
        }
        else
            return anchorChoice;
    });
    // console.log(anchorChoice3);
    return anchorChoice3;
};
exports.parseAnchor = parseAnchor;
var offsetAnchors = function (anchors, offset) { };
var anchorsDefaultOffsets = {
    middle: { x: 0.5, y: 0.5 },
    left: { x: 0, y: 0.5 },
    right: { x: 1, y: 0.5 },
    top: { x: 0.5, y: 0 },
    bottom: { x: 0.5, y: 1 },
};
exports.anchorsInwardOffset = {
    middle: { x: 0, y: 0 },
    left: { x: 1, y: 0 },
    right: { x: -1, y: 0 },
    top: { x: 0, y: 1 },
    bottom: { x: 0, y: -1 },
};
exports.anchorsSidewardsOffset = {
    middle: { x: 0, y: 0 },
    left: { x: 0, y: -1 },
    right: { x: 0, y: 1 },
    top: { x: 1, y: 0 },
    bottom: { x: -1, y: 0 },
};
var anchorsInwardsDimOffset = {
    middle: { x: 0, y: 0 },
    left: { x: 1, y: 0 },
    right: { x: -1, y: 0 },
    top: { x: 0, y: 1 },
    bottom: { x: 0, y: -1 },
};
var anchorsSidewardsDimOffset = {
    middle: { x: 0, y: 0 },
    left: { x: 0, y: -1 },
    right: { x: 0, y: 1 },
    top: { x: 1, y: 0 },
    bottom: { x: -1, y: 0 },
};
// calcs the offset per each possible anchor
var calcAnchors = function (anchors, anchorPos) {
    // now prepare this list of anchors to object expected by the `getShortestLine` function
    // console.log(anchors);
    var newAnchors = anchors.map(function (anchor) {
        //offsets based anchors names
        //user defined offsets
        var posName = anchor.position;
        anchorPos.width || (anchorPos.width = 0);
        anchorPos.height || (anchorPos.height = 0);
        var xDef = anchorsDefaultOffsets[posName].x * anchorPos.width;
        var yDef = anchorsDefaultOffsets[posName].y * anchorPos.height;
        var _a = (0, utils_1.xStr2absRelative)(anchor.offset.inwards), absInw = _a.abs, relInw = _a.relative;
        var xi = exports.anchorsInwardOffset[posName].x * absInw + anchorsInwardsDimOffset[posName].x * anchorPos.width * relInw;
        var yi = exports.anchorsInwardOffset[posName].y * absInw + anchorsInwardsDimOffset[posName].y * anchorPos.height * relInw;
        var _b = (0, utils_1.xStr2absRelative)(anchor.offset.sidewards), absSidw = _b.abs, relSidw = _b.relative;
        var xsi = exports.anchorsSidewardsOffset[posName].x * absSidw + anchorsSidewardsDimOffset[posName].x * anchorPos.width * relSidw;
        var ysi = exports.anchorsSidewardsOffset[posName].y * absSidw + anchorsSidewardsDimOffset[posName].y * anchorPos.height * relSidw;
        // console.log(anchor.position, xDef, yDef, anchorPos.x, anchorPos.y);
        return {
            x: anchorPos.x + anchor.offset.x + xi + xsi + xDef,
            y: anchorPos.y + anchor.offset.y + yi + ysi + yDef,
            anchor: anchor,
        };
    });
    return newAnchors;
};
exports.calcAnchors = calcAnchors;
// if (require.main === module) {
//   const testAnchors = (anchor) => {
//     const dumyPosition: posType = { x: 0, y: 0, width: 50, height: 50, right: 0, bottom: 0 };
//     const parsedAnchors = parseAnchor(anchor);
//     const points = calcAnchors(parsedAnchors, dumyPosition);
//     return points;
//   };
//   console.log(testAnchors('30%'));
// }
// Properties	Description	default value	type                                                               //
//     start	ref to start element	none(Required!)	string/ReactRef                                        //
// end	ref to end element	none(Required!)	string/ReactRef                                                    //
// startAnchor	from which side the arrow should start from start element	'auto'	string/object/array        // behavior
// endAnchor	at which side the arrow should end at end element	'auto'	string/object/array                // behavior
// labels	optional labels	null	string/array                                                               // enhancement
// color	color of Xarrow(all parts)	'CornflowerBlue'	string                                             // style
// lineColor	color of the line	null	string                                                             // style
// headColor	color of the head	null	string                                                             // style
// tailColor	color of the tail	null	string                                                             // style
// strokeWidth	thickness of Xarrow(all parts)	4	number                                                     // style
// headSize	thickness of head(relative to strokeWidth)	6	number                                             // style
// tailSize	thickness of tail(relative to strokeWidth)	6	number                                             // style
// path	path drawing style	'smooth'	string                                                                 //
// curveness	how much the line curveness when path='smooth'	0.8	number                                     //
// gridBreak	where the line breaks in path='grid'	"50%"	string                                         //
// dashness	should the line be dashed	false	boolean/object                                                 //
// showHead	show the arrow head?	true	boolean                                                            //
// showTail	show the arrow tail?	false	boolean                                                            //
// showXarrow	show Xarrow?	true	boolean                                                                //
// animateDrawing	animate drawing when arrow mounts?	false	boolean/object                                 //
// headShape	shape of the arrow head	'arrow1'	string/object                                              //
// tailShape	shape of the arrow tail	'arrow1'	string/object                                              //
// zIndex	zIndex - Overlapping elements with a larger z-index cover those with a smaller one	0	number     //
