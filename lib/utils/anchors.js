"use strict";
/**
 * utility functions for preparing `startAnchor` and `endAnchor` to accept the diffrent types that can be passed.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getShortestLine = exports.prepareAnchorLines = void 0;
const index_1 = require("./index");
const getAnchorsDefaultOffsets = (width, height) => {
    return {
        middle: { rightness: width * 0.5, bottomness: height * 0.5 },
        left: { rightness: 0, bottomness: height * 0.5 },
        right: { rightness: width, bottomness: height * 0.5 },
        top: { rightness: width * 0.5, bottomness: 0 },
        bottom: { rightness: width * 0.5, bottomness: height },
    };
};
exports.prepareAnchorLines = (anchor, anchorPos) => {
    let defsOffsets = getAnchorsDefaultOffsets(anchorPos.right - anchorPos.x, anchorPos.bottom - anchorPos.y);
    // convert given anchors to array if not array already
    let anchorChoice = Array.isArray(anchor) ? anchor : [anchor];
    if (anchorChoice.length == 0)
        anchorChoice = ["auto"];
    //now map each item in the array to relevant object
    let anchorChoiceMapped = anchorChoice.map((anchorChoice) => {
        if (index_1.typeOf(anchorChoice) === "string") {
            anchorChoice = anchorChoice;
            return {
                position: anchorChoice,
                offset: { rightness: 0, bottomness: 0 },
            };
        }
        else if (index_1.typeOf(anchorChoice) === "object") {
            if (!anchorChoice.offset)
                anchorChoice.offset = { rightness: 0, bottomness: 0 };
            if (!anchorChoice.offset.bottomness)
                anchorChoice.offset.bottomness = 0;
            if (!anchorChoice.offset.rightness)
                anchorChoice.offset.rightness = 0;
            anchorChoice = anchorChoice;
            return anchorChoice;
        }
    });
    //now build the object that represents the users possibilities for different anchors
    let anchorPossibilities = [];
    if (anchorChoiceMapped.map((a) => a.position).includes("auto")) {
        let autoAnchor = anchorChoiceMapped.find((a) => a.position === "auto");
        ["left", "right", "top", "bottom"].forEach((anchor) => {
            let offset = defsOffsets[anchor];
            offset.rightness += autoAnchor.offset.rightness;
            offset.bottomness += autoAnchor.offset.bottomness;
            anchorPossibilities.push({ position: anchor, offset });
        });
    }
    else {
        anchorChoiceMapped.forEach((customAnchor) => {
            let offset = defsOffsets[customAnchor.position];
            offset.rightness += customAnchor.offset.rightness;
            offset.bottomness += customAnchor.offset.bottomness;
            anchorPossibilities.push({ position: customAnchor.position, offset });
        });
    }
    // now prepare this list of anchors to object expected by the `getShortestLine` function
    return anchorPossibilities.map((pos) => ({
        x: anchorPos.x + pos.offset.rightness,
        y: anchorPos.y + pos.offset.bottomness,
        anchorPosition: pos.position,
    }));
};
const dist = (p1, p2) => {
    //length of line
    return Math.sqrt(Math.pow((p1.x - p2.x), 2) + Math.pow((p1.y - p2.y), 2));
};
exports.getShortestLine = (sPoints, ePoints) => {
    // closes tPair Of Points which feet to the specified anchors
    let minDist = Infinity, d = Infinity;
    let closestPair;
    sPoints.forEach((sp) => {
        ePoints.forEach((ep) => {
            d = dist(sp, ep);
            if (d < minDist) {
                minDist = d;
                closestPair = { startPointObj: sp, endPointObj: ep };
            }
        });
    });
    return closestPair;
};
//# sourceMappingURL=anchors.js.map