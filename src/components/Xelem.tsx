import React from 'react';
import { useXarrow } from '../index';

export interface XelemProps {
  children: (updateXarrow: () => void) => React.ReactElement;
}
const Xelem: React.FC<XelemProps> = ({ children }) => {
  const updateXarrow = useXarrow();
  return children(updateXarrow);
};

export default Xelem;
