import { RegisteredManager, useRegisteredManager } from "../internal/RegisteredManager";
import { AnyObj } from "shared/types";
import React, { useRef } from "react";
import { aggregateValues } from "../utils";
import { childrenRenderer } from "../internal/Children";
import { useEnsureContext } from "../internal/hooks";
import produce, { current } from "immer";

export type ProviderContextProps<Val, RegisterFunc> = {
  value: Val;
  prevVal: ProviderContextProps<Val, RegisterFunc> | undefined;
  __mounted: boolean;

  //handles registered functions to this provider
  providerManager: RegisteredManager<RegisterFunc> | null;
};

export const providerContextDefaultVal = {
  value: {} as any,
  prevVal: undefined,
  __mounted: false,
  providerManager: null,
};

/**
 * this function creates a provider(a React Component which provides context) ,a hook to use the provider value,
 * and a hook to register a function to the provider(which can be used to alter the provider value)
 *
 * providers provide an aggregated value from all previous providers from the same type.
 * for example: if there are 2 HeadProvider components in the tree, the value of the deeper HeadProvider will be merged
 * with the value of the first HeadProvider.
 *
 * this function is just a utility function to reduce code duplication in creation of providers
 */
export const createProvider = <Val extends AnyObj = any, ValPrepared extends Val = any>(
  name: string,
  { prepareValue, defaultVal = {} as ValPrepared }: { prepareValue?: (val: Val) => ValPrepared; defaultVal?: ValPrepared }
) => {
  type RegisterFunc = (prevVal: ValPrepared) => ValPrepared;

  // this context value is provided to this provider's children
  const ProviderContext = React.createContext<ProviderContextProps<Val, RegisterFunc>>({
    ...providerContextDefaultVal,
    value: { ...providerContextDefaultVal.value, ...defaultVal },
  });

  // a hook that can be used to use the provider value
  const useProvider = () => {
    const providerContextVal = React.useContext(ProviderContext);
    return providerContextVal?.value;
  };

  // a React Context Component that provides the provider value
  function Component(
    {
      value,
      children,
    }: {
      value?: Val | ((prevVal: Val) => Val);
      children: React.ReactNode;
    },
    forwardRef: React.ForwardedRef<unknown>
  ) {
    // get the previous provider value(if exists)
    const prevVal = React.useContext(ProviderContext);

    // aggregate the value with the previous providers
    let val = aggregateValues(value, prevVal, "prevVal", (context) => context?.value);

    // a manager to handle registered functions
    const providerManager = useRef(new RegisteredManager<RegisterFunc>());

    // prepare the value to a more developer friendly value
    const preparedValue: ValPrepared = prepareValue ? prepareValue(val) : (val as unknown as ValPrepared);

    // use immer to update the provided value by calling all registered functions
    let alteredVal = { ...preparedValue };
    alteredVal = produce(alteredVal, (draft) => {
      Object.values(providerManager.current.registered).forEach((change) => {
        alteredVal = change(current(draft) as ValPrepared);
      });
    });

    return (
      <ProviderContext.Provider
        value={{
          value: alteredVal,
          prevVal,
          __mounted: true,
          providerManager: providerManager.current,
        }}
      >
        {childrenRenderer(children, value, forwardRef)}
      </ProviderContext.Provider>
    );
  }

  // define name for the component in the React DevTools
  Object.defineProperty(Component, "name", { value: name, writable: false });

  // a hook that can be used to register a function to the provider
  const useProviderRegister = (func: (prevVal: ValPrepared) => ValPrepared, noWarn = false, dependencies: any[] = []) => {
    const provider = React.useContext(ProviderContext);
    useEnsureContext(provider, name, `use${name}Register`, { noWarn });
    // const HeadId = useRegisteredManager(headProvider.HeadsManager, mounted, func);
    const regId = useRegisteredManager(provider.providerManager, func, dependencies);
    return regId;
  };

  // forward the ref to the component (correctly handle ref forwarding)
  const ProviderFRef = React.forwardRef(Component);
  return { Provider: ProviderFRef, useProvider, useProviderRegister };
};
