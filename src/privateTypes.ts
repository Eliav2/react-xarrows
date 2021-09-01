export type posType = {
  x: number;
  y: number;
  right: number;
  bottom: number;
};

export type anchorEdgeType = 'left' | 'right' | 'top' | 'bottom';

// pick the common props between 2 objects
export type Common<A, B> = {
  [P in keyof A & keyof B]: A[P] | B[P];
};

export type Contains<T extends object> = T & { [key in string | number]: any };
export type XElementType = { position: posType; element: HTMLElement };
