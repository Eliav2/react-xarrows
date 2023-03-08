import { RegisteredManager, useRegisteredManager } from "../internal/RegisteredManager";
import { AnyObj } from "shared/types";
import React, { useRef } from "react";
import { aggregateValues } from "../utils";
import { childrenRenderer } from "../internal/Children";
import { useEnsureContext } from "../internal/hooks";
import produce, { current } from "immer";
import useRerender from "shared/hooks/useRerender";
import { deepFreeze } from "shared/utils";
import { useXArrow } from "../XArrow";

export type ProviderContextProps<Val, RegisterFunc> = {
  readonly value: Val;
  prevVal: ProviderContextProps<Val, RegisterFunc> | undefined;
  __mounted: boolean;

  //handles registered functions to this provider
  providerManager: RegisteredManager<RegisterFunc> | null;

  // a function that can be used to force re-render of the provider
  render: () => void;
};

export const providerContextDefaultVal = {
  value: {} as any,
  prevVal: undefined,
  __mounted: false,
  providerManager: null,
  render: () => {},
};

const _debug = (enable?: boolean) => (enable ? console.log : () => {});

/**
 * this function creates a provider(a React Component which provides context) ,a hook to use the provider value,
 * and a hook to register a function to the provider(which can be used to alter the provider value)
 *
 * providers provide an aggregated merged(shallowly) value from all previous providers from the same type.
 * for example: if there are 2 HeadProvider components in the tree, the value of the deeper HeadProvider will be merged
 * with the value of the first HeadProvider.
 *
 * this function is just a utility function to reduce code duplication in creation of providers
 */
export const createProvider = <Val extends AnyObj = any, ValPrepared extends AnyObj = Val>(
  // the provider name, used for debugging and React DevTools
  name: string,
  // options
  {
    prepareValue,
    defaultVal = {} as ValPrepared,
    ...options
  }: {
    // an optional function that can be used to prepare the value before it is provided to the children
    prepareValue?: (val: Val) => ValPrepared;
    // an optional default value for the provider
    defaultVal?: ValPrepared;
    // can be used to debug the provider
    debug?: boolean;
  } = {}
) => {
  const console_debug = _debug(options?.debug); // should be here to avoid double logging on React StrictMode

  type RegisterFunc = (prevVal: ValPrepared) => ValPrepared;

  // this context value is provided to this provider's children
  const ProviderContext = React.createContext<ProviderContextProps<Val, RegisterFunc>>({
    ...providerContextDefaultVal,
    value: { ...providerContextDefaultVal.value, ...defaultVal },
  });

  // a hook that can be used to use the provider value
  const useProvider = () => {
    const providerContextVal = React.useContext(ProviderContext);
    return providerContextVal?.value as ValPrepared & Val;
  };

  // a React Context Component that provides the provider value
  function Component(
    {
      value,
      children,
    }: {
      // the value to provide (this value will be merged with the previous providers values, and can be altered by registered functions)
      value?: Val | ((prevVal: Val) => Val | void); //void is allowed because immer is used
      children: React.ReactNode | ((props: Val) => React.ReactNode) | React.ForwardRefExoticComponent<any>;
    },
    forwardRef: React.ForwardedRef<unknown>
  ) {
    const console_debug = _debug(options?.debug); // should be here to avoid double logging on React StrictMode
    console_debug(name);

    const reRender = useRerender();
    // get the previous provider value(if exists)
    const prevVal = React.useContext(ProviderContext);

    let val = aggregateValues(value, prevVal, "prevVal" as const, (context) => context?.value);

    // a manager to handle registered functions
    const providerManager = useRef(new RegisteredManager<RegisterFunc>());

    // prepare the value to a more developer friendly value
    const preparedValue: ValPrepared = prepareValue ? prepareValue(val) : (val as unknown as ValPrepared);
    // console.log("preparedValue", preparedValue);

    // use immer to update the provided value by calling all registered functions
    const alteredVal = produce(preparedValue, (draft) => {
      Object.values(providerManager.current.registered).forEach((change) => {
        const res = change(draft as ValPrepared);
        if (res) {
          draft = { ...draft, ...res };
        }
      });
    });

    return (
      <ProviderContext.Provider
        value={{
          value: deepFreeze(alteredVal) as any,
          prevVal,
          __mounted: true,
          providerManager: providerManager.current,
          render: reRender,
        }}
      >
        {childrenRenderer(children, alteredVal as any, forwardRef)}
      </ProviderContext.Provider>
    );
  }

  // define name for the component in the React DevTools
  Object.defineProperty(Component, "name", { value: name, writable: false });

  // a hook that can be used to register a function to the provider
  const useProviderRegister = (func: (prevVal: ValPrepared) => ValPrepared | void, dependencies: any[] = [], { noWarn = false } = {}) => {
    const console_debug = _debug(options?.debug); // should be here to avoid double logging on React StrictMode
    console_debug("useProviderRegister", name);
    // const reRender = useRerender();
    const { render: renderXArrow } = useXArrow();
    const provider = React.useContext(ProviderContext);
    useEnsureContext(provider, name, `use${name}Register`, { noWarn });
    // const HeadId = useRegisteredManager(headProvider.HeadsManager, mounted, func);
    const regId = useRegisteredManager(provider.providerManager, func, dependencies, renderXArrow);
    return regId;
  };

  // forward the ref to the component (correctly handle ref forwarding)
  const ProviderFRef = React.forwardRef(Component);
  return {
    Provider: ProviderFRef,
    useProvider,
    useProviderRegister,
    // for internal components(or advanced users)
    Context: ProviderContext,
  };
};
export default createProvider;

// const MyReactComponent = (value = 10) => {
//   let valuePrepared = value;
//   valuePrepared = valuePrepared + 1;
//
//   return <div>{valuePrepared}</div>;
// };
