const { validateEvent } = require("./validator");
const { addPerson } = require("./people");
const {
  itShouldThrowAParameterMissingError,
  itShouldThrowAnError,
  itShouldThrowADuplicateIdError
} = require("../errors/error-test-helpers");
const {
  buildEventRepository
} = require("../../persistence/memory/events/events-repository");

describe(validateEvent, () => {
  const validEvent = addPerson({
    firstName: "test",
    lastName: "testington",
    personId: "fake"
  });

  [("id", "createdAt", "type", "data")].forEach(parameter => {
    describe(`when the '${parameter}' field is missing`, () => {
      itShouldThrowAParameterMissingError({
        throwError: () => validateEvent(deleteProperty(parameter, validEvent)),
        parameter
      });
    });
  });

  describe("when the type is not supported", () => {
    itShouldThrowAnError({
      throwError: () => validateEvent({ ...validEvent, type: "UNKNOWN" }),
      code: "INVALID_PARAMETER",
      message: /type/,
      describeError: buildError => {
        it("should have a parameter property with the value 'type'", async () => {
          const error = await buildError();
          expect(error.parameter).toEqual("type");
        });
      }
    });
  });

  describe("when the type's data is missing a parameter", () => {
    const invalidEvent = {
      ...validEvent,
      data: deleteProperty("firstName", validEvent.data)
    };
    itShouldThrowAParameterMissingError({
      throwError: () => validateEvent(invalidEvent),
      parameter: "firstName"
    });
  });

  describe("if the event is invalid due to already-stored events", () => {
    const eventRepository = buildEventRepository();
    beforeEach(() => eventRepository.store(validEvent));
    afterEach(eventRepository.removeAll);

    itShouldThrowADuplicateIdError({
      throwError: () =>
        validateEvent({ ...validEvent, id: "not_duped" }, eventRepository),
      entityName: "Person"
    });
  });
});

function deleteProperty(property, object) {
  const copy = { ...object };
  delete copy[property];
  return copy;
}
