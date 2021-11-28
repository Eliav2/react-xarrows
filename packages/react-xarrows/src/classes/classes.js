"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Line = exports.Dir = exports.Vector = exports.MATH_PRECISION = void 0;
var mathUtils_1 = require("../utils/mathUtils");
exports.MATH_PRECISION = 5;
// const eq = (a: number, b: number, precision = MATH_PRECISION) => Math.abs(a - b) < 1 / 10 ** precision;
// const eq = (a: number, b: number) => Math.abs(a - b) < Number.EPSILON;
var eq = function (a, b) { return Math.abs(a - b) < Math.pow(10, -(exports.MATH_PRECISION - 1)); };
var operators = {
    add: function (x, y) { return x + y; },
    sub: function (x, y) { return x - y; },
    mul: function (x, y) { return x * y; },
    dev: function (x, y) { return x / y; },
    greater: function (x, y) { return x > y; },
    greaterEqual: function (x, y) { return x >= y; },
    smaller: function (x, y) { return x < y; },
    smallerEqual: function (x, y) { return x <= y; },
};
// const pathMargin = 15;
var Vector = /** @class */ (function () {
    // constructor(x: number | Vector | Contains<{ x: number; y: number }>, y?: number) {
    function Vector(x, y) {
        if (x instanceof Vector || typeof x === 'object') {
            this.x = x.x;
            this.y = x.y;
            if (typeof y === 'number')
                throw Error('illegal');
        }
        else {
            this.x = x;
            this.y = y;
        }
        this.faceDirs = null;
        this._chosenFaceDir = null;
        if (!(this instanceof Dir))
            this.dir = new Dir(this.x, this.y);
    }
    Vector.prototype.eq = function (p) {
        return eq(p.x, this.x) && eq(p.y, this.y);
    };
    Vector.prototype.notEq = function (p) {
        return !eq(p.x, this.x) || !eq(p.y, this.y);
    };
    Vector.prototype.add = function (p, self) {
        if (self === void 0) { self = false; }
        return (0, mathUtils_1.operatorFunc)(this, p, mathUtils_1.math_operators.add, self);
    };
    Vector.prototype.sub = function (p, self) {
        if (self === void 0) { self = false; }
        return (0, mathUtils_1.operatorFunc)(this, p, mathUtils_1.math_operators.sub, self);
    };
    // mul(p: Vector | number,self=false) {
    Vector.prototype.mul = function (p, self) {
        if (self === void 0) { self = false; }
        return (0, mathUtils_1.operatorFunc)(this, p, mathUtils_1.math_operators.mul, self);
    };
    Vector.prototype.dev = function (p, self) {
        if (self === void 0) { self = false; }
        return (0, mathUtils_1.operatorFunc)(this, p, mathUtils_1.math_operators.dev, self);
    };
    Vector.prototype.absSize = function () {
        // return Math.sqrt(this.x ** 2 + this.y ** 2);
        return Math.abs(this.x) + Math.abs(Math.pow(this.y, 2));
    };
    Vector.prototype.size = function () {
        return this.x + this.y;
    };
    Vector.prototype.abs = function () {
        return new Vector(Math.abs(this.x), Math.abs(this.y));
    };
    Vector.prototype.setDirs = function (d) {
        // let v = new Vector(this);
        this.faceDirs = d;
        return this;
    };
    Vector.prototype.setChosenDir = function (d) {
        // let v = new Vector(this);
        // v.requiredFaceDir = this.requiredFaceDir;
        this._chosenFaceDir = d;
        return this;
    };
    // setRequiredDir = (d: Dir) => {
    //   // let v = new Vector(this);
    //   this.requiredFaceDir = d;
    //   return this;
    // };
    Vector.prototype.rotate = function (deg) {
        var rad = (0, mathUtils_1.deg2Rad)(deg);
        // let v =
        var contextClass = this.constructor;
        return new contextClass((0, mathUtils_1.round)(this.x * Math.cos(rad) - this.y * Math.sin(rad)), (0, mathUtils_1.round)(this.x * Math.sin(rad) + this.y * Math.cos(rad)));
    };
    Vector.prototype.projection = function (v) {
        // return new Vector(this.dir().mul(v));
        // return this.mul(Math.atan2(this.size(), v.size()));
        // return this.mul(v)
        //   .dev(v.size() ** 2)
        //   .mul(v);
        // return this.mul(v).dev(v.mul(v)).mul(v)  ;
        return this.mul(v).dev(v.mul(v)).mul(v);
    };
    Vector.prototype.round = function () {
        this.x = (0, mathUtils_1.round)(this.x);
        this.y = (0, mathUtils_1.round)(this.y);
        return this;
    };
    return Vector;
}());
exports.Vector = Vector;
// receives a vector and returns direction unit
var fQ2 = function (x, y) {
    var ySign = y >= 0 ? 1 : -1;
    var xSqrt = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    if (xSqrt == 0)
        return [0, 0];
    var xDir = x / xSqrt;
    var yDir = Math.sqrt(1 - Math.pow(xDir, 2)) * ySign;
    return [xDir, yDir];
};
/**
 * normalized direction
 */
