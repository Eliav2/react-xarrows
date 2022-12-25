import { useOneTimeWarn } from "shared/hooks/useOneTimeWarn";
import React from "react";

export const useXArrowWarn = () => useOneTimeWarn("react-xarrows:");

export const useEnsureContext = (
  context: any,
  wrapperName: string,
  hookName: string,
  { mountedProp = "__mounted", additionalInfo = "" } = {}
): boolean => {
  const warn = useXArrowWarn();
  if (!context[mountedProp]) {
    warn(
      `${hookName} is only available inside ${wrapperName}, wrap your component with ${wrapperName} to use it.\n` + additionalInfo
      // +`Check ${new Error().stack?.split("at ")[2].trim()}\n\n`
    );
  }
  return context.__mounted;
};
