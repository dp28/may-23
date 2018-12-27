const dateType = require("./date");
const { typeDefs, resolvers } = require("./date");

describe("Scalar typeDefs", () => {
  it("should include the Date typeDefs", () => {
    expect(String(typeDefs)).toContain(String(dateType.typeDefs));
  });
});

describe("Scalar resolvers", () => {
  Object.entries(dateType.resolvers).forEach(([typeName, resolver]) => {
    it(`should include the resolver for the ${typeName}`, () => {
      expect(resolvers[typeName]).toEqual(resolver);
    });
  });
});
