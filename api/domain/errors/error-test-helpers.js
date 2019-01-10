const {
  PARAMETER_MISSING,
  CANNOT_BE_BLANK,
  DUPLICATE_ID,
  NOT_FOUND
} = require("./codes");

module.exports = {
  itShouldThrowAnError,
  itShouldThrowAParameterMissingError,
  itShouldThrowACannotBeBlankError,
  itShouldThrowADuplicateIdError,
  itShouldThrowANotFoundError,
  expectNotToThrow
};
const noop = () => {};

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
  describeError = noop
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

function itShouldThrowAParameterMissingError({
  throwError,
  parameter,
  message,
  describeError = noop
}) {
  itShouldThrowAnError({
    throwError,
    code: PARAMETER_MISSING,
    message: message || new RegExp(`missing .*${parameter}`),
    describeError: buildError => {
      describeError(buildError);

      it(`should have a parameter property with the value '${parameter}'`, async () => {
        const error = await buildError();
        expect(error.parameter).toEqual(parameter);
      });
    }
  });
}

function itShouldThrowACannotBeBlankError({
  throwError,
  parameter,
  message,
  describeError = noop
}) {
  itShouldThrowAnError({
    throwError,
    code: CANNOT_BE_BLANK,
    message: message || new RegExp(`${parameter}.*not be falsy`),
    describeError: buildError => {
      describeError(buildError);

      it(`should have a '${parameter}' property`, async () => {
        const error = await buildError();
        expect(error.parameter).toEqual(parameter);
      });
    }
  });
}

function itShouldThrowADuplicateIdError({
  throwError,
  entityName,
  message,
  describeError = noop
}) {
  itShouldThrowAnError({
    throwError,
    code: DUPLICATE_ID,
    message: message || new RegExp(`${entityName}.*already exists`),
    describeError: buildError => {
      describeError(buildError);

      it(`should have an entityName property with the value '${entityName}'`, async () => {
        const error = await buildError();
        expect(error.entityName).toEqual(entityName);
      });

      it(`should have a duplicateId property`, async () => {
        const error = await buildError();
        expect(error.duplicateId).toBeTruthy();
      });
    }
  });
}

function itShouldThrowANotFoundError({
  throwError,
  entityName,
  message,
  describeError = noop
}) {
  itShouldThrowAnError({
    throwError,
    code: NOT_FOUND,
    message: message || new RegExp(`${entityName}.* not found with id`),
    describeError: buildError => {
      describeError(buildError);

      it(`should have an entityName property with the value '${entityName}'`, async () => {
        const error = await buildError();
        expect(error.entityName).toEqual(entityName);
      });

      it(`should have an id property`, async () => {
        const error = await buildError();
        expect(error.id).toBeTruthy();
      });
    }
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
