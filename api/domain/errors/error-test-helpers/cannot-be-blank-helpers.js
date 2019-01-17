const { itShouldThrowAnError } = require("./base-helpers");
const { CANNOT_BE_BLANK } = require("../codes");

module.exports = {
  itShouldThrowACannotBeBlankError
};

function itShouldThrowACannotBeBlankError({
  throwError,
  parameter,
  message,
  describeError = () => {}
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
