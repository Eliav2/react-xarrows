/**
 * this module relays on the order of react lifecycle in order to break dependency between 2 related contexts
 * see more https://stackoverflow.com/questions/68432809/react-break-dependency-between-2-related-contexts-with-top-level-constant-objec
 */

import React, { FC, useEffect, useRef, useState } from 'react';

export const XelemContext = React.createContext(null as () => void);
export const XarrowContext = React.createContext(null as () => void);

// will hold a object of ids:references to updateXarrow functions of different Xwrapper instances over time
const updateRef = {};
let updateRefCount = 0;

const XarrowProvider: FC<{ instanceCount: React.MutableRefObject<number> }> = ({ children, instanceCount }) => {
  const [, setRender] = useState({});
  const updateXarrow = () => setRender({});
  useEffect(() => {
    instanceCount.current = updateRefCount; // so this instance would know what is id
    updateRef[instanceCount.current] = updateXarrow;
  }, []);
  // log('XarrowProvider', updateRefCount);
  return <XarrowContext.Provider value={updateXarrow}>{children}</XarrowContext.Provider>;
};

// renders only once and should always provide the right update function
const XelemProvider = ({ children, instanceCount }) => {
  return <XelemContext.Provider value={updateRef[instanceCount.current]}>{children}</XelemContext.Provider>;
};

const Xwrapper = ({ children }) => {
  const instanceCount = useRef(updateRefCount);
  const [, setRender] = useState({});
  useEffect(() => {
    updateRefCount++;
    setRender({});
    return () => {
      delete updateRef[instanceCount.current];
    };
  }, []);

  return (
    <XelemProvider instanceCount={instanceCount}>
      <XarrowProvider instanceCount={instanceCount}>{children}</XarrowProvider>
    </XelemProvider>
  );
};

export default Xwrapper;
