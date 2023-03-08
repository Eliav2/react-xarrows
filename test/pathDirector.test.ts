import { expect, test, describe } from "vitest";

import PathDirector from "../src/path/pathDirector";

describe("PathDirector", () => {
  test("initialize PathDirector", () => {
    const pathDirector = new PathDirector([
      {
        condition: () => true,
        instructions: ({}) => {
          return [];
        },
      },
    ]);
    expect(pathDirector).toBeDefined();
  });
});
