import React, { useContext } from 'react';
import { XelemContext } from './Xwrapper';

const Xelem = ({ children }) => {
  const value = useContext(XelemContext);
  console.log('Xelem', value);

  return children;
};

export default Xelem;
