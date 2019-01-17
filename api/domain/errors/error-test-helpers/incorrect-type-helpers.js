const { INCORRECT_TYPE } = require("../codes");
const { itShouldBeAnError, buildThrowMatcher } = require("./base-helpers");

module.exports = {
  itShouldThrowAnIncorrectTypeError: buildThrowMatcher(
    itShouldBeAnIncorrectTypeError
  ),
  itShouldBeAnIncorrectTypeError
};

function itShouldBeAnIncorrectTypeError({
  error,
  parameter,
  expected,
  describeError = () => {}
}) {
  itShouldBeAnError({
    error,
    code: INCORRECT_TYPE,
    message: new RegExp(`incorrect .*${parameter}.+${expected}`),
    describeError: buildError => {
      describeError(buildError);

      it(`should have a parameter property with the value '${parameter}'`, async () => {
        const resolvedError = await buildError();
        expect(resolvedError.parameter).toEqual(parameter);
      });

      it(`should have an expected property with the value '${expected}'`, async () => {
        const resolvedError = await buildError();
        expect(resolvedError.expected).toEqual(expected);
      });
    }
  });
}
