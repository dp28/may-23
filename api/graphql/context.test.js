const { buildContext } = require("./context");

describe("GraphQL context", () => {
  ["events", "groups", "people"].forEach(type => {
    it(`should have a ${type}Repository`, () => {
      expect(typeof buildContext()[`${type}Repository`].find).toEqual(
        "function"
      );
    });
  });
});
