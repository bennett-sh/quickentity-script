import assert from "assert";
import { Location } from "../../dist/src/lib.js";
import {
  getMissionBrickPath,
  getMissionTemplatePath,
  getPath,
} from "../../dist/src/utils/paths.js";

describe("Path Utilities", () => {
  it("should get temp's and tblu's of a path", () => {
    const path = getPath("[assembly:/_pro/something.entitytemplate]");

    assert.strictEqual(
      path.factory,
      "[assembly:/_pro/something.entitytemplate].pc_entitytype",
    );
    assert.strictEqual(
      path.blueprint,
      "[assembly:/_pro/something.entitytemplate].pc_entityblueprint",
    );
  });

  it("should get a mission brick path", () => {
    assert.deepStrictEqual(getMissionBrickPath(Location.Safehouse, "test"), {
      factory: "[assembly:/_pro/scenes/missions/snug/test.brick].pc_entitytype",
      blueprint:
        "[assembly:/_pro/scenes/missions/snug/test.brick].pc_entityblueprint",
    });
  });

  it("should get a mission template path", () => {
    assert.deepStrictEqual(getMissionTemplatePath(Location.Safehouse, "test"), {
      factory:
        "[assembly:/_pro/scenes/missions/snug/test.entitytemplate].pc_entitytype",
      blueprint:
        "[assembly:/_pro/scenes/missions/snug/test.entitytemplate].pc_entityblueprint",
    });
  });
});
