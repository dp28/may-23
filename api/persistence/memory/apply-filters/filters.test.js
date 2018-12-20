const {
  equal,
  notEqual,
  EQUAL,
  NOT_EQUAL
} = require("../../../domain/filters/filters");
const { matchesInMemory } = require("./filters");

describe(matchesInMemory, () => {
  function itShouldBehaveLikeMatchingByAFilter(namedFilter) {
    const [name, buildFilter] = Object.entries(namedFilter)[0];

    it("should return false if the object does not have the top-level property", () => {
      const filter = buildFilter(["test"], "a");
      expect(matchesInMemory([filter], {})).toBeFalsy();
    });

    it("should return false if the object does not have the nested property", () => {
      const filter = buildFilter(["nested", "test"], "a");
      expect(matchesInMemory([filter], { test: "a" })).toBeFalsy();
    });

    it("should return false if the object has null part way through the path", () => {
      const filter = buildFilter(["nested", "test"], 1);
      expect(matchesInMemory([filter], { nested: null })).toBeFalsy();
    });
  }

  describe(`with an '${EQUAL}' filter`, () => {
    itShouldBehaveLikeMatchingByAFilter({ equal });

    it("should return true if the value of the property strictly equals the value of the filter", () => {
      const filter = equal(["test"], "a");
      expect(matchesInMemory([filter], { test: "a" })).toBeTruthy();
    });

    it("should return false if the value of the property does not strictly equal the value of the filter", () => {
      const filter = equal(["test"], 1);
      expect(matchesInMemory([filter], { test: "1" })).toBeFalsy();
    });
  });

  describe(`with a '${NOT_EQUAL}' filter`, () => {
    itShouldBehaveLikeMatchingByAFilter({ notEqual });

    it("should return true if the value of the property strictly does not equal the value of the filter", () => {
      const filter = notEqual(["test"], 1);
      expect(matchesInMemory([filter], { test: "1" })).toBeTruthy();
    });

    it("should return false if the value of the property strictly equals the value of the filter", () => {
      const filter = notEqual(["test"], 1);
      expect(matchesInMemory([filter], { test: 1 })).toBeFalsy();
    });
  });

  describe("with multiple filters", () => {
    const first = equal(["first"], 1);
    const second = equal(["second"], 2);
    const filters = [first, second];

    it("returns false if neither filter matches", () => {
      expect(matchesInMemory(filters, {})).toBeFalsy();
    });

    it("returns false if only a subset of the filters match", () => {
      expect(matchesInMemory(filters, { first: 1 })).toBeFalsy();
    });

    it("returns true if all of the filters match", () => {
      expect(matchesInMemory(filters, { first: 1, second: 2 })).toBeTruthy();
    });
  });
});
