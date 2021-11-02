/**
 * receives an optional function to extend. if no extending function was given return the updated pos state string
 *
 * simple words: 2 options:
 *  if you call this function with argument (of function to extend current pos state) it will return a new instance of this function with updated pos.
 *  if you call this function with no arguments it should return a string representing the desired path based on the last posState.
 *
 * @param extendPos function that receives as first argument the current path state, this function should return the new path state
 * @param pathFunc
 * @param posState
 */
import { number } from 'prop-types';
import { Contains, PlainObject } from '../privateTypes';
import { Vector } from '../classes/classes';

export const getPathState: getPathStateType<any> = function getPathState(
  extendPos?: any,
  pathFunc?: any,
  posState: any = {}
) {
  if (extendPos) {
    if (extendPos === 'obj') return posState;
    let newPos = extendPos({ ...posState });
    return (newExtendPos, newPathFunc = pathFunc, _newPos = newPos) => getPathState(newExtendPos, newPathFunc, _newPos);
  } else {
    if (pathFunc) return pathFunc(posState);
    else return posState;
  }
};

export interface getPathStateType<T extends PlainObject = any, K extends string = any> {
  (): K;
  <U extends PlainObject>(extendPos: undefined, pathFunc: undefined, posState: U): K extends undefined ? U : K;
  <U extends PlainObject, M extends string>(extendPos: undefined, pathFunc: (posState: U) => M): M;
  <U extends PlainObject, M extends string>(extendPos: undefined, pathFunc: (posState: U) => M, posState: U): M;
  <U extends PlainObject>(extendPos: (posState: T) => U): getPathStateType<U, K>;
  <U extends PlainObject, U2 extends PlainObject>(
    extendPos: (posState: U) => U2,
    pathFunc: undefined,
    posState: U
  ): getPathStateType<U2, K>;
  <V extends PlainObject, M extends string>(
    extendPos: (posState: T) => V,
    pathFunc: (posState: V) => M
  ): getPathStateType<V, M>;
  <U extends PlainObject, V extends PlainObject, M extends string>(
    extendPos: (posState: U) => V,
    pathFunc: (posState: V) => M,
    posState: U
  ): getPathStateType<V, M>;

  // will return the object
  (extendPos: undefined, pathFunc: null): T;
}

export type PointType = Vector;
export type simplePosType = { start: PointType; end: PointType };
