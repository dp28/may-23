const dateType = require("./date");
const { typeDefs, resolverMap } = require("./date");

describe("Scalar typeDefs", () => {
  it("should include the Date typeDefs", () => {
    expect(String(typeDefs)).toContain(String(dateType.typeDefs));
  });
});

describe("Scalar resolverMap", () => {
  Object.entries(dateType.resolverMap).forEach(([typeName, resolver]) => {
    it(`should include the resolver for the ${typeName}`, () => {
      expect(resolverMap[typeName]).toEqual(resolver);
    });
  });
});
