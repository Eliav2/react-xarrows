import React, { useRef, useState } from 'react';

export const XelemContext = React.createContext(null as () => void);
export const XarrowContext = React.createContext(null as () => void);

const updateRef = {};
let updateRefCount = 0;

const XarrowProvider = ({ children }) => {
  const first = useRef(true);
  const [, setRender] = useState({});
  const updateXarrow = () => setRender({});
  if (first.current) {
    // console.log('first!', updateRefCount);
    updateRef[updateRefCount] = updateXarrow;
    first.current = false;
  }
  // console.log('XarrowProvider', updateRefCount);
  return <XarrowContext.Provider value={updateXarrow}>{children}</XarrowContext.Provider>;
};

const XelemProvider = ({ children }) => {
  const first = useRef(true);
  if (first.current) {
    updateRefCount++;
    first.current = false;
  }

  // console.log('XelemProvider', updateRefCount - 1);
  return <XelemContext.Provider value={updateRef[updateRefCount - 1]}>{children}</XelemContext.Provider>;
};

const Xwrapper = ({ children }) => {
  // console.log('Xwrapper');
  return (
    <XarrowProvider>
      <XelemProvider>{children}</XelemProvider>
    </XarrowProvider>
  );
};

export default Xwrapper;
