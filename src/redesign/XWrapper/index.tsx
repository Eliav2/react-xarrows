import React, { useLayoutEffect, useRef } from "react";
import { useEnsureContext, useXArrowWarn } from "../internal/hooks";

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
    <XWrapperContext.Provider value={{ update, xWrapperXArrowsManager: xWrapperManager.current, __mounted: true }}>
      {props.children}
    </XWrapperContext.Provider>
  );
};
export default XWrapper;

const XWrapperContextDefault = {
  update: () => {},
  xWrapperXArrowsManager: null,
  __mounted: false,
} as { update: () => void; xWrapperXArrowsManager: XWrapperManager | null; __mounted: boolean };

const XWrapperContext = React.createContext(XWrapperContextDefault);
export const useXWrapperContext = () => {
  const val = React.useContext(XWrapperContext);
  useEnsureContext(val, "XArrow", "useXWrapperContext");
  // const warn = useXArrowWarn();
  // if (!val.__mounted) {
  //   warn(
  //     "useXArrowContext is only available inside XArrow, wrap your component with XArrow to use it.\n" +
  //       `Check ${new Error().stack?.split("at ")[2].trim()}\n\n`
  //   );
  // }

  return val;
};
export const useUpdateXWrapper = () => {
  const val = React.useContext(XWrapperContext);
  useEnsureContext(val, "XWrapper", "useUpdateXWrapper", {
    additionalInfo: "You won't be able to update XArrows without XWrapper wrapper",
  });
  return val.update;
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

/**
 * receives a function(usually render a function) that would be executed whenever the XWrapper is updated.
 */
export const useXWrapperRegister = (render) => {
  const xWrapperContext = useXWrapperContext();
  const XArrowId = useRef(0);
  const mounted = useEnsureContext(xWrapperContext, "XWrapper", "useXWrapperRegister");
  useLayoutEffect(() => {
    if (!mounted) return;
    XArrowId.current = xWrapperContext.xWrapperXArrowsManager!.register(render);
    return () => {
      if (!mounted) return;
      xWrapperContext.xWrapperXArrowsManager!.unregister(XArrowId.current);
    };
  }, []);
};
