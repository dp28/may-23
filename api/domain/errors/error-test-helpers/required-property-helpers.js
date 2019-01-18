const { itShouldBeAnError, buildThrowMatcher } = require("./base-helpers");
const { REQUIRED_PROPERTY } = require("../codes");

module.exports = {
  itShouldThrowARequiredPropertyError: buildThrowMatcher(
    itShouldBeARequiredPropertyError
  ),
  itShouldBeARequiredPropertyError
};

function itShouldBeARequiredPropertyError({
  error,
  property,
  message,
  describeError = () => {}
}) {
  itShouldBeAnError({
    error,
    code: REQUIRED_PROPERTY,
    message: message || new RegExp(`missing .*required.*${property}`),
    describeError: buildError => {
      describeError(buildError);

      it(`should have a 'property' property with the value '${property}'`, async () => {
        const resolvedError = await buildError();
        expect(resolvedError.property).toEqual(property);
      });
    }
  });
}
