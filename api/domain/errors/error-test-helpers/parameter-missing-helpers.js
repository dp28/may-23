const { itShouldBeAnError, buildThrowMatcher } = require("./base-helpers");
const { PARAMETER_MISSING } = require("../codes");

module.exports = {
  itShouldThrowAParameterMissingError: buildThrowMatcher(
    itShouldBeAParameterMissingError
  ),
  itShouldBeAParameterMissingError
};

function itShouldBeAParameterMissingError({
  error,
  parameter,
  message,
  describeError = () => {}
}) {
  itShouldBeAnError({
    error,
    code: PARAMETER_MISSING,
    message: message || new RegExp(`missing .*${parameter}`),
    describeError: buildError => {
      describeError(buildError);

      it(`should have a parameter property with the value '${parameter}'`, async () => {
        const resolvedError = await buildError();
        expect(resolvedError.parameter).toEqual(parameter);
      });
    }
  });
}
