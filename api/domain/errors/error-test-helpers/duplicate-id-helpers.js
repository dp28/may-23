const { DUPLICATE_ID } = require("../codes");
const { itShouldBeAnError, buildThrowMatcher } = require("./base-helpers");

module.exports = {
  itShouldThrowADuplicateIdError: buildThrowMatcher(
    itShouldBeADuplicateIdError
  ),
  itShouldBeADuplicateIdError
};

function itShouldBeADuplicateIdError({
  error,
  entityName,
  message,
  describeError = () => {}
}) {
  itShouldBeAnError({
    error,
    code: DUPLICATE_ID,
    message: message || new RegExp(`${entityName}.*already exists`),
    describeError: buildError => {
      describeError(buildError);

      it(`should have an entityName property with the value '${entityName}'`, async () => {
        const resolvedError = await buildError();
        expect(resolvedError.entityName).toEqual(entityName);
      });

      it(`should have a duplicateId property`, async () => {
        const resolvedError = await buildError();
        expect(resolvedError.duplicateId).toBeTruthy();
      });
    }
  });
}
