// we can have a helper/utility for this
import { test } from "vitest";
import { Context } from "react";

function weaken(klass: { new (...args: any[]): any }) {
  return class extends klass {};
}

class A {
  method(): string {
    return "string";
  }

  method2(): string {
    return "string";
  }
}

class B extends weaken(A, "") {
  method(): number {
    return 1;
  }

  method2(): number {
    return 1;
  }
}

test("weaken", () => {
  const a = new A();
  const b = new B();
  console.log(a.method2());
  console.log(b.method2());
});

import produce from "immer";

test("test immer", () => {
  const obj = { a: { ab: 1, ac: 2 }, b: 2 };
  const newObj = produce(obj, (draft) => {
    draft.a.ac = 3;
  });
  console.log(obj, newObj);
});

// import React from "react";
//
// type MyContextProps = {
//   value?: any;
// };
//
// const MyContext = React.createContext<MyContextProps>({
//   value: undefined,
// });
//
// export const useMyContext = () => {
//   const val = React.useContext(MyContext);
//   return val?.value;
// };
