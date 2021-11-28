"use strict";
/**
 * could be used in future typescript versions (which will include partial generic inference support)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFeatures = void 0;
var react_1 = require("react");
function createFeatureTmp(feature, features) {
    if (features === void 0) { features = []; }
    return getFeatureState(feature);
}
var myFeature = { state: function () { return ({ newStateA: 1 }); } };
function myFunctionFeature(feature) {
    return feature;
}
var myCreateFeature = myFunctionFeature(myFeature);
var getFeatureState = function (feature) {
    return feature;
};
getFeatureState({ state: function (state, props) { return ({ newState: 1 }); }, jsx: function (state, props) { return <div>test</div>; } });
function _createFeatureExplicit(feature, features) {
    return feature;
}
function createFeature(feature, features) {
    if (features === void 0) { features = []; }
    return _createFeatureExplicit(feature, features);
}
_createFeatureExplicit({
    state: function (state, props) {
        return { name: 'eliav' };
    },
    jsx: function (state, props, nextJsx) {
        return <div></div>;
    },
});
// if function will execute it passing down 'args' if a jsx will return it
var FuncOrJsx = function (param) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    if (react_1.default.isValidElement(param))
        return param;
    else if (typeof param === 'function')
        return param.apply(void 0, args);
};
var XarrowBuilder = function (features) {
    // console.log('XarrowBuilder');
    var stateFuncs = features.filter(function (f) { return f.state; }).map(function (f) { return f.state; });
    var jsxFuncs = features.filter(function (f) { return f.jsx; }).map(function (f) { return f.jsx; });
    var CustomXarrow = function (props) {
        // console.log('XarrowBuilder CustomXarrow render');
        var State = {};
        var Jsx;
        for (var i = 0; i < stateFuncs.length; i++) {
            Object.assign(State, stateFuncs[i](State, props));
        }
        var next;
        var nextFunc = function (i) {
            next = jsxFuncs[i] || (function () { return null; });
            return next(State, props, function () { return nextFunc(i + 1); });
        };
        Jsx = jsxFuncs[0](State, props, function () { return nextFunc(1); });
        // for (let i = 0; i < features.length; i++) {
        //   // const nextJsx = features.find((f) => f.jsx);
        //   const nextJsx = () => findFrom(features, (f) => !!f.jsx, i + 1)?.jsx(State, props);
        //   // const nextJsx = () => findFrom(features, (f) => !!f.jsx, i)?.jsx(State, props);
        //   if (features[i].jsx) Jsx = features[i].jsx(State, props, nextJsx);
        // }
        return Jsx;
    };
    var propTypes = {};
    for (var i = 0; i < features.length; i++)
        Object.assign(propTypes, features[i].propTypes);
    CustomXarrow.propTypes = propTypes;
    var defaultProps = {};
    for (var i = 0; i < features.length; i++)
        Object.assign(defaultProps, features[i].defaultProps);
    CustomXarrow.defaultProps = defaultProps;
    return CustomXarrow;
};
exports.default = XarrowBuilder;
var createFeatures = function (features) {
    return features;
};
exports.createFeatures = createFeatures;
