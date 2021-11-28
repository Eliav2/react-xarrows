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
exports.getPathState = void 0;
var getPathState = function getPathState(extendPos, pathFunc, posState) {
    if (posState === void 0) { posState = {}; }
    if (extendPos) {
        if (extendPos === 'obj')
            return posState;
        var newPos_1 = extendPos(__assign({}, posState));
        return function (newExtendPos, newPathFunc, _newPos) {
            if (newPathFunc === void 0) { newPathFunc = pathFunc; }
            if (_newPos === void 0) { _newPos = newPos_1; }
            return getPathState(newExtendPos, newPathFunc, _newPos);
        };
    }
    else {
        if (pathFunc)
            return pathFunc(posState);
        else
            return posState;
    }
};
exports.getPathState = getPathState;
