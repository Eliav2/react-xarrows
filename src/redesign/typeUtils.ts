export type ToArray<Type> = [Type] extends [any] ? Type[] : never;
export type OneOrMore<T> = T | ToArray<T>;
