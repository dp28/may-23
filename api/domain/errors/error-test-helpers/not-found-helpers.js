const { NOT_FOUND } = require("../codes");
const { itShouldBeAnError, buildThrowMatcher } = require("./base-helpers");

module.exports = {
  itShouldThrowANotFoundError: buildThrowMatcher(itShouldBeANotFoundError),
  itShouldBeANotFoundError
};

function itShouldBeANotFoundError({
  error,
  entityName,
  message,
  describeError = () => {}
}) {
  itShouldBeAnError({
    error,
    code: NOT_FOUND,
    message: message || new RegExp(`${entityName}.* not found with id`),
    describeError: buildError => {
      describeError(buildError);

      it(`should have an entityName property with the value '${entityName}'`, async () => {
        const resolvedError = await buildError();
        expect(resolvedError.entityName).toEqual(entityName);
      });

      it(`should have an id property`, async () => {
        const resolvedError = await buildError();
        expect(resolvedError.id).toBeTruthy();
      });
    }
  });
}
