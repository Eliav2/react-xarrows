import React, { FC, useEffect, useRef, useState } from 'react';

type updateXarrowFunc = () => void;

// The default really is null - a component outside any Xwrapper reads it - so
// the type says so rather than casting the null away.
export const XelemContext = React.createContext<updateXarrowFunc | null>(null);
export const XarrowContext = React.createContext<updateXarrowFunc | null>(null);

const updateRef: Record<number, updateXarrowFunc> = {};
let updateRefCount = 0;

// React 18 dropped the implicit `children` prop from FC, so it is declared explicitly here.
type ProviderProps = {
  instanceCount: React.MutableRefObject<number>;
  children?: React.ReactNode;
};

const XarrowProvider: FC<ProviderProps> = ({ children, instanceCount }) => {
  const [, setRender] = useState({});
  const updateXarrow = () => setRender({});
  useEffect(() => {
    instanceCount.current = updateRefCount; // so this instance would know what is id
    updateRef[instanceCount.current] = updateXarrow;
  }, []);
  // log('XarrowProvider', updateRefCount);
  return <XarrowContext.Provider value={updateXarrow}>{children}</XarrowContext.Provider>;
};

const XelemProvider: FC<ProviderProps> = ({ children, instanceCount }) => {
  return <XelemContext.Provider value={updateRef[instanceCount.current]}>{children}</XelemContext.Provider>;
};

const Xwrapper: FC<{ children?: React.ReactNode }> = ({ children }) => {
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
