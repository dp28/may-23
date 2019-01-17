const { INVALID_PARAMETER } = require("../codes");
const { itShouldThrowAnError } = require("./base-helpers");

module.exports = {
  itShouldThrowAnInvalidParameterError
};

function itShouldThrowAnInvalidParameterError({
  throwError,
  parameter,
  reason,
  describeError = () => {}
}) {
  itShouldThrowAnError({
    throwError,
    code: INVALID_PARAMETER,
    message: new RegExp(`invalid .*${parameter}.+${reason}`),
    describeError: buildError => {
      describeError(buildError);

      it(`should have a parameter property with the value '${parameter}'`, async () => {
        const error = await buildError();
        expect(error.parameter).toEqual(parameter);
      });
    }
  });
}
