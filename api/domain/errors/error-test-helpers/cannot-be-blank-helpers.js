const { itShouldBeAnError, buildThrowMatcher } = require("./base-helpers");
const { CANNOT_BE_BLANK } = require("../codes");

module.exports = {
  itShouldThrowACannotBeBlankError: buildThrowMatcher(
    itShouldBeACannotBeBlankError
  ),
  itShouldBeACannotBeBlankError
};

function itShouldBeACannotBeBlankError({
  error,
  parameter,
  message,
  describeError = () => {}
}) {
  itShouldBeAnError({
    error,
    code: CANNOT_BE_BLANK,
    message: message || new RegExp(`${parameter}.*not be falsy`),
    describeError: buildError => {
      describeError(buildError);

      it(`should have a '${parameter}' property`, async () => {
        const resolvedError = await buildError();
        expect(resolvedError.parameter).toEqual(parameter);
      });
    }
  });
}
