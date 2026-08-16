import React from 'react';
import { anchorNamedType, labelType } from './types';

export type dimensionType = {
  x: number;
  y: number;
  right: number;
  bottom: number;
};

export type anchorEdgeType = 'left' | 'right' | 'top' | 'bottom';

/**
 * An anchor after parsing. parseAnchor expands 'auto' into the four edges and
 * fills in the offset, so neither is optional past that point. Keeping the
 * user-facing anchorCustomPositionType here instead would leave 'auto' in the
 * union and make every lookup by position look like it could miss.
 */
export type parsedAnchorType = {
  position: Exclude<anchorNamedType, 'auto'>;
  offset: { x: number; y: number };
};

/**
 * An arrow edge shape after parsing. parseEdgeShape resolves the shape name and
 * fills both fields in, so neither is optional past that point - which is what
 * lets getPosition do arithmetic on offsetForward without a null check at every
 * one of its fifteen uses.
 */
export type parsedEdgeShapeType = {
  svgElem: React.ReactElement;
  offsetForward: number;
};

/** Labels after parsing: always all three keys, each either a label or null. */
export type parsedLabelsType = {
  start: labelType | null;
  middle: labelType | null;
  end: labelType | null;
};
