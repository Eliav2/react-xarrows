import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { XelemContext } from './Xwrapper';

const useXarrow = () => {
  const [, setRender] = useState({});
  const reRender = () => setRender({});

  const updateXarrow = useContext(XelemContext);

  useLayoutEffect(() => {
    updateXarrow();
  });
  return reRender;
};

export default useXarrow;
