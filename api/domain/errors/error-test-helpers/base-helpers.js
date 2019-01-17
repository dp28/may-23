module.exports = {
  itShouldThrowAnError: buildThrowMatcher(itShouldBeAnError),
  itShouldBeAnError,
  buildThrowMatcher,
  expectNotToThrow
};

async function expectNotToThrow(possibleAsyncError) {
  try {
    await possibleAsyncError();
  } catch (error) {
    throw error;
  }
}

function itShouldBeAnError({
  error,
  code,
  message = "",
  describeError = () => {}
}) {
  describe("the error", () => {
    const buildError = async () =>
      typeof error === "function" ? await getError(error) : error;

    it(`should have the code '${code}'`, async () => {
      const resolvedError = await buildError();
      expect(resolvedError.code).toEqual(code);
    });

    it(`should have a message`, async () => {
      const resolvedError = await buildError();
      expect(resolvedError.message).toMatch(message);
    });

    describeError(buildError);
  });
}

function buildThrowMatcher(errorMatcher) {
  return ({ throwError, ...args }) => {
    it("should throw an expected error", async () => {
      try {
        await throwError();
        fail("Should have thrown an error");
      } catch (error) {
        if (!error.code) {
          throw error;
        }
      }
    });

    errorMatcher({ ...args, error: throwError });
  };
}

async function getError(throwOrReturnError) {
  try {
    return await throwOrReturnError();
  } catch (error) {
    return error;
  }
}
