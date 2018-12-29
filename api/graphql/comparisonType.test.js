const {
  resolvers: { ComparisonType }
} = require("./comparisonType");
const { COMPARISON_TYPES } = require("../domain/filters/filters");

describe("ComparisonType enum values", () => {
  COMPARISON_TYPES.forEach(type => {
    it(`should map '${type}' to '${type}'`, () => {
      expect(ComparisonType[type]).toEqual(type);
    });
  });
});
