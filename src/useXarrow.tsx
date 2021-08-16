import React, { useContext, useLayoutEffect, useState } from 'react';
import { XelemContext } from './Xwrapper';

const useXarrow = () => {
  const [mount, setMount] = useState(false);
  const [, setRender] = useState({});
  const reRender = () => setRender({});

  let updateXarrow = useContext(XelemContext);
  if (!updateXarrow) {
    if (mount)
      updateXarrow = () => {
        console.warn(
          "react-xarrow: can't find Xwrapper around connected element instance!\n" +
            'useXarrow hook would not trigger update on Xarrow instances!\n' +
            'wrap connected elements with Xwrapper.'
        );
      };
    else updateXarrow = () => {};
  }

  useLayoutEffect(() => {
    updateXarrow();
  });
  useLayoutEffect(() => {
    // console.log('mount');
    setMount(true);
  }, []);

  return reRender;
};

export default useXarrow;
