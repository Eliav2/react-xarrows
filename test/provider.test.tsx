import React from "react";
import { expect, test, describe } from "vitest";
import PositionProvider from "../src/redesign/providers/PositionProvider";
import { render } from "@testing-library/react";

describe("Provider", () => {
  test("provider takes aggregated values from previous values in the tree", () => {
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
});
