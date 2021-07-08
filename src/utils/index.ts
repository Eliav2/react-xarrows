import { refType } from '../types';

export const getElementByPropGiven = (ref: refType): HTMLElement => {
  let myRef;
  if (typeof ref === 'string') {
    // myRef = document.getElementById(ref);
    myRef = document.getElementById(ref);
  } else myRef = ref.current;
  return myRef;
};

// receives string representing a d path and factoring only the numbers
export const factorDpathStr = (d: string, factor) => {
  let l = d.split(/(\d+(?:\.\d+)?)/);
  l = l.map((s) => {
    if (Number(s)) return (Number(s) * factor).toString();
    else return s;
  });
  return l.join('');
};

// debug
export const measureFunc = (callbackFunc: Function, name = '') => {
  const t = performance.now();

  const returnVal = callbackFunc();
  console.log('time ', name, ':', performance.now() - t);
  return returnVal;
};

// export const measureFunc = (func: Function, name = '') => (...args) => {
//   const t = performance.now();
//
//   console.log(this, func.name, ...args);
//   const returnVal = func(...args);
//   console.log('time ', func.name || name, ':', performance.now() - t);
//   return returnVal;
// };
//// example
// instead: myFunc(arg1,arg2)
// call: measureFunc(myFunc)(arg1,arg2)
