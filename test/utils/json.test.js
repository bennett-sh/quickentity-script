import assert from "assert";
import { buildJSON } from "../../dist/src/utils/json.js";

describe("JSON Builder", () => {
  it("build it properly", () => {
    [
      [
        buildJSON({ a: 1, b: "test" })
          .setIf(true, "c", 2)
          .setIf(false, "c", 1)
          .setIf(true, "a", -1)
          .build(),
        {
          a: -1,
          b: "test",
          c: 2,
        },
      ],
      [
        buildJSON({ a: false })
          .addIf(true, {
            a: true,
            b: true,
          })
          .build(),
        {
          a: true,
          b: true,
        },
      ],
    ].forEach(([src, expected]) =>
      assert(JSON.stringify(src), JSON.stringify(expected)),
    );
  });

  it("strip null values", () => {
    assert(
      JSON.stringify(
        buildJSON({ a: null, b: true, c: false, d: undefined }).build(),
      ),
      JSON.stringify({
        b: true,
        c: false,
      }),
    );
  });
});
