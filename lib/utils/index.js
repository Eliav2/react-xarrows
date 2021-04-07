"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeOf = exports.getElementByPropGiven = void 0;
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
//# sourceMappingURL=index.js.map