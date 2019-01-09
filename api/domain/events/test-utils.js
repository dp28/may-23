const { dissocPath, dissoc, assocPath, assoc } = require("ramda");
const {
  itShouldThrowAParameterMissingError,
  itShouldThrowACannotBeBlankError,
  itShouldThrowADuplicateIdError,
  expectNotToThrow
} = require("../errors/error-test-helpers");
const {
  buildEventsRepository
} = require("../../persistence/memory/events/events-repository");

module.exports = {
  testEventCreatorAndValidator,
  itShouldBehaveLikeAnEventCreator,
  itShouldBehaveLikeAnEventValidator
};

function itShouldBehaveLikeAnEventCreator({
  eventCreator,
  type,
  exampleInput,
  requiredDataFields = [],
  optionalDataFields = []
}) {
  it("should have an id", () => {
    expect(eventCreator(exampleInput).id).toBeTruthy();
  });

  it("should have a unique id", () => {
    expect(eventCreator(exampleInput).id).not.toEqual(
      eventCreator(exampleInput).id
    );
  });

  it("should have a createdAt date", () => {
    const before = new Date();
    const { createdAt } = eventCreator(exampleInput);
    const after = new Date();
    expect(createdAt >= before).toBe(true);
    expect(createdAt <= after).toBe(true);
  });

  it(`should have the type '${type}'`, () => {
    expect(eventCreator(exampleInput).type).toEqual(type);
  });

  describe("the data properties", () => {
    requiredDataFields.forEach(field => {
      it(`should have the property '${field}' from the input`, () => {
        const { data } = eventCreator(exampleInput);
        expect(data[field]).toEqual(exampleInput[field]);
      });

      describe(`if there is no ${field} passed in`, () => {
        itShouldThrowAParameterMissingError({
          throwError: () => eventCreator(dissoc(field, exampleInput)),
          parameter: field
        });
      });

      describe(`if an empty ${field} passed in`, () => {
        itShouldThrowACannotBeBlankError({
          throwError: () => eventCreator(assoc(field, "", exampleInput)),
          parameter: field
        });
      });
    });

    optionalDataFields.forEach(field => {
      it(`should have the property '${field}' from the input`, () => {
        const { data } = eventCreator(assoc(field, "Test", exampleInput));
        expect(data[field]).toEqual("Test");
      });

      describe(`if there is no ${field} passed in`, () => {
        it("should be set to null", () => {
          const { data } = eventCreator(dissoc(field, exampleInput));
          expect(data[field]).toBe(null);
        });
      });
    });
  });
}

function itShouldBehaveLikeAnEventValidator({
  validate,
  event,
  entityName,
  requiredDataFields = [],
  uniqueDataFields = []
}) {
  it("should ignore types it does not validate", async () => {
    await expectNotToThrow(() => validate({ type: "UNKNOWN" }));
  });

  async function validateWithout(dataParam) {
    const invalidEvent = dissocPath(["data", dataParam], event);
    await validate(invalidEvent, {});
  }

  async function validateWithEmpty(dataParam) {
    const invalidEvent = assocPath(["data", dataParam], "", event);
    await validate(invalidEvent, {});
  }

  requiredDataFields.forEach(parameter => {
    describe(`if there is no ${parameter} passed in`, () => {
      itShouldThrowAParameterMissingError({
        throwError: () => validateWithout(parameter),
        parameter
      });
    });

    describe(`if an empty ${parameter} passed in`, () => {
      itShouldThrowACannotBeBlankError({
        throwError: () => validateWithEmpty(parameter),
        parameter
      });
    });
  });

  uniqueDataFields.forEach(uniqueField => {
    describe(`if a ${entityName} has already been added with the same ${uniqueField}`, () => {
      const eventsRepository = buildEventsRepository();
      beforeEach(() => eventsRepository.store(event));
      afterEach(eventsRepository.removeAll);

      itShouldThrowADuplicateIdError({
        throwError: () =>
          validate({ ...event, id: "not_duped" }, eventsRepository),
        entityName
      });
    });
  });
}

function testEventCreatorAndValidator({
  eventType,
  eventCreator,
  validate,
  entityName,
  exampleInput,
  requiredDataFields = [],
  optionalDataFields = [],
  uniqueDataFields = []
}) {
  describe(eventCreator, () => {
    itShouldBehaveLikeAnEventCreator({
      type: eventType,
      eventCreator,
      exampleInput,
      requiredDataFields,
      optionalDataFields
    });
  });

  describe(`validate ${eventType} events`, () => {
    itShouldBehaveLikeAnEventValidator({
      validate,
      event: eventCreator(exampleInput),
      requiredDataFields,
      uniqueDataFields,
      entityName
    });
  });
}
