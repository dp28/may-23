const { NOT_FOUND } = require("../codes");
const { itShouldThrowAnError } = require("./base-helpers");

module.exports = {
  itShouldThrowANotFoundError
};
const noop = () => {};

function itShouldThrowANotFoundError({
  throwError,
  entityName,
  message,
  describeError = () => {}
}) {
  itShouldThrowAnError({
    throwError,
    code: NOT_FOUND,
    message: message || new RegExp(`${entityName}.* not found with id`),
    describeError: buildError => {
      describeError(buildError);

      it(`should have an entityName property with the value '${entityName}'`, async () => {
        const error = await buildError();
        expect(error.entityName).toEqual(entityName);
      });

      it(`should have an id property`, async () => {
        const error = await buildError();
        expect(error.id).toBeTruthy();
      });
    }
  });
}
