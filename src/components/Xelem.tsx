import React, { useContext, useLayoutEffect, useRef, useState } from 'react';
import { XelemContext } from './Xwrapper';
import { useXarrow } from '../index';
import { XElementType } from '../privateTypes';

export interface XelemProps {
  children: (updateXarrow: () => void) => React.ReactElement;
}
const Xelem: React.FC<XelemProps> = ({ children }) => {
  const updateXarrow = useXarrow();
  return children(updateXarrow);
};

export default Xelem;
