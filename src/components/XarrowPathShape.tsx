import React from 'react';
import { pathType } from '../types';

export interface XarrowPathShapeAPIProps {
  path?: pathType;
}

export interface XarrowPathShapeProps extends XarrowPathShapeAPIProps {}

const XarrowPathShape: React.FC<XarrowPathShapeProps> = (props) => {
  // if (props.path === 'straight') return;
  return <div />;
};

export default XarrowPathShape;
