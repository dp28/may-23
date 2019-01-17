const { INCORRECT_TYPE } = require("../codes");
const { itShouldThrowAnError } = require("./base-helpers");

module.exports = {
  itShouldThrowAnIncorrectTypeError
};

function itShouldThrowAnIncorrectTypeError({
  throwError,
  parameter,
  expected,
  describeError = () => {}
}) {
  itShouldThrowAnError({
    throwError,
    code: INCORRECT_TYPE,
    message: new RegExp(`incorrect .*${parameter}.+${expected}`),
    describeError: buildError => {
      describeError(buildError);

      it(`should have a parameter property with the value '${parameter}'`, async () => {
        const error = await buildError();
        expect(error.parameter).toEqual(parameter);
      });

      it(`should have an expected property with the value '${expected}'`, async () => {
        const error = await buildError();
        expect(error.expected).toEqual(expected);
      });
    }
  });
}
