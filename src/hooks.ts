import React, { useEffect, useReducer, useRef } from 'react';
// import {} from 'react/umd/';

// import isEqual from 'lodash.isequal';

function useDeepCompareMemoize(value) {
  const ref = useRef();
  console.log('useDeepCompareMemoize');
  // it can be done by using useMemo as well
  // but useRef is rather cleaner and easier

  if (value !== ref.current) {
    ref.current = value;
  }
  return ref.current;
}

// runs only once after one of the dependencies have changed
export const useWhenFirstChanged = (func, deps) => {
  const changed = useRef(false);
  // const mem_deps = deps.map(useDeepCompareMemoize);

  useEffect(() => {
    if (!changed.current) {
      func();
      changed.current = true;
    }
  }, deps);
};

// export const useCallOnNextIteration = (deps?) => {
//   // the render count of the parent component
//   const depsRenderCount = useRef(0);
//   const runOnNextRender = (func, renderCount = 1) => {
//     if (depsRenderCount.current === renderCount) func();
//   };
//   useEffect(() => {
//     depsRenderCount.current += 1;
//   }, deps);
//   return runOnNextRender;
// };

// will run 'func' on the callCount nth call of the callFunc.current function
export const useCallOnNextIteration = () => {
  const _callCount = useRef(0);
  const callIn = useRef({});
  const callFunc = useRef((func, callCount = 1) => {
    const next = _callCount.current + callCount;
    if (!(next in callIn.current)) callIn.current[next] = [];
    // schedule the func to be called in the 'next' nth call
    callIn.current[next].unshift(func);
    // call any functions scheduled for now
    if (_callCount.current in callIn.current) {
      callIn.current[_callCount.current].forEach((func) => func());
      delete callIn[_callCount.current];
    }
    _callCount.current += 1;
  });
  return callFunc.current;
};
//// example usage
// const callOnNextIteration = useCallOnNextIteration();
// for (let i = 0; i < 10; i++) {
//   console.log('i=', i);
//   callOnNextIteration(() => console.log('callOnNextIteration call', i), 5);
// }

// // will run 'func' on the renderCount nth render
// export const useCallOnNextRender = (deps?) => {
//   //for force update logic
//   const [, forceUpdate] = useReducer((x) => x + 1, 0);
//   const _callCount = useRef<null | number>(null);
//   //for next renders logic
//   const _renderCount = useRef(0);
//   const callOnNextIteration = useRef(useCallOnNextIteration());
//   const callOnNextRender = useRef((func, callCount = 1, forceRender = false) => {
//     //handle cases for force update
//     if (forceRender && (_callCount?.current < callCount ?? true)) {
//       if (_callCount === null) _callCount.current = callCount;
//       else _callCount.current += 1;
//       forceUpdate();
//     }
//     return callOnNextIteration.current(func, callCount);
//   });
//   useEffect(() => {
//     console.log('!');
//     _renderCount.current += 1;
//   }, deps);
//   return callOnNextRender.current;
// };

type renderQueue = { [renderCount: number]: { callback: Function; forceRender: boolean }[] };
const test = () => {};

// will run 'func' on the renderCount nth render of the renderFunc.current function
export const useCallOnNextRender = (deps?) => {
  //for force update logic
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  //for next renders logic
  const _renderCount = useRef(0);
  const renderIn = useRef<renderQueue>({});
  const renderFunc = useRef((func, renderCount = 1, forceRender = false) => {
    const next = _renderCount.current + renderCount;
    if (!(next in renderIn.current)) renderIn.current[next] = [];
    // schedule the func to be rendered in the 'next' nth render
    renderIn.current[next].unshift({ callback: func, forceRender });
  });
  useEffect(() => {
    // force update if requested
    for (const [renderCount, scheduledCalls] of Object.entries(renderIn.current)) {
      // if one of the scheduled calls are forced then force re-render to the wanted renderCount
      let breakFlag = false;
      for (const call of scheduledCalls) {
        if (call.forceRender && (Number(renderCount) > _renderCount.current ?? true)) {
          forceUpdate();
          breakFlag = true;
          break;
        }
      }
      if (breakFlag) break;
    }
    // call any functions scheduled for this render
    if (_renderCount.current in renderIn.current) {
      const currentCalls = renderIn.current[_renderCount.current];
      currentCalls.forEach((call) => call.callback());
      delete renderIn[_renderCount.current];
    }

    //update render count
    _renderCount.current += 1;
  }, deps);
  return renderFunc.current;
};

// will run 'func' on the renderCount nth render
// export const useCallOnNextRender = (func, deps?, renderCount = 1) => {
//   const _renderCount = useRef(0);
//   const renderIn = useRef({});
//   const renderFunc = useRef((func, renderCount = 1) => {
//     renderIn.current[_renderCount.current + renderCount] = func;
//     if (_renderCount.current in renderIn.current) {
//       func();
//       delete renderIn[_renderCount.current];
//     }
//   });
//   useEffect(() => {
//     _renderCount.current += 1;
//   }, deps);
//   return renderFunc.current;
// };

// export const runOnNextRender = (func = () => {}, renderCount = 1) => {
//   const Component = () => {
//     useEffect(() => {}, []);
//     return <> </>;
//     const func = () => {};
//   };
//   console.log(Component);
// };
