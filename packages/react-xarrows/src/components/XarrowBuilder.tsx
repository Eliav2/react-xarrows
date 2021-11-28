import React, { WeakValidationMap } from 'react';
import { AnchorsProps } from '../features/Anchors';
import Core, { CoreProps, CoreStateChange } from '../features/Core';
import Edges from '../features/Edges';
import { GetIndex, Merge, PlainObject, RangeUnion, UnionToIntersection, Writable } from '../privateTypes';

export type XarrowFeature<
  // the given user properties
  P extends any,
  //  the state that was passed from previous feature
  S extends any = PlainObject,
  // the change of the state caused by the current feature
  K extends PlainObject | void = PlainObject
> = {
  // function that receives the global State object, and props passed by the uses.
  // this function should return an object that will be reassigned to the State object and will extend it.
  state?: (state: S, props: P) => K;

  // receives the previous jsx,state,and props, this should return jsx that will be rendered to screen
  jsx?: (state: Merge<K, S>, props: P, nextJsx?) => JSX.Element;

  propTypes?: WeakValidationMap<P>;
  defaultProps?: Partial<P>;
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

export const createFeature = <
  P extends PlainObject,
  //  the state that was passed from previous feature
  S extends PlainObject = PlainObject,
  // the change of the state caused by the current feature
  Snew extends PlainObject | void = PlainObject | void
>(
  features: XarrowFeature<P, S, Snew>
): XarrowFeature<P, S, Snew> => {
  return features;
};
