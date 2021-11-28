/**
 * could be used in future typescript versions (which will include partial generic inference support)
 */

import React, { WeakValidationMap } from 'react';
import { AnchorsProps } from '../features/Anchors';
import Core, { CoreProps, CoreStateChange } from '../features/Core';
import Edges from '../features/Edges';
import { GetIndex, PlainObject, RangeUnion, UnionToIntersection, Writable } from '../privateTypes';
import { Features } from './XarrowMainNew';

export type XarrowFeature<
  // the given user properties
  P extends PlainObject,
  //  the state that was passed from previous feature
  S extends PlainObject = PlainObject,
  // the change of the state caused by the current feature
  Snew extends PlainObject | void = PlainObject | void
  > = {
    // function that receives the global State object, and props passed by the uses.
    // this function should return an object that will be reassigned to the State object and will extend it.
    state?: (state: S, props: P) => Snew;

    // receives the previous jsx,state,and props, this should return jsx that will be rendered to screen
    jsx?: (state: Snew, props: P, nextJsx?) => JSX.Element;

    propTypes?: WeakValidationMap<P>;
    defaultProps?: Partial<P>;
  };

export type PriorFeatures<
  Feature extends XarrowFeature<any, any, any>,
  Features extends XarrowFeature<any, any, any>[]
  > = Features extends Array<XarrowFeature<any, any, infer S>>[1] ? S : never;
type testPrior = PriorFeatures<typeof Edges, Features>


function createFeatureTmp<P>(feature: XarrowFeature<P>, features = []) {
  return getFeatureState(feature)
}

const myFeature: XarrowFeature<{ a: number }> = { state: () => ({ newStateA: 1 }) }
function myFunctionFeature<P, F>(feature: F): F extends XarrowFeature<infer P, infer S, infer Snew> ? XarrowFeature<P, S, Snew> : never {
  return feature
}
const myCreateFeature = myFunctionFeature<{ a: number }>(myFeature)




type GetNext<T> = T extends XarrowFeature<infer T1, infer T2, infer T3> ? T3 : never;
type testGetNext = GetNext<testPrior>

const getFeatureState = <P, S, Snew>(feature: XarrowFeature<P, S, Snew>): XarrowFeature<P, S, Snew> => {
  return feature;
}

getFeatureState({ state: (state: any, props: any) => ({ newState: 1 }), jsx: (state, props) => <div>test</div> });

function _createFeatureExplicit<Fp, Fs = {}, Fsnew = Fs, FS = []>(feature: XarrowFeature<Fp, Fs, Fsnew>, features?: FS): XarrowFeature<Fp, Fs, Fsnew> {
  return feature;
}
function createFeature<P>(feature: XarrowFeature<P>, features = []) {
  return _createFeatureExplicit(feature, features);
}

_createFeatureExplicit<{ someProp: string }>({
  state: (state: any, props: any) => {
    return { name: 'eliav' };
  },
  jsx: (state, props, nextJsx) => {
    return <div></div>
  },
});

// if function will execute it passing down 'args' if a jsx will return it
const FuncOrJsx = (param, ...args) => {
  if (React.isValidElement(param)) return param;
  else if (typeof param === 'function') return param(...args);
};

// type getProps<T> = UnionToIntersection<T extends XarrowFeature<infer S>[] ? S : never>;
type getProps<T> = UnionToIntersection<
  T extends Array<infer S> ? (S extends XarrowFeature<infer K, infer K1, infer K2> ? K : never) : never
>;

type t1 = getProps<[XarrowFeature<CoreProps, {}, CoreStateChange>, XarrowFeature<AnchorsProps>]>;

const XarrowBuilder = <T extends any[]>(features: T): React.FC<getProps<T>> => {
  // console.log('XarrowBuilder');
  const stateFuncs = features.filter((f) => f.state).map((f) => f.state);
  const jsxFuncs = features.filter((f) => f.jsx).map((f) => f.jsx);

  const CustomXarrow: React.FC<getProps<T>> = (props) => {
    // console.log('XarrowBuilder CustomXarrow render');
    const State = {};
    let Jsx: JSX.Element;

    for (let i = 0; i < stateFuncs.length; i++) {
      Object.assign(State, stateFuncs[i](State, props));
    }

    let next;
    let nextFunc = (i) => {
      next = jsxFuncs[i] || (() => null);
      return next(State, props, () => nextFunc(i + 1));
    };
    Jsx = jsxFuncs[0](State, props, () => nextFunc(1));

    // for (let i = 0; i < features.length; i++) {
    //   // const nextJsx = features.find((f) => f.jsx);
    //   const nextJsx = () => findFrom(features, (f) => !!f.jsx, i + 1)?.jsx(State, props);
    //   // const nextJsx = () => findFrom(features, (f) => !!f.jsx, i)?.jsx(State, props);
    //   if (features[i].jsx) Jsx = features[i].jsx(State, props, nextJsx);
    // }
    return Jsx;
  };
  const propTypes = {};
  for (let i = 0; i < features.length; i++) Object.assign(propTypes, features[i].propTypes);
  CustomXarrow.propTypes = propTypes;
  const defaultProps = {};
  for (let i = 0; i < features.length; i++) Object.assign(defaultProps, features[i].defaultProps);
  CustomXarrow.defaultProps = defaultProps;
  return CustomXarrow;
};
export default XarrowBuilder;

export const createFeatures = <T extends readonly any[]>(features: T): Writable<T> => {
  return features;
};
