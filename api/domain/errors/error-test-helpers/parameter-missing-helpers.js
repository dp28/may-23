const { itShouldThrowAnError } = require("./base-helpers");
const { PARAMETER_MISSING } = require("../codes");

module.exports = {
  itShouldThrowAParameterMissingError
};

function itShouldThrowAParameterMissingError({
  throwError,
  parameter,
  message,
  describeError = () => {}
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
