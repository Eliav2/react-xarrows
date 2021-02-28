"use strict";
//// @ts-nocheck
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const lodash_isequal_1 = __importDefault(require("lodash.isequal"));
const lodash_pick_1 = __importDefault(require("lodash.pick"));
const utils_1 = require("./utils");
const prop_types_1 = __importDefault(require("prop-types"));
const buzzier_1 = require("./utils/buzzier");
const anchors_1 = require("./utils/anchors");
const Xarrow = (props) => {
    let { startAnchor, endAnchor, label, color, lineColor, headColor, strokeWidth, headSize, path, curveness, dashness, passProps, SVGcanvasProps, arrowBodyProps, arrowHeadProps, divContainerProps, SVGcanvasStyle, divContainerStyle, extendSVGcanvas } = props, extraProps = __rest(props, ["startAnchor", "endAnchor", "label", "color", "lineColor", "headColor", "strokeWidth", "headSize", "path", "curveness", "dashness", "passProps", "SVGcanvasProps", "arrowBodyProps", "arrowHeadProps", "divContainerProps", "SVGcanvasStyle", "divContainerStyle", "extendSVGcanvas"]);
    const selfRef = react_1.useRef(null);
    const [anchorsRefs, setAnchorsRefs] = react_1.useState({ start: null, end: null });
    const [prevPosState, setPrevPosState] = react_1.useState(null);
    const [prevProps, setPrevProps] = react_1.useState(null);
    /**
     * determine a an update is needed and update if so.
     * update is needed if one of the connected elements position was changed since last render, or if the ref to one
     * of the elements has changed(it points to a different element).
     */
    const updateIfNeeded = () => {
        // check if anchors refs changed
        const start = utils_1.getElementByPropGiven(props.start);
        const end = utils_1.getElementByPropGiven(props.end);
        // in case one of the elements does not mounted skip any update
        if (start == null || end == null)
            return;
        // if anchors changed re-set them
        if (!lodash_isequal_1.default(anchorsRefs, { start, end })) {
            initAnchorsRefs();
        }
        else if (!lodash_isequal_1.default(props, prevProps)) {
            //first check if any properties changed
            if (prevProps) {
                initProps();
                let posState = getAnchorsPos();
                setPrevPosState(posState);
                updatePosition(posState);
            }
        }
        else {
            //if the properties did not changed - update position if needed
            let posState = getAnchorsPos();
            if (!lodash_isequal_1.default(prevPosState, posState)) {
                setPrevPosState(posState);
                updatePosition(posState);
            }
        }
    };
    const initAnchorsRefs = () => {
        const start = utils_1.getElementByPropGiven(props.start);
        const end = utils_1.getElementByPropGiven(props.end);
        setAnchorsRefs({ start, end });
    };
    const initProps = () => {
        setPrevProps(props);
    };
    react_1.useEffect(() => {
        // console.log("xarrow mounted");
        initProps();
        initAnchorsRefs();
    }, []);
    react_1.useLayoutEffect(() => {
        // console.log("xarrow rendered!");
        updateIfNeeded();
    });
    const [st, setSt] = react_1.useState({
        //initial state
        cx0: 0,
        cy0: 0,
        cw: 0,
        ch: 0,
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,
        dx: 0,
        dy: 0,
        absDx: 0,
        absDy: 0,
        cpx1: 0,
        cpy1: 0,
        cpx2: 0,
        cpy2: 0,
        headOrient: 0,
        labelStartPos: { x: 0, y: 0 },
        labelMiddlePos: { x: 0, y: 0 },
        labelEndPos: { x: 0, y: 0 },
        arrowEnd: { x: 0, y: 0 },
        arrowHeadOffset: { x: 0, y: 0 },
        headOffset: 0,
        excRight: 0,
        excLeft: 0,
        excUp: 0,
        excDown: 0,
    });
    headSize = Number(headSize);
    strokeWidth = Number(strokeWidth);
    headColor = headColor ? headColor : color;
    lineColor = lineColor ? lineColor : color;
    let dashStroke = 0, dashNone = 0, animationSpeed, animationDirection = 1;
    if (dashness) {
        if (typeof dashness === "object") {
            dashStroke = dashness.strokeLen
                ? Number(dashness.strokeLen)
                : Number(strokeWidth) * 2;
            dashNone = dashness.strokeLen
                ? Number(dashness.nonStrokeLen)
                : Number(strokeWidth);
            animationSpeed = dashness.animation ? Number(dashness.animation) : null;
        }
        else if (typeof dashness === "boolean") {
            dashStroke = Number(strokeWidth) * 2;
            dashNone = Number(strokeWidth);
            animationSpeed = null;
        }
    }
    let dashoffset = dashStroke + dashNone;
    if (animationSpeed < 0) {
        animationSpeed *= -1;
        animationDirection = -1;
    }
    let labelStart = null, labelMiddle = null, labelEnd = null;
    if (label) {
        if (typeof label === "string" || "type" in label)
            labelMiddle = label;
        else if (["start", "middle", "end"].some((key) => key in label)) {
            label = label;
            ({ start: labelStart, middle: labelMiddle, end: labelEnd } = label);
        }
    }
    const getSelfPos = () => {
        let { left: xarrowElemX, top: xarrowElemY, } = selfRef.current.getBoundingClientRect();
        let xarrowStyle = getComputedStyle(selfRef.current);
        let xarrowStyleLeft = Number(xarrowStyle.left.slice(0, -2));
        let xarrowStyleTop = Number(xarrowStyle.top.slice(0, -2));
        return {
            x: xarrowElemX - xarrowStyleLeft,
            y: xarrowElemY - xarrowStyleTop,
        };
    };
    const getAnchorsPos = () => {
        let s = anchorsRefs.start.getBoundingClientRect();
        let e = anchorsRefs.end.getBoundingClientRect();
        return {
            start: {
                x: s.left,
                y: s.top,
                right: s.right,
                bottom: s.bottom,
            },
            end: {
                x: e.left,
                y: e.top,
                right: e.right,
                bottom: e.bottom,
            },
        };
    };
    /**
     * The Main logic of path calculation for the arrow.
     * calculate new path and adjust canvas based on given properties.
     * */
    const updatePosition = (positions) => {
        let { start: sPos } = positions;
        let { end: ePos } = positions;
        let headOrient = 0;
        // convert startAnchor and endAnchor to list of objects represents allowed anchors.
        let startPointsObj = anchors_1.prepareAnchorLines(startAnchor, sPos);
        let endPointsObj = anchors_1.prepareAnchorLines(endAnchor, ePos);
        // choose the smallest path for 2 points from these possibilities.
        let { startPointObj, endPointObj } = anchors_1.getShortestLine(startPointsObj, endPointsObj);
        let startAnchorPosition = startPointObj.anchorPosition, endAnchorPosition = endPointObj.anchorPosition;
        let startPoint = lodash_pick_1.default(startPointObj, ["x", "y"]), endPoint = lodash_pick_1.default(endPointObj, ["x", "y"]);
        let xarrowElemPos = getSelfPos();
        let cx0 = Math.min(startPoint.x, endPoint.x) - xarrowElemPos.x;
        let cy0 = Math.min(startPoint.y, endPoint.y) - xarrowElemPos.y;
        let dx = endPoint.x - startPoint.x;
        let dy = endPoint.y - startPoint.y;
        let absDx = Math.abs(endPoint.x - startPoint.x);
        let absDy = Math.abs(endPoint.y - startPoint.y);
        let xSign = dx > 0 ? 1 : -1;
        let ySign = dy > 0 ? 1 : -1;
        let headOffset = ((headSize * 3) / 4) * strokeWidth;
        let cu = Number(curveness);
        if (path === "straight") {
            cu = 0;
            path = "smooth";
        }
        let excRight = strokeWidth + (strokeWidth * headSize) / 2;
        let excLeft = strokeWidth + (strokeWidth * headSize) / 2;
        let excUp = strokeWidth + (strokeWidth * headSize) / 2;
        let excDown = strokeWidth + (strokeWidth * headSize) / 2;
        excLeft += Number(extendSVGcanvas);
        excRight += Number(extendSVGcanvas);
        excUp += Number(extendSVGcanvas);
        excDown += Number(extendSVGcanvas);
        ////////////////////////////////////
        // arrow point to point calculations
        let x1 = 0, x2 = absDx, y1 = 0, y2 = absDy;
        if (dx < 0)
            [x1, x2] = [x2, x1];
        if (dy < 0)
            [y1, y2] = [y2, y1];
        ////////////////////////////////////
        // arrow curviness and arrowhead placement calculations
        let xHeadOffset = 0;
        let yHeadOffset = 0;
        if (cu === 0) {
            // in case of straight path
            let headAngel = Math.atan(absDy / absDx);
            x2 -= headOffset * xSign * Math.cos(headAngel);
            y2 -= headOffset * ySign * Math.sin(headAngel);
            // cpx2 -= headOffset * xSign * Math.cos(headAngel);
            // cpy2 -= headOffset * ySign * Math.sin(headAngel);
            headAngel *= ySign;
            if (xSign < 0)
                headAngel = (Math.PI - headAngel * xSign) * xSign;
            xHeadOffset =
                (Math.cos(headAngel) * headOffset) / 3 -
                    (Math.sin(headAngel) * (headSize * strokeWidth)) / 2;
            yHeadOffset =
                (Math.cos(headAngel) * (headSize * strokeWidth)) / 2 +
                    (Math.sin(headAngel) * headOffset) / 3;
            headOrient = (headAngel * 180) / Math.PI;
        }
        else {
            // in case of smooth path
            if (endAnchorPosition === "middle") {
                // in case a middle anchor is chosen for endAnchor choose from which side to attach to the middle of the element
                if (absDx > absDy) {
                    endAnchorPosition = xSign ? "left" : "right";
                }
                else {
                    endAnchorPosition = ySign ? "top" : "bottom";
                }
            }
            if (["left", "right"].includes(endAnchorPosition)) {
                x2 -= headOffset * xSign;
                // cpx2 -= headOffset * xSign * 2;
                // cpx1 += headOffset * xSign;
                xHeadOffset = (headOffset * xSign) / 3;
                yHeadOffset = (headSize * strokeWidth * xSign) / 2;
                if (endAnchorPosition === "left") {
                    headOrient = 0;
                    if (xSign < 0)
                        headOrient += 180;
                }
                else {
                    headOrient = 180;
                    if (xSign > 0)
                        headOrient += 180;
                }
            }
            else if (["top", "bottom"].includes(endAnchorPosition)) {
                yHeadOffset = (headOffset * ySign) / 3;
                xHeadOffset = (headSize * strokeWidth * -ySign) / 2;
                y2 -= headOffset * ySign;
                // cpy1 += headOffset * ySign;
                // cpy2 -= headOffset * ySign;
                if (endAnchorPosition === "top") {
                    headOrient = 270;
                    if (ySign > 0)
                        headOrient += 180;
                }
                else {
                    headOrient = 90;
                    if (ySign < 0)
                        headOrient += 180;
                }
            }
        }
        // if (endAnchorPosition == startAnchorPosition) headOrient += 180;
        let arrowHeadOffset = { x: xHeadOffset, y: yHeadOffset };
        let cpx1 = x1, cpy1 = y1, cpx2 = x2, cpy2 = y2;
        let curvesPossibilities = {};
        if (path === "smooth")
            curvesPossibilities = {
                hh: () => {
                    //horizontal - from right to left or the opposite
                    cpx1 += absDx * cu * xSign;
                    cpx2 -= absDx * cu * xSign;
                    // if (absDx < 2 * headOffset) {
                    //   cpx1 += headOffset * xSign - absDx / 2;
                    //   cpx2 -= headOffset * xSign * 2 - absDx;
                    // }
                    // cpx1 += headOffset * 2 * xSign;
                    // cpx2 -= headOffset * 2 * xSign;
                },
                vv: () => {
                    //vertical - from top to bottom or opposite
                    cpy1 += absDy * cu * ySign;
                    cpy2 -= absDy * cu * ySign;
                    // cpy1 += headOffset * 2 * ySign;
                    // cpy2 -= headOffset * 2 * ySign;
                },
                hv: () => {
                    // start horizontally then vertically
                    // from v side to h side
                    cpx1 += absDx * cu * xSign;
                    cpy2 -= absDy * cu * ySign;
                },
                vh: () => {
                    // start vertically then horizontally
                    // from h side to v side
                    cpy1 += absDy * cu * ySign;
                    cpx2 -= absDx * cu * xSign;
                },
            };
        else if (path === "grid") {
            curvesPossibilities = {
                hh: () => {
                    cpx1 += (absDx * 0.5 - headOffset / 2) * xSign;
                    cpx2 -= (absDx * 0.5 - headOffset / 2) * xSign;
                },
                vv: () => {
                    cpy1 += (absDy * 0.5 - headOffset / 2) * ySign;
                    cpy2 -= (absDy * 0.5 - headOffset / 2) * ySign;
                },
                hv: () => {
                    cpx1 = x2;
                },
                vh: () => {
                    cpy1 = y2;
                },
            };
        }
        // smart select best curve for the current anchors
        let selectedCurviness = "";
        if (["left", "right"].includes(startAnchorPosition))
            selectedCurviness += "h";
        else if (["bottom", "top"].includes(startAnchorPosition))
            selectedCurviness += "v";
        else if (startAnchorPosition === "middle")
            selectedCurviness += "m";
        if (["left", "right"].includes(endAnchorPosition))
            selectedCurviness += "h";
        else if (["bottom", "top"].includes(endAnchorPosition))
            selectedCurviness += "v";
        else if (endAnchorPosition === "middle")
            selectedCurviness += "m";
        if (absDx > absDy)
            selectedCurviness = selectedCurviness.replace(/m/g, "h");
        else
            selectedCurviness = selectedCurviness.replace(/m/g, "v");
        curvesPossibilities[selectedCurviness]();
        ////////////////////////////////////
        // canvas smart size adjustments
        const [xSol1, xSol2] = buzzier_1.buzzierMinSols(x1, cpx1, cpx2, x2);
        const [ySol1, ySol2] = buzzier_1.buzzierMinSols(y1, cpy1, cpy2, y2);
        if (xSol1 < 0)
            excLeft += -xSol1;
        if (xSol2 > absDx)
            excRight += xSol2 - absDx;
        if (ySol1 < 0)
            excUp += -ySol1;
        if (ySol2 > absDy)
            excDown += ySol2 - absDy;
        x1 += excLeft;
        x2 += excLeft;
        y1 += excUp;
        y2 += excUp;
        cpx1 += excLeft;
        cpx2 += excLeft;
        cpy1 += excUp;
        cpy2 += excUp;
        const cw = absDx + excLeft + excRight, ch = absDy + excUp + excDown;
        cx0 -= excLeft;
        cy0 -= excUp;
        //labels
        const bzx = buzzier_1.bzFunction(x1, cpx1, cpx2, x2);
        const bzy = buzzier_1.bzFunction(y1, cpy1, cpy2, y2);
        const labelStartPos = { x: bzx(0.01), y: bzy(0.01) };
        const labelMiddlePos = { x: bzx(0.5), y: bzy(0.5) };
        const labelEndPos = { x: bzx(0.99), y: bzy(0.99) };
        const arrowEnd = { x: bzx(1), y: bzy(1) };
        setSt({
            cx0,
            cy0,
            x1,
            x2,
            y1,
            y2,
            cw,
            ch,
            cpx1,
            cpy1,
            cpx2,
            cpy2,
            dx,
            dy,
            absDx,
            absDy,
            headOrient,
            labelStartPos,
            labelMiddlePos,
            labelEndPos,
            arrowEnd,
            excLeft,
            excRight,
            excUp,
            excDown,
            headOffset,
            arrowHeadOffset,
        });
    };
    const fHeadSize = headSize * strokeWidth; //factored head size
    const xOffsetHead = st.x2 - st.arrowHeadOffset.x;
    const yOffsetHead = st.y2 - st.arrowHeadOffset.y;
    let arrowPath = `M ${st.x1} ${st.y1} C ${st.cpx1} ${st.cpy1}, ${st.cpx2} ${st.cpy2}, ${st.x2} ${st.y2} `;
    if (path === "straight")
        arrowPath = `M ${st.x1} ${st.y1}  ${st.x2} ${st.y2}`;
    if (path === "grid")
        arrowPath = `M ${st.x1} ${st.y1} L  ${st.cpx1} ${st.cpy1} L ${st.cpx2} ${st.cpy2} L  ${st.x2} ${st.y2}`;
    return (react_1.default.createElement("div", Object.assign({}, divContainerProps, { style: Object.assign({ position: "absolute" }, divContainerStyle) }, extraProps),
        react_1.default.createElement("svg", Object.assign({ ref: selfRef, width: st.cw, height: st.ch, style: Object.assign({ position: "absolute", left: st.cx0, top: st.cy0, pointerEvents: "none" }, SVGcanvasStyle), overflow: "auto" }, SVGcanvasProps),
            react_1.default.createElement("path", Object.assign({ d: arrowPath, stroke: lineColor, strokeDasharray: `${dashStroke} ${dashNone}`, strokeWidth: strokeWidth, fill: "transparent", 
                // markerEnd={`url(#${arrowHeadId})`}
                pointerEvents: "visibleStroke" }, passProps, arrowBodyProps), animationSpeed ? (react_1.default.createElement("animate", { attributeName: "stroke-dashoffset", values: `${dashoffset * animationDirection};0`, dur: `${1 / animationSpeed}s`, repeatCount: "indefinite" })) : null),
            react_1.default.createElement("path", Object.assign({ d: `M 0 0 L ${fHeadSize} ${fHeadSize / 2} L 0 ${fHeadSize} L ${fHeadSize / 4} ${fHeadSize / 2} z`, fill: headColor, 
                // pointerEvents="all"
                transform: `translate(${xOffsetHead},${yOffsetHead}) rotate(${st.headOrient})` }, passProps, arrowHeadProps))),
        labelStart ? (react_1.default.createElement("div", { style: {
                transform: st.dx < 0 ? "translate(-100% , -50%)" : "translate(-0% , -50%)",
                width: "max-content",
                position: "absolute",
                left: st.cx0 + st.labelStartPos.x,
                top: st.cy0 + st.labelStartPos.y - strokeWidth - 5,
            } }, labelStart)) : null,
        labelMiddle ? (react_1.default.createElement("div", { style: {
                display: "table",
                width: "max-content",
                transform: "translate(-50% , -50%)",
                position: "absolute",
                left: st.cx0 + st.labelMiddlePos.x,
                top: st.cy0 + st.labelMiddlePos.y,
            } }, labelMiddle)) : null,
        labelEnd ? (react_1.default.createElement("div", { style: {
                transform: st.dx > 0 ? "translate(-100% , -50%)" : "translate(-0% , -50%)",
                width: "max-content",
                position: "absolute",
                left: st.cx0 + st.labelEndPos.x,
                top: st.cy0 + st.labelEndPos.y + strokeWidth + 5,
            } }, labelEnd)) : null));
};
const pAnchorPositionType = prop_types_1.default.oneOf([
    "middle",
    "left",
    "right",
    "top",
    "bottom",
    "auto",
]);
const pAnchorCustomPositionType = prop_types_1.default.shape({
    position: pAnchorPositionType.isRequired,
    offset: prop_types_1.default.shape({
        rightness: prop_types_1.default.number,
        bottomness: prop_types_1.default.number,
    }),
});
const pAnchorType = prop_types_1.default.oneOfType([
    pAnchorPositionType,
    pAnchorCustomPositionType,
    prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([pAnchorPositionType, pAnchorCustomPositionType])),
]);
const pRefType = prop_types_1.default.oneOfType([prop_types_1.default.string, prop_types_1.default.object]);
Xarrow.propTypes = {
    start: pRefType.isRequired,
    end: pRefType.isRequired,
    startAnchor: pAnchorType,
    endAnchor: pAnchorType,
    label: prop_types_1.default.oneOfType([prop_types_1.default.elementType, prop_types_1.default.object]),
    color: prop_types_1.default.string,
    lineColor: prop_types_1.default.string,
    headColor: prop_types_1.default.string,
    strokeWidth: prop_types_1.default.number,
    headSize: prop_types_1.default.number,
    path: prop_types_1.default.oneOf(["smooth", "grid", "straight"]),
    curveness: prop_types_1.default.number,
    dashness: prop_types_1.default.oneOfType([prop_types_1.default.bool, prop_types_1.default.object]),
    passProps: prop_types_1.default.object,
    arrowBodyProps: prop_types_1.default.object,
    arrowHeadProps: prop_types_1.default.object,
    SVGcanvasProps: prop_types_1.default.object,
    divContainerProps: prop_types_1.default.object,
    extendSVGcanvas: prop_types_1.default.number,
};
Xarrow.defaultProps = {
    startAnchor: "auto",
    endAnchor: "auto",
    label: null,
    color: "CornflowerBlue",
    lineColor: null,
    headColor: null,
    strokeWidth: 4,
    headSize: 6,
    path: "smooth",
    curveness: 0.8,
    dashness: false,
    passProps: {},
    arrowBodyProps: {},
    arrowHeadProps: {},
    SVGcanvasProps: {},
    divContainerProps: {},
    extendSVGcanvas: 0,
};
exports.default = Xarrow;
//# sourceMappingURL=index.js.map