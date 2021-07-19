export type dimensionType = {
  x: number;
  y: number;
  right: number;
  bottom: number;
};

export type anchorEdgeType = 'left' | 'right' | 'top' | 'bottom';

// pick the common props between 2 objects
type Common<A, B> = {
  [P in keyof A & keyof B]: A[P] | B[P];
};