var Dir = /** @class */ (function (_super) {
    __extends(Dir, _super);
    // @ts-ignore
    function Dir(xDiff, yDiff) {
        var _a;
        var _this = this;
        if (xDiff instanceof Vector || typeof xDiff === 'object')
            _a = [xDiff.x, xDiff.y], xDiff = _a[0], yDiff = _a[1];
        if (typeof xDiff === 'number' && typeof yDiff !== 'number')
            throw Error('second argument should be number');
        // unit circle -  max dir  [0.707,0.707]
        var _b = fQ2(xDiff, yDiff), x = _b[0], y = _b[1];
        _this = _super.call(this, x, y) || this;
        return _this;
        // // unit rect - max dir  [1,1]
        // let m = Math.max(Math.abs(xDiff), Math.abs(yDiff));
        // if (m == 0) m = 1;
        // super(xDiff / m, yDiff / m);
    }
    Dir.prototype.reverse = function () {
        return new Dir(-this.x, -this.y);
    };
    //replace direction of x and y
    Dir.prototype.mirror = function () {
        return new Dir(this.y, this.x);
    };
    Dir.prototype.abs = function () {
        return new Dir(Math.abs(this.x), Math.abs(this.y));
    };
    //mean that parallel directions
    Dir.prototype.parallel = function (p) {
        return Math.abs(p.x) === Math.abs(this.x) && Math.abs(p.y) === Math.abs(this.y);
    };
    Dir.prototype.toDegree = function () {
        return (Math.atan2(this.y, this.x) * 180) / Math.PI;
    };
    return Dir;
}(Vector));
exports.Dir = Dir;
// // mini test
// const v1 = new Vector(1, 0.6);
// const v2 = new Vector(1, 0.6);
// console.log(v1.projection(v2));
/**
 * straight line
 */
