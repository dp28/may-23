const { findErrors } = require("./find-errors");
const { incorrectType } = require("../errors/validation");
const { mergeErrors } = require("../errors/combined-error");
const { Specification } = require("./specification");
const {
  itShouldThrowAnIncorrectTypeError,
  itShouldBeARequiredPropertyError
} = require("../errors/error-test-helpers");

describe(findErrors, () => {
  it("should be curried", () => {
    const specification = Specification({ type: "fake" });
    expect(typeof findErrors({ specification })).toEqual("function");
  });

  describe("if the first argument is not a specification", () => {
    itShouldThrowAnIncorrectTypeError({
      throwError: () => findErrors(1),
      expected: "Specification",
      parameter: "specification"
    });
  });

  describe("if two arguments are passed and the first argument is not a specification", () => {
    itShouldThrowAnIncorrectTypeError({
      throwError: () => findErrors(1, 2),
      expected: "Specification",
      parameter: "specification"
    });
  });

  describe("if the value is undefined", () => {
    describe("and the Specification is optional", () => {
      it("should return null", () => {
        const specification = Specification({ type: "test", optional: true });
        expect(findErrors({ specification }, undefined)).toEqual(null);
      });
    });

    describe("and the Specification is not optional", () => {
      itShouldBeARequiredPropertyError({
        error: findErrors(
          { specification: Specification({ type: "test" }) },
          undefined
        ),
        property: "test"
      });
    });
  });

  describe("if the value is null", () => {
    describe("and the Specification is optional", () => {
      it("should return null", () => {
        const specification = Specification({ type: "test", optional: true });
        expect(findErrors({ specification }, null)).toEqual(null);
      });
    });

    describe("and the Specification is not optional", () => {
      itShouldBeARequiredPropertyError({
        error: findErrors(
          { specification: Specification({ type: "test" }) },
          null
        ),
        property: "test"
      });
    });
  });

  describe("if the validate function returns a value", () => {
    it("should pass on that error", () => {
      const specification = Specification({
        type: "test",
        validate: x => (x === 3 ? 4 : null)
      });
      expect(findErrors({ specification }, 3)).toEqual(4);
    });
  });

  describe("if context is not specified", () => {
    it("should pass undefined as the second argument to validate", () => {
      const specification = Specification({
        type: "test",
        validate: (_value, context) => ({ context })
      });
      expect(findErrors({ specification }, 3).context).toEqual(undefined);
    });
  });

  describe("if context is specified", () => {
    it("should be passed as the second argument to validate", () => {
      const specification = Specification({
        type: "test",
        validate: (_value, context) => ({ context })
      });
      expect(
        findErrors({ specification, context: { a: "b" } }, 3).context
      ).toEqual({ a: "b" });
    });
  });

  it("should pass the value's corresponding property to the property validate function", () => {
    const spy = jest.fn();
    const value = { someProp: "hello" };
    const specification = Specification({
      type: "test",
      properties: {
        someProp: Specification({
          type: "prop",
          validate: spy
        })
      }
    });
    findErrors({ specification }, value);
    expect(spy.mock.calls).toEqual([["hello", undefined]]);
  });

  it("should pass the context to the property validate function", () => {
    const spy = jest.fn();
    const context = { a: "c" };
    const specification = Specification({
      type: "test",
      properties: {
        someProp: Specification({
          type: "prop",
          validate: spy
        })
      }
    });
    findErrors({ specification, context }, { someProp: "hello" });
    expect(spy.mock.calls[0][1]).toEqual(context);
  });

  describe("if there are errors with a property", () => {
    it("should return that error", () => {
      const error = incorrectType({ expected: "a", parameter: "b" });
      const specification = Specification({
        type: "test",
        properties: {
          someProp: Specification({
            type: "prop",
            validate: () => error
          })
        }
      });
      expect(findErrors({ specification }, { someProp: 1 }).code).toEqual(
        error.code
      );
    });

    it("should return include the property name in that error", () => {
      const error = incorrectType({ expected: "a", parameter: "b" });
      const specification = Specification({
        type: "test",
        properties: {
          someProp: Specification({
            type: "prop",
            validate: () => error
          })
        }
      });
      expect(findErrors({ specification }, { someProp: 1 }).property).toEqual(
        "someProp"
      );
    });

    describe("and there are also errors with the top-level object", () => {
      it("should only return the error with the property", () => {
        const error = incorrectType({ expected: "a", parameter: "b" });
        const specification = Specification({
          type: "test",
          validate: () => incorrectType({ expected: "other", parameter: "b" }),
          properties: {
            someProp: Specification({
              type: "prop",
              validate: () => error
            })
          }
        });
        expect(findErrors({ specification }, { someProp: 1 }).expected).toEqual(
          error.expected
        );
      });

      it("should not run the top-level validate function", () => {
        const specification = Specification({
          type: "test",
          validate: jest.fn(),
          properties: {
            someProp: Specification({
              type: "prop",
              validate: () => incorrectType({ expected: "a", parameter: "b" })
            })
          }
        });
        findErrors({ specification }, { someProp: 1 });
        expect(specification.validate.mock.calls.length).toEqual(0);
      });
    });
  });

  describe("and there are no errors with all properties", () => {
    it("should return null", () => {
      const specification = Specification({
        type: "test",
        properties: {
          someProp: Specification({
            type: "prop"
          })
        }
      });
      expect(findErrors({ specification }, { someProp: 1 })).toEqual(null);
    });
  });

  describe("and there are errors with multiple properties", () => {
    it("should return merge the errors", () => {
      const specification = Specification({
        type: "test",
        properties: {
          someProp: Specification({
            type: "prop"
          })
        }
      });
      expect(findErrors({ specification }, { someProp: 1 })).toEqual(null);
    });
  });

  describe("and there are no errors with all properties", () => {
    it("should return null", () => {
      const firstError = incorrectType({ expected: "a", parameter: "b" });
      const secondError = incorrectType({ expected: "b", parameter: "c" });
      const specification = Specification({
        type: "test",
        properties: {
          someProp: Specification({
            type: "prop",
            validate: () => firstError
          }),
          someOtherProp: Specification({
            type: "prop",
            validate: () => secondError
          })
        }
      });
      const value = { someProp: 1, someOtherProp: 2 };
      expect(findErrors({ specification }, value)).toEqual(
        mergeErrors([firstError, secondError])
      );
    });
  });

  describe("if a validator returns a Promise", () => {
    it("should return a Promise for errors", () => {
      const specification = Specification({
        type: "test",
        validate: async () => null
      });
      expect(findErrors({ specification }, 1) instanceof Promise).toEqual(true);
    });

    describe("but the validator's Promise resolves to a falsy value", () => {
      it("should return a Promise resolving to null", async () => {
        const specification = Specification({
          type: "test",
          validate: async () => false
        });
        expect(await findErrors({ specification }, 1)).toEqual(null);
      });
    });
  });
});
