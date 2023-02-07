// @ts-ignore
import React from "react";
import { expect, test, describe } from "vitest";
import PositionProvider, { usePositionProvider, usePositionProviderRegister } from "../src/redesign/providers/PositionProvider";
import { render } from "@testing-library/react";
import { HeadProvider } from "../src";

describe("Provider", () => {
  test("provider takes aggregated values from previous values(from the same type) in the tree", () => {
    render(
      <PositionProvider value={{ x: 1, y: 1 }}>
        <PositionProvider value={{ y: 2 }}>
          {(val) => {
            expect(val).toEqual({ x: 1, y: 2 });
            return (
              <div>
                <PositionProvider value={{ z: 10 }}>
                  <HeadProvider value={{ x: 10, y: 10, z: 10 }}>
                    <PositionProvider>
                      {(val) => {
                        expect(val).toEqual({ x: 1, y: 2, z: 10 });
                        return <div></div>;
                      }}
                    </PositionProvider>
                  </HeadProvider>
                </PositionProvider>
              </div>
            );
          }}
        </PositionProvider>
      </PositionProvider>
    );
  });
  test("simple: provider takes aggregated values from previous values(from the same type) in the tree", () => {
    render(
      <PositionProvider value={{ x: 1, y: 1 }}>
        <PositionProvider value={{ y: 2 }}>
          {(val) => {
            expect(val).toEqual({ x: 1, y: 2 });
            return <div></div>;
          }}
        </PositionProvider>
      </PositionProvider>
    );
  });

  test("provider function values that takes the previous value and change it change it reliably(change is not effected by StrictMode)", () => {
    const SomeComponent = () => {
      console.log("SomeComponent");
      const val = usePositionProvider();
      // console.log("val", val);
      expect(val).toEqual({ x: 11, y: 2 });
      return <div></div>;
    };

    const SomeTestTree = () => {
      return (
        <PositionProvider value={{ x: 1, y: 2 }}>
          <PositionProvider
            value={(val) => {
              val.x += 10;
              return val;
            }}
          >
            <SomeComponent />
          </PositionProvider>
        </PositionProvider>
      );
    };

    // works without StrictMode
    render(<SomeTestTree />);
    // works with StrictMode
    render(
      <React.StrictMode>
        <SomeTestTree />
      </React.StrictMode>
    );
  });

  test("provider respects registered functions", () => {
    const SomeRegisteredComponent = () => {
      usePositionProviderRegister((prevVal) => {
        console.log("prevVal", prevVal);
        return { ...prevVal, x: prevVal.x + 1 };
      });
      return <div></div>;
    };
    const SomeOtherComponent = () => {
      const val = usePositionProvider();
      console.log(val);
      // expect(val).toEqual({ x: 2, y: 1 });
      return <div></div>;
    };

    render(
      <PositionProvider value={{ x: 1, y: 1 }}>
        <SomeRegisteredComponent />
        <SomeOtherComponent />
      </PositionProvider>
    );
  });
});
