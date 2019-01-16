const { combinedError, mergeErrors } = require("./combined-error");
const { COMBINED } = require("./codes");
const { invalidParameter, notFound } = require("./validation");

describe(combinedError, () => {
  it(`should have the type''${COMBINED}`, () => {
    expect(combinedError([]).code).toEqual(COMBINED);
  });

  it("should be an Error", () => {
    expect(combinedError([]) instanceof Error).toBeTruthy();
  });

  it("should have a message mentioning the number of errors", () => {
    expect(combinedError([{}, {}, {}]).message).toMatch(
      /3 errors have occurred/
    );
  });

  it("should have the passed-in errors its errors property", () => {
    const errors = [{}, { a: "b" }];
    expect(combinedError(errors).errors).toBe(errors);
  });
});

describe(mergeErrors, () => {
  describe("with no errors", () => {
    it(`should return a ${COMBINED} error`, () => {
      expect(mergeErrors([]).code).toBe(COMBINED);
    });

    it(`should have no errors`, () => {
      expect(mergeErrors([]).errors.length).toBe(0);
    });
  });

  describe("with one error", () => {
    it("should return that error", () => {
      const error = invalidParameter({ parameter: "fake" });
      expect(mergeErrors([error])).toBe(error);
    });
  });

  describe("with two uncombined errors", () => {
    const errors = [
      invalidParameter({
        parameter: "fake"
      }),
      notFound({ entityName: "fake", id: "fake" })
    ];
    const merged = mergeErrors(errors);

    it(`should return a ${COMBINED} error`, () => {
      expect(merged.code).toBe(COMBINED);
    });

    it(`should have the errors as its 'errors' property`, () => {
      expect(merged.errors).toEqual(errors);
    });
  });

  describe("with two combined errors and an uncombined error", () => {
    const firstErrors = [
      invalidParameter({
        parameter: "fake"
      }),
      notFound({ entityName: "fake", id: "fake" })
    ];
    const secondErrors = [
      invalidParameter({
        parameter: "fake2"
      }),
      notFound({ entityName: "fake2", id: "fake2" })
    ];
    const firstCombined = combinedError(firstErrors);
    const secondCombined = combinedError(secondErrors);
    const uncombined = notFound({ entityName: "fake3", id: "fake3" });

    const merged = mergeErrors([firstCombined, secondCombined, uncombined]);

    it(`should return a ${COMBINED} error`, () => {
      expect(merged.code).toBe(COMBINED);
    });

    it(`should have all the child errors as its 'errors' property`, () => {
      expect(merged.errors).toEqual([
        ...firstErrors,
        ...secondErrors,
        uncombined
      ]);
    });
  });
});
