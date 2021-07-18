import React, { useContext, useLayoutEffect, useState } from 'react';
import { XelemContext } from './Xwrapper';

const useXarrow = () => {
  const [, setRender] = useState({});
  const reRender = () => setRender({});

  const updateXarrow = useContext(XelemContext);
  if (!updateXarrow)
    throw new Error(
      "'Xwrapper' is required around element using 'useXarrow' hook! wrap your xarrows and connected elements with Xwrapper! "
    );

  useLayoutEffect(() => {
    updateXarrow();
  });
  return reRender;
};

export default useXarrow;
