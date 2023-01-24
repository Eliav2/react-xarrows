import React, { useLayoutEffect, useRef } from "react";
import { useEnsureContext } from "./internal/hooks";
import { RegisteredManager } from "./internal/RegisteredManager";

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

interface XWrapperProps {
  children: React.ReactNode;
}

/**
 * receives a function(usually render a function) that would be executed whenever the XWrapper is updated.
 * whenever an update is requested on a XWrapper, it will call all the registered XArrows render functions.
 */
export const useXWrapperRegister = (render, noWarn = false) => {
  const xWrapperContext = useXWrapperContext({ noWarn });
  const XArrowId = useRef<number>(null as unknown as number); // the id would be received from the XWrapper wrapper
  const mounted = useEnsureContext(xWrapperContext, "XWrapper", "useXWrapperRegister", { noWarn });
  useLayoutEffect(() => {
    if (!mounted) return;
    XArrowId.current = xWrapperContext.xWrapperXArrowsManager!.register(render);
    return () => {
      if (!mounted) return;
      xWrapperContext.xWrapperXArrowsManager!.unregister(XArrowId.current);
    };
  }, []);
};
