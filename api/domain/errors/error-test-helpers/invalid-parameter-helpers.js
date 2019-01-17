const { INVALID_PARAMETER } = require("../codes");
const { itShouldBeAnError, buildThrowMatcher } = require("./base-helpers");

module.exports = {
  itShouldThrowAnInvalidParameterError: buildThrowMatcher(
    itShouldBeAnInvalidParameterError
  ),
  itShouldBeAnInvalidParameterError
};

function itShouldBeAnInvalidParameterError({
  error,
  parameter,
  reason,
  describeError = () => {}
}) {
  itShouldBeAnError({
    error,
    code: INVALID_PARAMETER,
    message: new RegExp(`invalid .*${parameter}.+${reason}`),
    describeError: buildError => {
      describeError(buildError);

      it(`should have a parameter property with the value '${parameter}'`, async () => {
        const resolvedError = await buildError();
        expect(resolvedError.parameter).toEqual(parameter);
      });
    }
  });
}
