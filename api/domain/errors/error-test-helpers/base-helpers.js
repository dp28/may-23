module.exports = {
  itShouldThrowAnError,
  expectNotToThrow
};

async function expectNotToThrow(possibleAsyncError) {
  try {
    await possibleAsyncError();
  } catch (error) {
    throw error;
  }
}

function itShouldThrowAnError({
  throwError,
  code,
  message = "",
  describeError = () => {}
}) {
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

  describe("the thrown error", () => {
    const buildError = async () => await getError(throwError);

    it(`should have the code '${code}'`, async () => {
      const error = await buildError();
      expect(error.code).toEqual(code);
    });

    it(`should have a message`, async () => {
      const error = await buildError();
      expect(error.message).toMatch(message);
    });

    describeError(buildError);
  });
}

async function getError(throwError) {
  try {
    await throwError();
    return null;
  } catch (error) {
    return error;
  }
}
