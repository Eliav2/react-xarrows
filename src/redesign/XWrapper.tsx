import React, { useLayoutEffect, useRef } from "react";
import useRerender from "shared/hooks/useRerender";

export const XWrapper = (props: XWrapperProps) => {
  // console.log("XWrapper");
  const xWrapperManager = useRef(new XWrapperManager());
  const update = () => {
    // updates all XArrows under this XWrapper
    for (let XArrowUpdate of Object.values(xWrapperManager.current.registered)) {
      XArrowUpdate();
    }
  };
  return (
    <XWrapperContext.Provider value={{ update, xWrapperXArrowsManager: xWrapperManager.current }}>
      {props.children}
    </XWrapperContext.Provider>
  );
};

/**
 * this class holds the registered XArrows and their render functions.
 * whenever an update is requested on a XWrapper, it will call all the registered XArrows render functions.
 */
class XWrapperManager {
  registered: { [key: string]: () => void } = {};
  private missingIndexes = new Set<number>();
  private countRegisteredXArrows = 0;

  constructor() {
    this.registered = {};
  }

  private getAvailableIndex(): number {
    //returns the next available index.
    if (this.missingIndexes.size === 0) return this.countRegisteredXArrows;
    else return this.missingIndexes.values().next().value;
  }

  register(render): number {
    const id = this.getAvailableIndex();
    this.missingIndexes.delete(id);
    this.registered[id] = render;
    this.countRegisteredXArrows++;
    return id;
  }

  unregister(id: number) {
    delete this.registered[id];
    this.missingIndexes.add(id);
    this.countRegisteredXArrows--;
  }
}

interface XWrapperProps {
  children: React.ReactNode;
}

const XWrapperContextDefault = {
  update: () => {},
  xWrapperXArrowsManager: {},
} as { update: () => void; xWrapperXArrowsManager: XWrapperManager };

const XWrapperContext = React.createContext(XWrapperContextDefault);
export const useXWrapperContext = () => React.useContext(XWrapperContext);
export const useUpdateXWrapper = () => useXWrapperContext().update;

/**
 * receives a function(usually render a function) that would be executed whenever the XWrapper is updated.
 */
export const useXWrapperRegister = (render) => {
  // console.log("useXWrapperRegister");
  const xWrapperContext = useXWrapperContext();
  const XArrowId = useRef(0);
  useLayoutEffect(() => {
    XArrowId.current = xWrapperContext.xWrapperXArrowsManager.register(render);
    return () => {
      xWrapperContext.xWrapperXArrowsManager.unregister(XArrowId.current);
    };
  }, []);
};
