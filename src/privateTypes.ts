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
export type XElementType = { position: containsPointType; element: HTMLElement };

export type ToArray<Type> = [Type] extends [any] ? Type[] : never;
export type OneOrMore<T> = T | ToArray<T>;

const toArray = <T>(arg: T | T[]): T[] => {
  return Array.isArray(arg) ? arg : [arg];
};
