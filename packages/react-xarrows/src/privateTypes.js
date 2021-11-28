"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPosType = void 0;
var isPosType = function (pos) {
    return ['right', 'bottom', 'width', 'height'].every(function (prop) { return prop in pos; });
};
exports.isPosType = isPosType;
var toArray = function (arg) {
    return Array.isArray(arg) ? arg : [arg];
};
