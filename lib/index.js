import React, { useRef, useEffect, useState } from "react";
import lodash from "lodash";
const findCommonAncestor = (elem, elem2) => {
    function parents(node) {
        var nodes = [node];
        for (; node; node = node.parentNode) {
            nodes.unshift(node);
        }
        return nodes;
    }
    function commonAncestor(node1, node2) {
        var parents1 = parents(node1);
        var parents2 = parents(node2);
        if (parents1[0] !== parents2[0])
            throw new Error("No common ancestor!");
        for (var i = 0; i < parents1.length; i++) {
            if (parents1[i] !== parents2[i])
                return parents1[i - 1];
        }
    }
    return commonAncestor(elem, elem2);
};
// const findAllParents = (elem: HTMLElement) => {
//   let parents: HTMLElement[] = [];
//   let parent = elem;
//   while (true) {
//     if (parent.parentElement === null) return parents;
//     else parent = parent.parentElement;
//     parents.push(parent);
//   }
// };
const findAllChildrens = (child, parent) => {
    if (child === parent)
        return [];
    let childrens = [];
    let childParent = child.parentElement;
    while (childParent !== parent) {
        childrens.push(childParent);
        childParent = childParent.parentElement;
    }
    return childrens;
};
const getElementByPropGiven = (ref) => {
    var myRef;
    if (typeof ref === "string") {
        myRef = document.getElementById(ref);
        if (myRef === null)
            throw Error(`'${ref}' is not an id of element in the dom. make sure you provided currect id or provide a React reference to element instead.`);
    }
    else
        myRef = ref.current;
    if (myRef === null)
        throw Error(`'${ref}' is not a valid react reference to html element
OR
you tried to render Xarrow before one of the anchors.
please provide correct react refernce or provide id instead.`);
    return myRef;
};
const Xarrow = (props) => {
    const selfRef = useRef(null);
    const [anchorsRefs, setAnchorsRefs] = useState({ start: null, end: null });
    const [prevPosState, setPrevPosState] = useState(null);
    const [prevProps, setPrevProps] = useState(null);
    // const [selfParents, setSelfParents] = useState<HTMLElement[]>(null); //list parents of the common ascestor of the arrow with start and end(until "root elemnt")
    const [anchorsParents, setAnchorsParents] = useState(null); //list childrens of the common ascestor of the arrow with start and end until start or end
    const [commonAncestor, setCommonAncestor] = useState(null); //list childrens of the common ascestor of the arrow with start and end until start or end
    // const [xarrowElemPos, setXarrowElemPos] = useState<point>({ x: 0, y: 0 });
    // const [prevXarrowElemPos, setPrevXarrowElemPos] = useState<point>({ x: 0, y: 0 });
    const updateIfNeeded = () => {
        if (!lodash.isEqual(props, prevProps)) {
            //first check if any properties changed
            if (prevProps) {
                initProps();
                setPrevPosState(getAnchorsPos());
            }
        }
        else {
            //if the properties did not changed - update position if needed
            let posState = getAnchorsPos();
            if (!lodash.isEqual(prevPosState, posState)) {
                setPrevPosState(posState);
            }
        }
    };
    const monitorDOMchanges = () => {
        [...anchorsParents.start, ...anchorsParents.end].forEach((elem) => {
            elem.addEventListener("scroll", updateIfNeeded);
        });
        window.addEventListener("resize", updateIfNeeded);
        if (window.getComputedStyle(commonAncestor).position !== "relative")
            commonAncestor.addEventListener("scroll", updateIfNeeded);
    };
    const cleanMonitorDOMchanges = () => {
        [...anchorsParents.start, ...anchorsParents.end].forEach((elem) => {
            elem.removeEventListener("scroll", updateIfNeeded);
        });
        window.removeEventListener("resize", updateIfNeeded);
        if (window.getComputedStyle(commonAncestor).position === "relative")
            commonAncestor.removeEventListener("scroll", updateIfNeeded);
    };
    const initParentsChildrens = () => {
        let anchorsCommonAncestor = findCommonAncestor(anchorsRefs.start, anchorsRefs.end);
        let allAncestor = findCommonAncestor(anchorsCommonAncestor, selfRef.current);
        let allAncestorChildrensStart = findAllChildrens(anchorsRefs.start, allAncestor);
        let allAncestorChildrensEnd = findAllChildrens(anchorsRefs.end, allAncestor);
        setCommonAncestor(allAncestor);
        setAnchorsParents({
            start: allAncestorChildrensStart,
            end: allAncestorChildrensEnd,
        });
        let allAncestorPosStyle = window.getComputedStyle(allAncestor).position;
        if (props.consoleWarning) {
            if (allAncestorPosStyle !== "relative" &&
                (allAncestor.scrollHeight > allAncestor.clientHeight || allAncestor.scrollWidth > allAncestor.clientWidth))
                console.warn(`Xarrow warning: it is recomnded to set common ancestor positioning style to 'relative',this will prevent rerender on every scroll event. 
        change position style from '${allAncestorPosStyle}' to 'relative' of element `, allAncestor);
            if (selfRef.current.parentElement !== anchorsCommonAncestor)
                console.warn(`Xarrow warning: you placed Xarrow not as son of the common ancestor of 'start' component and 'end' component.
          the suggested element to put Xarrow inside of to prevent redundant rerenders is `, anchorsCommonAncestor, `if this was your intention set monitorDOMchanges to true so Xarrow will render whenever relevant DOM events are triggerd.
          to disable this warnings set consoleWarning property to false`);
            if ((allAncestorChildrensStart.length > 0 || allAncestorChildrensEnd.length > 0) &&
                props.monitorDOMchanges === false)
                console.warn(`Xarrow warning: set monitorDOMchanges to true - its possible that the positioning will get out of sync on DOM events(like scroll),
        on these elements`, lodash.uniqWith([...allAncestorChildrensStart, ...allAncestorChildrensEnd], lodash.isEqual), `\nto disable this warnings set consoleWarning property to false`);
        }
    };
    const testUserGivenProperties = () => {
        const typeOf = (arg) => {
            let type = typeof arg;
            if (type === "object") {
                if (arg === null)
                    type = "null";
                else if (Array.isArray(arg))
                    type = "array";
            }
            return type;
        };
        const throwError = (errorMsg, consoleMsg) => {
            let err = Error("Xarrows: " + errorMsg);
            if (consoleMsg)
                console.error("xarrow error: ", ...consoleMsg);
            throw err;
        };
        const typeCheck = (arg, allowedTypes, name) => {
            if (!allowedTypes.includes(typeOf(arg))) {
                throwError(`'${name}' property error.`, [
                    `'${name}' property should be from type ${allowedTypes.join(" or ")}, not`,
                    typeOf(arg),
                ]);
            }
        };
        const valueCheck = (value, allowedValues, name) => {
            if (!allowedValues.includes(value)) {
                throwError(`'${name}' property error.`, [
                    `${name} =`,
                    value,
                    ` but ${name} prop should be '${allowedValues.join("' or '")}', not`,
                    "'" + value + "'",
                ]);
            }
        };
        const checkRef = (ref, name) => {
            typeCheck(ref, ["object", "string"], name);
            if (typeOf(ref) === "object") {
                if (!("current" in ref))
                    throwError(`'${name}' property error.`, [
                        `${name}=`,
                        ref,
                        `but '${name}' is not of type reference. maybe you set '${name}' property to other object and not to React reference?`,
                    ]);
                if (ref.current === null)
                    throwError(`'${name}' property error`, [
                        `Make sure the reference to ${name} anchor are provided correctly.
                maybe you tried to render Xarrow before ${name} anchor?`,
                    ]);
            }
        };
        const checkAnchor = (anchor, name) => {
            typeCheck(anchor, ["string", "array"], name);
            if (typeOf(anchor) === "string")
                valueCheck(anchor, ["auto", "left", "right", "top", "bottom", "middle"], name);
            else if (typeOf(anchor) === "array")
                anchor.forEach((an) => valueCheck(an, ["auto", "left", "right", "top", "bottom", "middle"], name));
        };
        checkRef(props.start, "start");
        checkRef(props.end, "end");
        checkAnchor(props.startAnchor, "startAnchor");
        checkAnchor(props.endAnchor, "endAnchor");
        // const objectTypeCheck = (
        //   obj: object,
        //   requiredProps: object,
        //   optionalProps: object,
        //   objName: string
        // ) => {
        //   for (let optPropKey in optionalProps) {
        //     if (optPropKey in obj) {
        //       if (typeOf(obj[optPropKey]) !== optionalProps[optPropKey])
        //         throwError("error in object " + objName, [
        //           optPropKey,
        //           " in object",
        //           obj,
        //           "is of type",
        //           typeOf(obj[optPropKey]),
        //           "instead ",
        //           optionalProps[optPropKey]
        //         ]);
        //     }
        //   }
        //   for (let reqPropKey in requiredProps) {
        //     if (reqPropKey in obj) {
        //       if (typeOf(obj[reqPropKey]) !== requiredProps[reqPropKey])
        //         throwError("", [
        //           reqPropKey,
        //           "in object",
        //           obj,
        //           "is of type",
        //           typeOf(obj[reqPropKey]),
        //           "instead",
        //           requiredProps[reqPropKey]
        //         ]);
        //     } else {
        //       throwError("", ["key", reqPropKey, "is missing from", obj]);
        //     }
        //   }
        // };
        // const checkLabelType = label => {
        //   typeCheck(label, ["string", "object"], "label");
        //   if (typeOf(label) === "object") {
        //     objectTypeCheck(label, { text: "string" }, { extra: "object" }, "label");
        //   }
        // };
        // const checkLabel = label => {
        //   console.log("?", label);
        //   typeCheck(label, ["string", "object"], "label");
        //   if (typeOf(label) === "object") {
        //     let keys = Object.keys(label);
        //     if (keys.some(key => ["start", "middle", "end"].includes(key))) {
        //       for (let labelPos in ["start", "middle", "end"]) {
        //         if (labelPos in label) checkLabelType(label[labelPos]);
        //       }
        //     } else if (keys.some(key => ["text", "extra"].includes(key))) checkLabelType(label);
        //   } else
        //     throwError(`'label' property error`, [props.label, "in not the expected label object."]);
        // };
        // if (props.label) {
        //   checkLabel(props.label);
        // }
        // const arraySmartIncludes = (arg, array) => {
        //   let match = false;
        //   array.forEach(a => {
        //     if (lodash.isEqual(arg, a)) match = true;
        //   });
        //   return match;
        // };
    };
    const triggerUpdate = (callback) => {
        updateIfNeeded();
        if (callback)
            callback();
    };
    const initRegisterEvents = () => {
        props.registerEvents.forEach((re) => {
            var ref = getElementByPropGiven(re.ref);
            ref.addEventListener(re.eventName, () => triggerUpdate(re.callback));
        });
    };
    const cleanRegisterEvents = () => {
        props.registerEvents.forEach((re) => {
            var ref = getElementByPropGiven(re.ref);
            ref.removeEventListener(re.eventName, () => triggerUpdate(re.callback));
        });
    };
    const initAnchorsRefs = () => {
        var start = getElementByPropGiven(props.start);
        var end = getElementByPropGiven(props.end);
        setAnchorsRefs({ start, end });
    };
    const initProps = () => {
        testUserGivenProperties();
        // initXarrowElemPos();
        setPrevProps(props);
    };
    useEffect(() => {
        // equilavent to componentDidMount
        // console.log("xarrow mounted");
        initProps();
        initRegisterEvents();
        initAnchorsRefs();
        return () => {
            // console.log("xarrow unmounted");
            cleanRegisterEvents();
        };
    }, []);
    useEffect(() => {
        // Heppens only at mounting (or props changed) after anchorsRefs initialized
        if (anchorsRefs.start) {
            initParentsChildrens();
        }
    }, [anchorsRefs]);
    useEffect(() => {
        // heppens only at mounting after anchorsParents initialized
        if (anchorsParents && props.monitorDOMchanges) {
            monitorDOMchanges();
            return () => {
                //cleanUp it unmounting!
                cleanMonitorDOMchanges();
            };
        }
    }, [anchorsParents]);
    useEffect(() => {
        // triggers position update when prevPosState changed(can heppen in any render)
        if (prevPosState)
            updatePosition(prevPosState);
    }, [prevPosState]);
    useEffect(() => {
        // console.log("xarrow rendered!");
        updateIfNeeded();
    });
    const [st, setSt] = useState({
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
        headOrient: "auto",
        labelStartPos: { x: 0, y: 0 },
        labelMiddlePos: { x: 0, y: 0 },
        labelEndPos: { x: 0, y: 0 },
        excRight: 0,
        excLeft: 0,
        excUp: 0,
        excDown: 0,
    });
    let { color, lineColor, headColor, headSize, strokeWidth, dashness } = props;
    headSize = Number(headSize);
    strokeWidth = Number(strokeWidth);
    headColor = headColor ? headColor : color;
    lineColor = lineColor ? lineColor : color;
    let dashStroke = 0, dashNone = 0, animationSpeed, animationDirection = 1;
    if (dashness) {
        if (typeof dashness === "object") {
            dashStroke = dashness.strokeLen ? Number(dashness.strokeLen) : Number(strokeWidth) * 2;
            dashNone = dashness.strokeLen ? Number(dashness.nonStrokeLen) : Number(strokeWidth);
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
    const isLabelPropsType = (label) => {
        return label.text !== undefined;
    };
    let labelStart, labelMiddle, labelEnd;
    let labelStartExtra = {}, labelMiddleExtra = {}, labelEndExtra = {};
    let labalCanvExtraY = 0;
    if (props.label) {
        labalCanvExtraY = 14;
        if (typeof props.label === "string")
            labelMiddle = props.label;
        else if (typeof props.label === "object") {
            if (isLabelPropsType(props.label)) {
                console.log(props.label);
                labelMiddle = props.label;
                labelMiddleExtra = labelMiddle.extra;
                labelMiddle = labelMiddle.text;
            }
            else {
                labelStart = props.label.start;
                labelMiddle = props.label.middle;
                labelEnd = props.label.end;
                if (typeof labelStart === "object") {
                    labelStartExtra = labelStart.extra;
                    labelStart = labelStart.text;
                }
                if (typeof labelMiddle === "object") {
                    labelMiddleExtra = labelMiddle.extra;
                    labelMiddle = labelMiddle.text;
                }
                if (typeof labelEnd === "object") {
                    labelEndExtra = labelEnd.extra;
                    labelEnd = labelEnd.text;
                }
            }
        }
    }
    let labalCanvExtraX = Math.max(labelStart ? labelStart.length : 0, labelMiddle ? labelMiddle.length : 0, labelEnd ? labelEnd.length : 0);
    const getSelfPos = () => {
        let { x: xarrowElemX, y: xarrowElemY } = selfRef.current.getBoundingClientRect();
        let xarrowStyle = getComputedStyle(selfRef.current);
        let xarrowStyleLeft = Number(xarrowStyle.left.slice(0, -2));
        let xarrowStyleTop = Number(xarrowStyle.top.slice(0, -2));
        return { x: xarrowElemX - xarrowStyleLeft, y: xarrowElemY - xarrowStyleTop };
    };
    const getAnchorsPos = () => {
        if (!anchorsRefs.start)
            return;
        let s = anchorsRefs.start.getBoundingClientRect();
        let e = anchorsRefs.end.getBoundingClientRect();
        let yOffset = 0;
        let xOffset = 0;
        return {
            start: {
                x: s.x + xOffset,
                y: s.y + yOffset,
                right: s.right + xOffset,
                bottom: s.bottom + yOffset,
            },
            end: {
                x: e.x + xOffset,
                y: e.y + yOffset,
                right: e.right + xOffset,
                bottom: e.bottom + yOffset,
            },
        };
    };
    // let userCanvExtra = props.advanced.extendSVGcanvas;
    // const extraCanvasSize = {
    //   excx: (strokeWidth * headSize) / 2,
    //   excy: (strokeWidth * headSize) / 2
    // };
    // var { excx, excy } = extraCanvasSize;
    // excy += labalCanvExtraY;
    // excx += userCanvExtra;
    // excy += userCanvExtra;
    const updatePosition = (positions) => {
        // Do NOT call thie function directly.
        // you should set position by 'setPrevPosState(posState)' and that will trigger
        // this function in the useEffect hook.
        let { start: s } = positions;
        let { end: e } = positions;
        let headOrient = "auto";
        const getAnchorOffset = (width, height) => {
            return {
                middle: { rightness: width * 0.5, bottomness: height * 0.5 },
                left: { rightness: 0, bottomness: height * 0.5 },
                right: { rightness: width, bottomness: height * 0.5 },
                top: { rightness: width * 0.5, bottomness: 0 },
                bottom: { rightness: width * 0.5, bottomness: height },
            };
        };
        let startAnchorOffsets = getAnchorOffset(s.right - s.x, s.bottom - s.y);
        let endAnchorOffsets = getAnchorOffset(e.right - e.x, e.bottom - e.y);
        let startAnchorChoice = Array.isArray(props.startAnchor) ? props.startAnchor : [props.startAnchor];
        let endAnchorChoice = Array.isArray(props.endAnchor) ? props.endAnchor : [props.endAnchor];
        let startAnchorPossabilities = {};
        let endAnchorPossabilities = {};
        if (startAnchorChoice.includes("auto"))
            ["left", "right", "top", "bottom"].forEach((anchor) => (startAnchorPossabilities[anchor] = startAnchorOffsets[anchor]));
        else {
            startAnchorChoice.forEach((anchor) => (startAnchorPossabilities[anchor] = startAnchorOffsets[anchor]));
        }
        if (endAnchorChoice.includes("auto"))
            ["left", "right", "top", "bottom"].forEach((anchor) => (endAnchorPossabilities[anchor] = endAnchorOffsets[anchor]));
        else {
            endAnchorChoice.forEach((anchor) => (endAnchorPossabilities[anchor] = endAnchorOffsets[anchor]));
        }
        const dist = (p1, p2) => {
            //length of line
            return Math.sqrt(Math.pow((p1.x - p2.x), 2) + Math.pow((p1.y - p2.y), 2));
        };
        const getShortestLine = (sPoints, ePoints) => {
            // closes tPair Of Points which feet to the specifed anchors
            let minDist = Infinity;
            let closestPair;
            for (let startAnchor in sPoints) {
                for (let endAnchor in ePoints) {
                    let d = dist(sPoints[startAnchor], ePoints[endAnchor]);
                    if (d < minDist) {
                        minDist = d;
                        closestPair = [{ [startAnchor]: sPoints[startAnchor] }, { [endAnchor]: ePoints[endAnchor] }];
                    }
                }
            }
            return closestPair;
        };
        let startPoints = {};
        for (let key in startAnchorPossabilities) {
            startPoints[key] = {};
            startPoints[key]["x"] = startAnchorPossabilities[key].rightness + s.x;
            startPoints[key]["y"] = startAnchorPossabilities[key].bottomness + s.y;
        }
        let endPoints = {};
        for (let key in endAnchorPossabilities) {
            endPoints[key] = {};
            endPoints[key]["x"] = endAnchorPossabilities[key].rightness + e.x;
            endPoints[key]["y"] = endAnchorPossabilities[key].bottomness + e.y;
        }
        let [startPointObj, endPointObj] = getShortestLine(startPoints, endPoints);
        let startPoint = Object.values(startPointObj)[0], endPoint = Object.values(endPointObj)[0];
        let startAnchor = Object.keys(startPointObj)[0], endAnchor = Object.keys(endPointObj)[0];
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
        let cu = Number(props.curveness);
        let excRight = strokeWidth;
        let excLeft = strokeWidth;
        let excUp = strokeWidth + labalCanvExtraY;
        let excDown = strokeWidth + labalCanvExtraY;
        excLeft += Number(props.advanced.extendSVGcanvas);
        excRight += Number(props.advanced.extendSVGcanvas);
        excUp += Number(props.advanced.extendSVGcanvas);
        excDown += Number(props.advanced.extendSVGcanvas);
        ////////////////////////////////////
        // arrow point to point calculations
        let x1 = 0, x2 = absDx + 0, y1 = 0, y2 = absDy + 0;
        if (dx < 0)
            [x1, x2] = [x2, x1];
        if (dy < 0)
            [y1, y2] = [y2, y1];
        ////////////////////////////////////
        // arrow curveness calculations
        if (cu === 0) {
            let angel = Math.atan(absDy / absDx);
            x2 -= headOffset * xSign * Math.cos(angel);
            y2 -= headOffset * ySign * Math.sin(angel);
        }
        else {
            if (endAnchor === "middle") {
                if (absDx > absDy)
                    x2 -= headOffset * xSign;
                else
                    y2 -= headOffset * ySign;
            }
            else {
                if (["left", "right"].includes(endAnchor)) {
                    x2 -= headOffset * xSign;
                }
                else if (["top", "bottom"].includes(endAnchor)) {
                    y2 -= headOffset * ySign;
                }
            }
        }
        excRight += (strokeWidth * headSize) / 2;
        excLeft += (strokeWidth * headSize) / 2;
        excUp += (strokeWidth * headSize) / 2;
        excDown += (strokeWidth * headSize) / 2;
        let cpx1 = x1, cpy1 = y1, cpx2 = x2, cpy2 = y2;
        const curvesPossabilties = {
            hh: () => {
                //horizinatl - from right to left or the opposite
                cpx1 += absDx * cu * xSign;
                cpx2 -= absDx * cu * xSign;
            },
            vv: () => {
                //vertical - from top to bottom or opposite
                cpy1 += absDy * cu * ySign;
                cpy2 -= absDy * cu * ySign;
            },
            hv: () => {
                // start horizintaly then verticaly
                // from v side to h side
                cpx1 += absDx * cu * xSign;
                cpy2 -= absDy * cu * ySign;
            },
            vh: () => {
                // start verticaly then horizintaly
                // from h side to v side
                cpy1 += absDy * cu * ySign;
                cpx2 -= absDx * cu * xSign;
            },
        };
        let choosedCurveness = "";
        if (["left", "right"].includes(startAnchor))
            choosedCurveness += "h";
        else if (["bottom", "top"].includes(startAnchor))
            choosedCurveness += "v";
        else if (startAnchor === "middle")
            choosedCurveness += "m";
        if (["left", "right"].includes(endAnchor))
            choosedCurveness += "h";
        else if (["bottom", "top"].includes(endAnchor))
            choosedCurveness += "v";
        else if (endAnchor === "middle")
            choosedCurveness += "m";
        if (absDx > absDy)
            choosedCurveness = choosedCurveness.replace(/m/g, "h");
        else
            choosedCurveness = choosedCurveness.replace(/m/g, "v");
        curvesPossabilties[choosedCurveness]();
        ////////////////////////////////////
        // Buzier curve calcualtions
        // bzCurve function:  bz = (1−t)^3*p1 + 3(1−t)^2*t*p2 +3(1−t)*t^2*p3 + t^3*p4
        // dt(bz) = -3 p1 (1 - t)^2 + 3 p2 (1 - t)^2 - 6 p2 (1 - t) t + 6 p3 (1 - t) t - 3 p3 t^2 + 3 p4 t^2
        // when p1=(x1,y1),p2=(cpx1,cpy1),p3=(cpx2,cpy2),p4=(x2,y2)
        // then extrema points is when dt(bz) = 0
        // solutions =>  t = ((-6 p1 + 12 p2 - 6 p3) ± sqrt((6 p1 - 12 p2 + 6 p3)^2 - 4 (3 p2 - 3 p1) (-3 p1 + 9 p2 - 9 p3 + 3 p4)))/(2 (-3 p1 + 9 p2 - 9 p3 + 3 p4))  when (p1 + 3 p3!=3 p2 + p4)
        // xSol1,2 = ((-6 x1 + 12 cpx1 - 6 cpx2) ± sqrt((6 x1 - 12 cpx1 + 6 cxp2)^2 - 4 (3 cpx1 - 3 x1) (-3 x1 + 9 cpx1 - 9 cpx2 + 3 x2)))/(2 (-3 x1 + 9 cpx1 - 9 cpx2 + 3 x2))
        // ySol1,2 = ((-6 y1 + 12 cpy1 - 6 cpy2) ± sqrt((6 y1 - 12 cpy1 + 6 cyp2)^2 - 4 (3 cpy1 - 3 y1) (-3 y1 + 9 cpy1 - 9 cpy2 + 3 y2)))/(2 (-3 y1 + 9 cpy1 - 9 cpy2 + 3 y2))
        // now in javascript:
        let txSol1 = (-6 * x1 +
            12 * cpx1 -
            6 * cpx2 +
            Math.sqrt(Math.pow((6 * x1 - 12 * cpx1 + 6 * cpx2), 2) - 4 * (3 * cpx1 - 3 * x1) * (-3 * x1 + 9 * cpx1 - 9 * cpx2 + 3 * x2))) /
            (2 * (-3 * x1 + 9 * cpx1 - 9 * cpx2 + 3 * x2));
        let txSol2 = (-6 * x1 +
            12 * cpx1 -
            6 * cpx2 -
            Math.sqrt(Math.pow((6 * x1 - 12 * cpx1 + 6 * cpx2), 2) - 4 * (3 * cpx1 - 3 * x1) * (-3 * x1 + 9 * cpx1 - 9 * cpx2 + 3 * x2))) /
            (2 * (-3 * x1 + 9 * cpx1 - 9 * cpx2 + 3 * x2));
        let tySol1 = (-6 * y1 +
            12 * cpy1 -
            6 * cpy2 +
            Math.sqrt(Math.pow((6 * y1 - 12 * cpy1 + 6 * cpy2), 2) - 4 * (3 * cpy1 - 3 * y1) * (-3 * y1 + 9 * cpy1 - 9 * cpy2 + 3 * y2))) /
            (2 * (-3 * y1 + 9 * cpy1 - 9 * cpy2 + 3 * y2));
        let tySol2 = (-6 * y1 +
            12 * cpy1 -
            6 * cpy2 -
            Math.sqrt(Math.pow((6 * y1 - 12 * cpy1 + 6 * cpy2), 2) - 4 * (3 * cpy1 - 3 * y1) * (-3 * y1 + 9 * cpy1 - 9 * cpy2 + 3 * y2))) /
            (2 * (-3 * y1 + 9 * cpy1 - 9 * cpy2 + 3 * y2));
        const bzx = (t) => Math.pow((1 - t), 3) * x1 + 3 * Math.pow((1 - t), 2) * t * cpx1 + 3 * (1 - t) * Math.pow(t, 2) * cpx2 + Math.pow(t, 3) * x2;
        const bzy = (t) => Math.pow((1 - t), 3) * y1 + 3 * Math.pow((1 - t), 2) * t * cpy1 + 3 * (1 - t) * Math.pow(t, 2) * cpy2 + Math.pow(t, 3) * y2;
        ////////////////////////////////////
        // canvas smart size adjustments
        let xSol1 = bzx(txSol1);
        let xSol2 = bzx(txSol2);
        let ySol1 = bzy(tySol1);
        let ySol2 = bzy(tySol2);
        if (xSol1 < 0)
            excLeft += -xSol1;
        if (xSol2 > absDx)
            excRight += xSol2 - absDx;
        if (ySol1 < 0)
            excUp += -ySol1;
        if (ySol2 > absDy)
            excDown += ySol2 - absDy;
        excLeft += labalCanvExtraX * 4;
        excRight += labalCanvExtraX * 4;
        x1 += excLeft;
        x2 += excLeft;
        y1 += excUp;
        y2 += excUp;
        cpx1 += excLeft;
        cpx2 += excLeft;
        cpy1 += excUp;
        cpy2 += excUp;
        let cw = absDx + excLeft + excRight, ch = absDy + excUp + excDown;
        cx0 -= excLeft;
        cy0 -= excUp;
        //labels
        let labelStartPos = { x: bzx(0.01), y: bzy(0.01) };
        let labelMiddlePos = { x: bzx(0.5), y: bzy(0.5) };
        let labelEndPos = { x: bzx(0.99), y: bzy(0.99) };
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
            excLeft,
            excRight,
            excUp,
            excDown,
        });
    };
    let arrowPath = `M ${st.x1} ${st.y1} C ${st.cpx1} ${st.cpy1}, ${st.cpx2} ${st.cpy2}, ${st.x2} ${st.y2}`;
    // arrowPath = `M ${st.x1} ${st.y1}  ${st.x2} ${st.y2}`;
    let arrowHeadId = "arrowHeadMarker" + arrowPath.replace(/ /g, "");
    return (React.createElement("svg", { ref: selfRef, width: st.cw, height: st.ch, 
        // viewBox={`${-excx / 2} ${-excy / 2} ${st.cw} ${st.ch}`}
        style: {
            // border: "2px yellow dashed",
            position: "absolute",
            left: st.cx0,
            top: st.cy0,
            pointerEvents: "none",
        } },
        React.createElement("marker", { id: arrowHeadId, viewBox: "0 0 12 12", refX: "3", refY: "6", 
            // re
            markerUnits: "strokeWidth", markerWidth: headSize, markerHeight: headSize, orient: st.headOrient },
            React.createElement("path", { d: "M 0 0 L 12 6 L 0 12 L 3 6 z", fill: headColor })),
        React.createElement("path", { d: arrowPath, stroke: lineColor, strokeDasharray: `${dashStroke} ${dashNone}`, strokeWidth: strokeWidth, fill: "transparent", markerEnd: `url(#${arrowHeadId})` }, animationSpeed ? (React.createElement("animate", { attributeName: "stroke-dashoffset", values: `${dashoffset * animationDirection};0`, dur: `${1 / animationSpeed}s`, repeatCount: "indefinite" })) : null),
        labelStart ? (React.createElement("text", Object.assign({}, labelStartExtra, { textAnchor: st.dx > 0 ? "start" : "end", x: st.labelStartPos.x, y: st.labelStartPos.y }), labelStart)) : null,
        labelMiddle ? (React.createElement("text", Object.assign({}, labelMiddleExtra, { textAnchor: "middle", x: st.labelMiddlePos.x, y: st.labelMiddlePos.y }), labelMiddle)) : null,
        labelEnd ? (React.createElement("text", Object.assign({}, labelEndExtra, { textAnchor: st.dx > 0 ? "end" : "start", x: st.labelEndPos.x, y: st.labelEndPos.y }), labelEnd)) : null));
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
    curveness: 0.8,
    dashness: false,
    monitorDOMchanges: true,
    registerEvents: [],
    consoleWarning: true,
    advanced: { extendSVGcanvas: 0 },
};
export default Xarrow;
//# sourceMappingURL=index.js.map