const { DUPLICATE_ID } = require("../codes");
const { itShouldThrowAnError } = require("./base-helpers");

module.exports = {
  itShouldThrowADuplicateIdError
};

function itShouldThrowADuplicateIdError({
  throwError,
  entityName,
  message,
  describeError = () => {}
}) {
  itShouldThrowAnError({
    throwError,
    code: DUPLICATE_ID,
    message: message || new RegExp(`${entityName}.*already exists`),
    describeError: buildError => {
      describeError(buildError);

      it(`should have an entityName property with the value '${entityName}'`, async () => {
        const error = await buildError();
        expect(error.entityName).toEqual(entityName);
      });

      it(`should have a duplicateId property`, async () => {
        const error = await buildError();
        expect(error.duplicateId).toBeTruthy();
      });
    }
  });
}
