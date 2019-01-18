const {
  StringSpecification,
  BooleanSpecification,
  FunctionSpecification,
  NumberSpecification
} = require("./built-in-type-specifications");
const { findErrors } = require("./find-errors");
const {
  itShouldBeAnIncorrectTypeError
} = require("../errors/error-test-helpers");
const { INCORRECT_TYPE } = require("../errors/codes");
const { cannotBeBlank } = require("../errors/validation");

function itShouldBehaveLikeABuiltInTypeSpecification({
  buildSpecification,
  type,
  example,
  nonTypeExample
}) {
  it(`should have the type '${type}'`, () => {
    expect(buildSpecification().type).toEqual(type);
  });

  it(`should not return an error when validating a ${type}`, () => {
    expect(
      findErrors({ specification: buildSpecification() }, example)
    ).toEqual(null);
  });

  it("should pass through the 'optional' parameter", () => {
    expect(buildSpecification({ optional: true }).optional).toEqual(true);
  });

  it("should default 'optional' to false", () => {
    expect(buildSpecification().optional).toEqual(false);
  });

  it("should pass through the 'defaultValue' parameter", () => {
    expect(
      buildSpecification({
        defaultValue: "a"
      }).defaultValue
    ).toEqual("a");
  });

  it("should pass through the 'generate' parameter", () => {
    const generate = () => 1;
    expect(
      buildSpecification({
        generate
      }).generate
    ).toEqual(generate);
  });

  it("should pass through the 'properties' parameter", () => {
    const properties = { a: buildSpecification() };
    expect(
      buildSpecification({
        properties
      }).properties
    ).toEqual(properties);
  });

  describe("if another validate function is passed in", () => {
    const error = cannotBeBlank({ parameter: "a" });
    const specification = buildSpecification({ validate: () => error });

    it("should run the type validation first", () => {
      expect(findErrors({ specification }, nonTypeExample).code).toEqual(
        INCORRECT_TYPE
      );
    });

    it("should run the other validation second", () => {
      expect(findErrors({ specification }, example)).toEqual(error);
    });
  });

  describe(`when validating against a non-${type} value`, () => {
    itShouldBeAnIncorrectTypeError({
      error: findErrors(
        { specification: buildSpecification() },
        nonTypeExample
      ),
      expected: type
    });
  });
}

describe("StringSpecification", () => {
  itShouldBehaveLikeABuiltInTypeSpecification({
    buildSpecification: StringSpecification,
    type: "string",
    example: "",
    nonTypeExample: 1
  });
});

describe("BooleanSpecification", () => {
  itShouldBehaveLikeABuiltInTypeSpecification({
    buildSpecification: BooleanSpecification,
    type: "boolean",
    example: false,
    nonTypeExample: 0
  });
});

describe("NumberSpecification", () => {
  itShouldBehaveLikeABuiltInTypeSpecification({
    buildSpecification: NumberSpecification,
    type: "number",
    example: 0,
    nonTypeExample: false
  });
});

describe("FunctionSpecification", () => {
  itShouldBehaveLikeABuiltInTypeSpecification({
    buildSpecification: FunctionSpecification,
    type: "function",
    example: () => {},
    nonTypeExample: 1
  });
});
