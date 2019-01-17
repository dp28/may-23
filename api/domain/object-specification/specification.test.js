const {
  itShouldThrowAParameterMissingError,
  itShouldThrowACannotBeBlankError,
  itShouldThrowAnInvalidParameterError,
  itShouldThrowAnIncorrectTypeError
} = require("../errors/error-test-helpers");
const { Specification, isSpecification } = require("./specification");

describe(isSpecification, () => {
  describe("if the input is not an object", () => {
    it("should return false", () => {
      [null, undefined, 1, () => {}].forEach(value => {
        expect(isSpecification(value)).toBe(false);
      });
    });
  });

  const requiredProperties = ["type", "optional", "validate", "properties"];

  describe(`if the input has all the required properties: (${requiredProperties.join(
    ", "
  )})`, () => {
    it("should return true", () => {
      const spec = Specification({ type: "CustomSpecification" });
      expect(isSpecification(spec)).toBe(true);
    });
  });
});

describe(Specification, () => {
  const result = Specification({
    type: "CustomSpecification"
  });

  it("should return an object", () => {
    expect(typeof result).toEqual("object");
  });

  describe("the 'type' property", () => {
    it("should have the passed in 'type' property", () => {
      expect(result.type).toEqual("CustomSpecification");
    });

    describe("if there is no 'type' property passed in", () => {
      itShouldThrowAParameterMissingError({
        throwError: () => Specification({}),
        parameter: "type"
      });
    });

    describe("if an empty 'type' is passed in", () => {
      itShouldThrowACannotBeBlankError({
        throwError: () => Specification({ type: "" }),
        parameter: "type"
      });
    });
  });

  describe("passing any unknown properties", () => {
    itShouldThrowAnInvalidParameterError({
      throwError: () => Specification({ type: "a", useless: "value" }),
      parameter: "useless",
      reason: "unknown parameter"
    });
  });

  describe("the 'optional' property", () => {
    it("should be false if not provided", () => {
      expect(result.optional).toBe(false);
    });

    it("should be true if that is passed in", () => {
      expect(Specification({ type: "a", optional: true }).optional).toBe(true);
    });

    describe("passing a non-boolean value", () => {
      itShouldThrowAnIncorrectTypeError({
        throwError: () => Specification({ type: "a", optional: "test" }),
        parameter: "optional",
        expected: "Boolean"
      });
    });
  });

  describe("the 'defaultValue' property", () => {
    it("should be undefined if not provided", () => {
      expect(result.defaultValue).toBe(undefined);
    });

    it("should be whatever is passed in", () => {
      const defaultValue = { a: "b" };
      expect(
        Specification({
          type: "a",
          defaultValue
        }).defaultValue
      ).toBe(defaultValue);
    });
  });

  describe("the 'generate' property", () => {
    it("should be undefined if not provided", () => {
      expect(result.generate).toEqual(undefined);
    });

    it("should be the passed-in function if provided", () => {
      const generate = () => 1;
      expect(Specification({ type: "a", generate }).generate).toBe(generate);
    });

    describe("passing a non-function value", () => {
      itShouldThrowAnIncorrectTypeError({
        throwError: () => Specification({ type: "a", generate: "test" }),
        parameter: "generate",
        expected: "Function"
      });
    });
  });

  describe("the 'validate' property", () => {
    it("should be a function returning null if not provided", () => {
      [1, "three", { a: "b" }].forEach(value => {
        expect(result.validate(value)).toEqual(null);
      });
    });

    it("should be the passed-in function if provided", () => {
      const validate = x => x + 1;
      expect(Specification({ type: "a", validate }).validate).toBe(validate);
    });

    describe("passing a non-function value", () => {
      itShouldThrowAnIncorrectTypeError({
        throwError: () => Specification({ type: "a", validate: "test" }),
        parameter: "validate",
        expected: "Function"
      });
    });
  });

  describe("the 'properties' property", () => {
    it("should default to an empty object", () => {
      expect(result.properties).toEqual({});
    });

    describe("if it contains any properties that are not Specifications", () => {
      itShouldThrowAnIncorrectTypeError({
        throwError: () =>
          Specification({ type: "a", properties: { bad: "prop" } }),
        parameter: "bad",
        expected: "Specification"
      });
    });
  });
});
