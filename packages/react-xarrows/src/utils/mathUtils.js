"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.round = exports.deg2Rad = exports.between = exports.operatorFunc = exports.math_operators = void 0;
var classes_1 = require("../classes/classes");
exports.math_operators = {
    add: function (x, y) { return x + y; },
    sub: function (x, y) { return x - y; },
    mul: function (x, y) { return x * y; },
    dev: function (x, y) { return x / y; },
    greater: function (x, y) { return x > y; },
    greaterEqual: function (x, y) { return x >= y; },
    smaller: function (x, y) { return x < y; },
    smallerEqual: function (x, y) { return x <= y; },
};
var operatorFunc = function (p, p2, operator, self) {
    if (self === void 0) { self = false; }
    var _p2;
    if (typeof p2 === 'number')
        _p2 = { x: p2, y: p2 };
    else
        _p2 = p2;
    // let v = new T(operator(p.x, _p2.x), operator(p.y, _p2.y));
    // let v = new (p.constructor as any)(operator(p.x, _p2.x), operator(p.y, _p2.y));
    if (self) {
        var n = new classes_1.Vector(operator(p.x, _p2.x), operator(p.y, _p2.y));
        p.x = n.x;
        p.y = n.y;
    }
    var v = new classes_1.Vector(operator(p.x, _p2.x), operator(p.y, _p2.y));
    // handle 0/0 = NaN instead of 0
    if (isNaN(v.x))
        v.x = 0;
    if (isNaN(v.y))
        v.y = 0;
    return v;
};
exports.operatorFunc = operatorFunc;
var between = function (num, a, b, inclusiveA, inclusiveB) {
    var _a, _b;
    if (inclusiveA === void 0) { inclusiveA = true; }
    if (inclusiveB === void 0) { inclusiveB = true; }
    if (a > b)
        _a = [b, a, inclusiveB, inclusiveA], a = _a[0], b = _a[1], inclusiveA = _a[2], inclusiveB = _a[3];
    if (a == b && (inclusiveA || inclusiveB))
        _b = [true, true], inclusiveA = _b[0], inclusiveB = _b[1];
    return (inclusiveA ? num >= a : num > a) && (inclusiveB ? num <= b : num < b);
};
exports.between = between;
var deg2Rad = function (deg) { return (deg / 180) * Math.PI; };
exports.deg2Rad = deg2Rad;
// const roundTo = (num: number, level = MATH_PRECISION + 1) => parseFloat(num.toFixed(level));
// const round = (num: number, level = MATH_PRECISION + 1) => Math.round();
var round = function (num, level) {
    if (level === void 0) { level = classes_1.MATH_PRECISION; }
    return Math.round((num + Number.EPSILON) * Math.pow(10, level)) / Math.pow(10, level);
    // return Math.round((num + Number.EPSILON) * 1000) / 1000;
};
exports.round = round;