var Line = /** @class */ (function () {
    function Line(start, end, _a) {
        var _b = _a === void 0 ? { startIncluded: true, endIncluded: false } : _a, _c = _b.startIncluded, startIncluded = _c === void 0 ? true : _c, _d = _b.endIncluded, endIncluded = _d === void 0 ? false : _d;
        this.root = start;
        this.end = end;
        var _e = this.getAB(), a = _e[0], b = _e[1];
        this.a = a;
        this.b = b;
        this.startIncluded = startIncluded;
        this.endIncluded = endIncluded;
        this.dir = new Dir(this.end.x - this.root.x, this.end.y - this.root.y);
        this.diff = new Vector(this.end.x - this.root.x, this.end.y - this.root.y);
    }
    //return form of y = ax+b form
    Line.prototype.getAB = function () {
        var a = (0, mathUtils_1.round)((this.end.y - this.root.y) / (this.end.x - this.root.x)); //slope
        var b = (0, mathUtils_1.round)(this.root.y - a * this.root.x); // meet with y axis
        return [a, b];
    };
    Line.prototype.xDiff = function () {
        return new Vector(this.end.x - this.root.x, 0);
    };
    Line.prototype.yDiff = function () {
        return new Vector(0, this.end.y - this.root.y);
    };
    Line.prototype.getCloserEdge = function (v) {
        var l1 = new Line(v, this.root);
        var l2 = new Line(v, this.end);
        return l1.diff.absSize() < l2.diff.absSize() ? this.root : this.end;
    };
    // meeting point with other line
    Line.prototype.getCut = function (l) {
        var _a;
        // handle edge cases
        if (l.dir.parallel(this.dir)) {
            // return null; //dont include inclusive points when parallel
            // if (this.isOnLine(l.end)) {
            //   // return this.getCloserEdge(l.end);
            //   // return l.end;
            // }
            return null;
        }
        // normal cases
        var xCut, yCut, vCut;
        var _b = [
            [this.a, this.b],
            [l.a, l.b],
        ], _c = _b[0], a1 = _c[0], b1 = _c[1], _d = _b[1], a2 = _d[0], b2 = _d[1];
        var _e = [a1, b1], a = _e[0], b = _e[1];
        if (Math.abs(a1) == Infinity) {
            xCut = this.root.x;
            _a = [a2, b2], a = _a[0], b = _a[1];
        }
        else if (Math.abs(a2) == Infinity) {
            xCut = l.root.x;
        }
        else
            xCut = (0, mathUtils_1.round)((b2 - b1) / (a1 - a2));
        yCut = (0, mathUtils_1.round)(a * xCut + b); //also equals to a2 * xCut + b2
        vCut = new Vector(xCut, yCut);
        if (!this.isOnLine(vCut) || !l.isOnLine(vCut))
            return null;
        if (vCut.eq(this.root))
            return null;
        return vCut;
    };
    // does a point sits on this line?
    Line.prototype.isOnLine = function (v, _a) {
        var _b = _a === void 0 ? {
            startIncluded: this.startIncluded,
            endIncluded: this.endIncluded,
        } : _a, _c = _b.startIncluded, startIncluded = _c === void 0 ? this.startIncluded : _c, _d = _b.endIncluded, endIncluded = _d === void 0 ? this.endIncluded : _d;
        var _e = [this.root.x, this.root.y, this.end.x, this.end.y], x1 = _e[0], y1 = _e[1], x2 = _e[2], y2 = _e[3];
        // if (x1 == x2 && x1 == v.x) return false;
        // if (y1 == y2 && y1 == v.y) return false;
        // if (x1 == x2 && x1 == v.x) return between(v.y, y1, y2);
        // if (y1 == y2 && y1 == v.y) return between(v.x, x1, x2);
        var res = (eq(v.y, this.a * v.x + this.b) || Math.abs(this.a) == Infinity) &&
            (0, mathUtils_1.between)(v.x, x1, x2, startIncluded, endIncluded) &&
            (0, mathUtils_1.between)(v.y, y1, y2, startIncluded, endIncluded);
        //   ||
        // (this.dir.eq(this.diff) &&
        //   between(v.x, x1, x2, true, true) &&
        //   this.dir.eq(this.diff) &&
        //   between(v.y, y1, y2, startIncluded, endIncluded));
        if (!res) {
            // if(v,x)
        }
        return res;
        // let [xMax, xMin] = [Math.max(this.root.x, this.end.x), Math.min(this.root.x, this.end.x)];
        // let [yMax, yMin] = [Math.max(this.root.y, this.end.y), Math.min(this.root.y, this.end.y)];
        // let startComp = this.startIncluded ? operators.greaterEqual : operators.greater;
        // return v.y === this.a * v.x + this.b && v.x >= xMin && v.x <= xMax && v.y >= yMin && v.y <= yMax;
    };
    return Line;
}());
exports.Line = Line;
