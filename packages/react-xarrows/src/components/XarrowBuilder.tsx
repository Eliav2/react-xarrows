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
  K extends PlainObject | void = PlainObject,
  // parsed properties
  PS extends { [key in keyof P]?: any } = any
> = {
  // function that receives the global State object, and props passed by the uses.
  // this function should return an object that will be reassigned to the State object and will extend it.
  state?: (params: { state: S; props: P; parsedProps: PS }) => K;

  // receives the previous jsx,state,and props, this should return jsx that will be rendered to screen

  jsx?: (params: { state: Merge<K, S>; props: P; nextJsx? }) => JSX.Element; //ok

  propTypes?: WeakValidationMap<P>;
  defaultProps?: Partial<P>;

  parseProps?: {
    [key in keyof P]?: (prop: P[key]) => PS[key];
  };
};

export const createFeature = <
  // the given user properties
  P extends any,
  //  the state that was passed from previous feature
  S extends any = PlainObject,
  // the change of the state caused by the current feature
  K extends PlainObject | void = PlainObject,
  // parsed properties
  PS extends { [key in keyof P]?: any } = any
>(
  features: XarrowFeature<P, S, K, PS>
): XarrowFeature<P, S, K, PS> => {
  return features;
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

  const parsePropsFuncs = {};
  for (let i = 0; i < features.length; i++) Object.assign(parsePropsFuncs, features[i].parseProps);

  const CustomXarrow: React.FC<getProps<T>> = (props) => {
    // console.log('XarrowBuilder CustomXarrow render');
    const state = {};
    let Jsx: JSX.Element;

    const parsedProps = {};
    for (let i = 0; i < features.length; i++) {
      const feature = features[i];
      const featureProps = feature.parseProps;
      if (featureProps) {
        for (const key in featureProps) {
          const func = featureProps[key];
          parsedProps[key] = func(props[key]);
        }
      }
    }

    //build state object for current render
    for (let i = 0; i < stateFuncs.length; i++) {
      Object.assign(state, stateFuncs[i]({ state, props, parsedProps }));
    }

    // get next jsx for each feature
    let next;
    let nextFunc = (i) => {
      next = jsxFuncs[i] || (() => null);
      return next({
        state: state,
        props,
        parsedProps,
        nextJsx: () => nextFunc(i + 1),
      });
    };
    Jsx = jsxFuncs[0]({
      state: state,
      props,
      parsedProps,
      nextJsx: () => nextFunc(1),
    });
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
