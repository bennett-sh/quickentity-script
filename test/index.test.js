import assert from "assert";
import { createPatch } from "../dist/src/lib.js";

describe("Creating Patches", () => {
  it("should create an empty patch", () => {
    assert.deepStrictEqual(
      createPatch("temp", "tblu").buildPatch({ includeSchema: false }),
      {
        tempHash: "00801AA532C1CEC3",
        tbluHash: "00A99D60B16CBBB3",
        patch: [],
        patchVersion: 6,
      },
    );
  });
});
