import React, { Ref, useRef } from "react";
import { useEnsureContext } from "./internal/hooks";
import { RegisteredManager, useRegisteredManager } from "./internal/RegisteredManager";
import useRerender from "shared/hooks/useRerender";

interface XWrapperProps {
  children: React.ReactNode;
}

export const XWrapper = React.forwardRef(({ children }: XWrapperProps, forwardedRef) => {
  // console.log("XWrapper");
  const xWrapperManager = useRef(new RegisteredManager());
  const update = () => {
    // updates all XArrows under this XWrapper
    for (let XArrowUpdate of Object.values(xWrapperManager.current.registered)) {
      XArrowUpdate();
    }
  };
  return (
    <XWrapperContext.Provider value={{ update, xWrapperXArrowsManager: xWrapperManager.current, __mounted: true }}>
      {(children && React.isValidElement(children) && React.cloneElement(children, { ref: forwardedRef } as any)) || children}
    </XWrapperContext.Provider>
  );
});
export default XWrapper;

const XWrapperContextDefault = {
  update: () => {},
  xWrapperXArrowsManager: null,
  __mounted: false,
} as { update: () => void; xWrapperXArrowsManager: RegisteredManager | null; __mounted: boolean };

const XWrapperContext = React.createContext(XWrapperContextDefault);
export const useXWrapperContext = ({ noWarn = false } = {}) => {
  const val = React.useContext(XWrapperContext);
  useEnsureContext(val, "XWrapper", "useXWrapperContext", { noWarn });

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
 * receives a function(usually render a function) that would be executed whenever the XWrapper is updated.
 * whenever an update is requested on a XWrapper, it will call all the registered XArrows render functions.
 */
export const useXWrapperRegister = (render, noWarn = false) => {
  const reRender = useRerender();
  const xWrapperContext = useXWrapperContext({ noWarn });
  const mounted = useEnsureContext(xWrapperContext, "XWrapper", "useXWrapperRegister", { noWarn });
  // const XArrowId = useRegisteredManager(xWrapperContext.xWrapperXArrowsManager!, mounted, render);
  const XArrowId = useRegisteredManager(xWrapperContext.xWrapperXArrowsManager, render, undefined, reRender);
  return XArrowId;
};
