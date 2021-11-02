import React, { useContext, useLayoutEffect, useRef, useState } from 'react';
import { XelemContext } from './Xwrapper';

const useXarrow = () => {
  // console.log('useXarrow');
  const [mount, setMount] = useState(false);
  // const [, setRender] = useState({});
  // const reRender = () => setRender({});

  // const compName = useRef(
  //   // @ts-ignore
  //   React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner.current.type.displayName
  // );
  let updateXarrow = useContext(XelemContext);
  if (!updateXarrow) {
    if (mount)
      updateXarrow = () => {
        console.warn(
          `react-xarrow: can't find Xwrapper around component which consumes 'useXarrow' hook !\n` +
            'useXarrow hook would not trigger update on Xarrow instances!\n' +
            `wrap connected elements with Xwrapper, and consume 'useXarrow' hook only on them`
        );
      };
    else updateXarrow = () => {};
  }

  // let updateWithTest = () => {
  //   if (!updateXarrow) {
  //     if (mount) {
  //       updateXarrow = () => {
  //         console.warn(
  //           "react-xarrow: can't find Xwrapper around connected element instance!\n" +
  //             'useXarrow hook would not trigger update on Xarrow instances!\n' +
  //             'wrap connected elements with Xwrapper.'
  //         );
  //       };
  //       reRender();
  //     } else updateXarrow = () => {};
  //   }
  //
  //   updateXarrow();
  // };

  // updateXarrow();
  // useLayoutEffect(() => {
  //   updateXarrow();
  // });

  useLayoutEffect(() => {
    // console.log('mount');
    setMount(true);
  }, []);

  return updateXarrow;
};

export default useXarrow;
