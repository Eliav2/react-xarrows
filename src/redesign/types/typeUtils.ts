export type ToArray<Type> = [Type] extends [any] ? Type[] : never;

export type OneOrMore<T> = T | ToArray<T>;

// includes at list the given props but may have more
export type Contains<T extends object> = T & { [key in string | number]: any };
export type RemoveFunctions<T> = Exclude<T, Function>;
