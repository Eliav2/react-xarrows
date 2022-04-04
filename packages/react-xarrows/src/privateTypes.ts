import { OptionalKeys } from 'prop-types';

export interface pointType {
  x: number;
  y: number;
}

export type containsPointType = Contains<pointType>;

// export type Includes<T> = T & { [key: string]: any };

export interface posType extends pointType {
  right: number;
  bottom: number;
  width: number;
  height: number;
}

export const isPosType = (pos: containsPointType): pos is posType => {
  return ['right', 'bottom', 'width', 'height'].every((prop) => prop in pos);
};

export type anchorEdgeType = 'left' | 'right' | 'top' | 'bottom';

// pick the common props between 2 objects
export type Common<A, B> = {
  [P in keyof A & keyof B]: A[P] | B[P];
};

export type Contains<T extends object> = T & { [key in string | number]: any };

export type MaybeContains<T extends object> = Partial<T> & { [key in string | number]: any };
// export type MaybeContains<T extends object> = Record<string, T>;
export type XElementType = { position: containsPointType; element: HTMLElement };

export type ToArray<Type> = [Type] extends [any] ? Type[] : never;
export type OneOrMore<T> = T | ToArray<T>;

const toArray = <T>(arg: T | T[]): T[] => {
  return Array.isArray(arg) ? arg : [arg];
};

export type Primitive = bigint | boolean | null | number | string | symbol | undefined;

// export type PlainObject = Record<string, any>;
export type PlainObject = { [key: string]: any };
export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
export type Writable<T> = { -readonly [P in keyof T]: T[P] };

type OptionalPropertyNames<T> = { [K in keyof T]-?: {} extends { [P in K]: T[K] } ? K : never }[keyof T];

type SpreadProperties<L, R, K extends keyof L & keyof R> = { [P in K]: L[P] | Exclude<R[P], undefined> };

type Id<T> = T extends infer U ? { [K in keyof U]: U[K] } : never;

type SpreadTwo<L, R> = Id<
  Pick<L, Exclude<keyof L, keyof R>> &
    Pick<R, Exclude<keyof R, OptionalPropertyNames<R>>> &
    Pick<R, Exclude<OptionalPropertyNames<R>, keyof L>> &
    SpreadProperties<L, R, OptionalPropertyNames<R> & keyof L>
>;

export type Spread<A extends readonly [...any]> = A extends [infer L, ...infer R] ? SpreadTwo<L, Spread<R>> : unknown;

export type Merge<T1, T2> = Spread<[T1, T2]>;

export type GetIndex<Arr extends Array<any>, T> = Arr extends [...infer Tail, infer Last]
  ? Last extends T
    ? Tail['length']
    : GetIndex<Tail, T>
  : never;

export type RangeUnion<N extends number, Result extends Array<unknown> = []> = Result['length'] extends N
  ? Result[number]
  : RangeUnion<N, [...Result, Result['length']]>;

export interface dimensionType extends pointType {
  right: number;
  bottom: number;
}
export type Mutable<T> = {
  -readonly [K in keyof T]: Mutable<T[K]>;
};

export function removeReadOnly<T>(val: T): Mutable<T> {
  return val;
}
export type Writeable<T> = { -readonly [P in keyof T]: T[P] };
