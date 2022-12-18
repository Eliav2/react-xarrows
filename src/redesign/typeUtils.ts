export type ToArray<Type> = [Type] extends [any] ? Type[] : never;
export type OneOrMore<T> = T | ToArray<T>;
export type Contains<T extends object> = T & { [key in string | number]: any };
