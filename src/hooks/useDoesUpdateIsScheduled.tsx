import React, { useRef } from 'react';

const wouldUpdate = (currentOwner) => {
  let newObj = currentOwner?.memoizedState;
  // go over the linked list of hooks and find out if there is any pending update
  while (newObj && 'next' in newObj) {
    newObj = newObj['next'];
    if (newObj?.queue?.pending) return true;
  }
  return false;
};

/**
 * does the current executed render is the last scheduled(by react) render
 */
export const useDoesUpdateIsScheduled = () => {
  // @ts-ignore
  // hold the current owner ref so we could call it from effects
  const currentOwner = useRef(React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner?.current);
  return () => wouldUpdate(currentOwner.current);
};

//// usage
// const YourComponent = (props) => {
//   //..
//   // code, hooks ,logic, effects would be here
//   //..
//
//   // should be could from the last useEffect
//   const wouldUpdate = useDoesUpdateIsScheduled();
//   useEffect(() => {
//     console.log(wouldUpdate());
//   });
//
//   return <div>... your jsx here ...</div>;
// };
