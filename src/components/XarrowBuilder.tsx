import React, { WeakValidationMap } from 'react';
import { Merge, PickKeys, PlainObject, UnionToIntersection, Writable } from '../privateTypes';
import { merge as mergeLD } from 'lodash';

export type XarrowFeature<
  // the given user properties with preprocessed properties (parsed by the 'parseProps' option)
  P extends any,
  //  the state that was passed from previous feature
  S extends any = PlainObject,
  // the change of the state caused by the current feature
  K extends PlainObject | void = PlainObject,
  // parsed properties
  PS extends { [key in PickKeys<P, PS>]?: any } = {},
  // prefer values from parsed properties
  PKK extends any = { [key in keyof P]: key extends keyof PS ? PS[key] : P[key] }
> = {
  // the name of the feat ure(only for debugging on documentation)
  name?: string;

  // function that receives the global State object, and props passed by the uses.
  // this function should return an object that will be reassigned to the State object and will extend it.
  state?: (params: { state: S; props: PKK }) => K;

  // receives the previous jsx,state,and props, this should return jsx that will be rendered to screen
  jsx?: (params: { state: Merge<S, K>; props: PKK; nextJsx?; selfTree: JSX.Element[] }) => JSX.Element; //ok

  // // will introduce options that can be modified across features, before state and jsx are calculated
  // // similar to props in sense that this is interface to customization, but for other feature developers and not the end user
  // options?: (params: { prevOptions: any; props: PKK }) => any;

  // propTypes that would be validated against the props passed by the user
  propTypes?: WeakValidationMap<P>;
  // defaultProps that would be assigned to the props passed by the user
  defaultProps?: Partial<P>;

  parseProps?: {
    [key in PickKeys<P, PS>]: (prop: P[key]) => PS[key]; // keys in PS must be in P
  };
};

export const createFeature = <
  // the given user properties with preprocessed properties (parsed by the 'parseProps' option)
  P extends any,
  //  the state that was passed from previous feature
  S extends any = PlainObject,
  // the change of the state caused by the current feature
  K extends PlainObject | void = PlainObject,
  // parsed properties
  PS extends { [key in PickKeys<P, PS>]?: any } = {},
  // prefer values from parsed properties
  PKK extends any = { [key in keyof P]: key extends keyof PS ? PS[key] : P[key] }
>(
  features: XarrowFeature<P, S, K, PS, PKK>
): XarrowFeature<P, S, K, PS, PKK> => {
  return features;
};

// type getProps<T> = UnionToIntersection<T extends XarrowFeature<infer S>[] ? S : never>;
type getProps<T> = UnionToIntersection<
  T extends Array<infer S> ? (S extends XarrowFeature<infer K, infer K1, infer K2, infer K3> ? K : never) : never
>;

// type t1 = getProps<[XarrowFeature<CoreProps, {}, CoreStateChange>, XarrowFeature<AnchorsProps>]>;

const XarrowBuilder = <T extends any[]>(features: T): React.FC<getProps<T>> => {
  // console.log('XarrowBuilder');
  const stateFuncs = features.filter((f) => f.state).map((f) => f.state);
  const jsxFuncs = features.filter((f) => f.jsx).map((f) => f.jsx);

  const parsePropsFuncs = {};
  for (let i = 0; i < features.length; i++) Object.assign(parsePropsFuncs, features[i].parseProps);

  // **the state is being held in this scope so the state would remain the same between renders**
  const state = {};

  const XarrowDish: React.FC<getProps<T>> = (props) => {
    // console.log('XarrowBuilder XarrowDish render');
    const parsedJSX: React.ReactElement[] = [];

    let Jsx: JSX.Element;

    const parsedProps = { ...(props as {}) };
    for (let i = 0; i < features.length; i++) {
      const featureProps = features[i].parseProps;
      if (featureProps) {
        for (const key in featureProps) {
          const func = featureProps[key];
          parsedProps[key] = func(props[key]);
        }
      }
    }

    //build state object for current render
    for (let i = 0; i < stateFuncs.length; i++) {
      Object.assign(state, stateFuncs[i]({ state, props: parsedProps }));
      // mergeLD(state, stateFuncs[i]({ state, props: parsedProps }));
    }

    for (let i = 0; i < jsxFuncs.length; i++) {
      let Jsx = jsxFuncs[i]({
        state: state,
        props: parsedProps,
        // nextJsx: () => nextFunc(1),
        selfTree: parsedJSX,
      });
      parsedJSX.push(Jsx);

      // Object.assign(state, jsxFuncs[i]({ state, props: parsedProps }));
      // mergeLD(state, stateFuncs[i]({ state, props: parsedProps }));
    }

    // // get next jsx for each feature
    // let next;
    // let nextFunc = (i) => {
    //   next = jsxFuncs[i] || (() => null);
    //   return next({
    //     state: state,
    //     props: parsedProps,
    //     nextJsx: () => nextFunc(i + 1),
    //   });
    // };
    // Jsx = jsxFuncs[0]({
    //   state: state,
    //   props: parsedProps,
    //   nextJsx: () => nextFunc(1),
    //   children: parsedJSX,
    // });
    // console.log('parsedJSX', parsedJSX);
    // parsedJSX.push(Jsx)
    return React.Children.toArray(parsedJSX) as any;
  };
  const propTypes = {};
  for (let i = 0; i < features.length; i++) Object.assign(propTypes, features[i].propTypes);
  XarrowDish.propTypes = propTypes;
  const defaultProps = {};
  for (let i = 0; i < features.length; i++) Object.assign(defaultProps, features[i].defaultProps);
  XarrowDish.defaultProps = defaultProps;
  return XarrowDish;
};
export default XarrowBuilder;

export const createFeatures = <T extends readonly any[]>(features: T): Writable<T> => {
  return features;
};
