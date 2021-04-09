"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.factorDpathStr = exports.typeOf = exports.getElementByPropGiven = void 0;
exports.getElementByPropGiven = (ref) => {
    let myRef;
    if (typeof ref === "string") {
        myRef = document.getElementById(ref);
    }
    else
        myRef = ref.current;
    return myRef;
};
exports.typeOf = (arg) => {
    let type = typeof arg;
    if (type === "object") {
        if (arg === null)
            type = "null";
        else if (Array.isArray(arg))
            type = "array";
    }
    return type;
};
// receives string representing a d path and factoring only the numbers
exports.factorDpathStr = (d, factor) => {
    let l = d.split(/(\d+(?:\.\d+)?)/);
    l = l.map((s) => {
        if (Number(s))
            return (Number(s) * factor).toString();
        else
            return s;
    });
    return l.join("");
};
//# sourceMappingURL=index.js.map