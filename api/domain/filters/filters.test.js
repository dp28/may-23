const {
  equal,
  notEqual,
  EQUAL,
  NOT_EQUAL,
  CONTAINED_IN,
  containedIn
} = require("./filters");

const path = ["some", 0, "possible", "path"];
const value = 1;

function itShouldBehaveLikeAFilter(comparisonType, namedFilter) {
  const [name, filter] = Object.entries(namedFilter)[0];

  describe(`filters.${name}`, () => {
    it("should have the passed-in propertyPath property", () => {
      expect(filter(path, value).propertyPath).toEqual(path);
    });

    it("should have the passed-in value property", () => {
      expect(filter(path, value).value).toEqual(value);
    });

    it(`should have the comparisonType property '${comparisonType}'`, () => {
      expect(filter(path, value).comparisonType).toEqual(comparisonType);
    });
  });
}

itShouldBehaveLikeAFilter(EQUAL, { equal });
itShouldBehaveLikeAFilter(NOT_EQUAL, { notEqual });
itShouldBehaveLikeAFilter(CONTAINED_IN, { containedIn });
