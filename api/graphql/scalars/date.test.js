const { Kind } = require("graphql/language");
const {
  resolverMap: { Date: dateResolver }
} = require("./date");

describe("Date resolver", () => {
  describe("#parseValue", () => {
    it("should pass the input to `new Date`", () => {
      expect(dateResolver.parseValue(1234)).toEqual(new Date(1234));
    });
  });

  describe("#serialize", () => {
    it("should return the date's value in milliseconds", () => {
      expect(dateResolver.serialize(new Date(1234))).toEqual(1234);
    });
  });

  describe("#parseLiteral", () => {
    it("should pass the input's value to `new Date`", () => {
      expect(
        dateResolver.parseLiteral({
          kind: Kind.INT,
          value: "1234"
        })
      ).toEqual(new Date(1234));
    });
  });
});
