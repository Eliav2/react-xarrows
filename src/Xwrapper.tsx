import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

export const XelemContext = React.createContext(null as () => void);
export const XarrowContext = React.createContext(null as () => void);

const updateRef = {};
let updateRefCount = 0;

const log = console.log;

const XarrowProvider = ({ children, instanceCount }) => {
  // log('Xwrapper module');

  // const first = useRef(true);
  const [, setRender] = useState({});
  const updateXarrow = () => setRender({});
  useLayoutEffect(() => {
    updateRef[instanceCount] = updateXarrow;
    // if (first.current) {
    //   log('XarrowProvider first render!', updateRefCount);
    // first.current = false;
    // updateXarrow();
    // }
  }, []);
  // log('XarrowProvider', updateRefCount);
  return <XarrowContext.Provider value={updateXarrow}>{children}</XarrowContext.Provider>;
};

const XelemProvider = ({ children, instanceCount }) => {
  // const first = useRef(true);
  // useLayoutEffect(() => {
  //   if (first.current) {
  //     log('XarrowProvider first render!', updateRefCount);
  //     updateRefCount++;
  //     first.current = false;
  //   }
  // }, []);

  // log('XelemProvider', updateRefCount - 1);
  return <XelemContext.Provider value={updateRef[instanceCount]}>{children}</XelemContext.Provider>;
};

const Xwrapper = ({ children }) => {
  const instanceCount = useRef(updateRefCount);
  const [, setRender] = useState({});
  useEffect(() => {
    updateRefCount++;
    setRender({});
    return () => {
      delete updateRef[instanceCount.current];
      // updateRefCount--;
    };
  }, []);

  return (
    <XelemProvider instanceCount={instanceCount}>
      <XarrowProvider instanceCount={instanceCount}>{children}</XarrowProvider>
    </XelemProvider>
  );
};

export default Xwrapper;
