const { dissocPath, assocPath } = require("ramda");
const {
  itShouldThrowAParameterMissingError,
  itShouldThrowACannotBeBlankError,
  itShouldThrowADuplicateIdError
} = require("../errors/error-test-helpers");
const {
  buildEventRepository
} = require("../../persistence/memory/events/events-repository");

const {
  addGroup,
  ADD_GROUP,
  validatorMap: { ADD_GROUP: validateAddGroupEvent }
} = require("./groups");

describe("addGroup", () => {
  const buildEvent = () => addGroup({ name: "my group", groupId: "fake_id" });
  const type = ADD_GROUP;

  it("should have an id", () => {
    expect(buildEvent().id).toBeTruthy();
  });

  it("should have a unique id", () => {
    expect(buildEvent().id).not.toEqual(buildEvent().id);
  });

  it("should have a createdAt date", () => {
    const before = new Date();
    const { createdAt } = buildEvent();
    const after = new Date();
    expect(createdAt >= before).toBe(true);
    expect(createdAt <= after).toBe(true);
  });

  it("should have the passed-in groupId data property", () => {
    expect(buildEvent().data.groupId).toBeTruthy();
  });

  it(`should have the type '${type}'`, () => {
    expect(buildEvent().type).toEqual(type);
  });

  it("should have a name data property", () => {
    expect(buildEvent().data.name).toEqual("my group");
  });

  describe("if there is no name passed in", () => {
    itShouldThrowAParameterMissingError({
      throwError: () => addGroup({}),
      parameter: "name"
    });
  });

  describe("if an empty name passed in", () => {
    itShouldThrowACannotBeBlankError({
      throwError: () => addGroup({ name: "" }),
      parameter: "name"
    });
  });

  describe("if there is no groupId passed in", () => {
    itShouldThrowAParameterMissingError({
      throwError: () => addGroup({ name: "a" }),
      parameter: "groupId"
    });
  });

  describe("if an empty groupId passed in", () => {
    itShouldThrowACannotBeBlankError({
      throwError: () => addGroup({ name: "a", groupId: "" }),
      parameter: "groupId"
    });
  });
});

describe("validation for addGroup", () => {
  const event = addGroup({
    groupId: "fake",
    name: "fake"
  });

  async function validateWithout(dataParam) {
    const invalidEvent = dissocPath(["data", dataParam], event);
    await validateAddGroupEvent(invalidEvent, {});
  }

  async function validateWithEmpty(dataParam) {
    const invalidEvent = assocPath(["data", dataParam], "", event);
    await validateAddGroupEvent(invalidEvent, {});
  }

  ["name", "groupId"].forEach(parameter => {
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

  describe("if a group has already been added with the same id", () => {
    const eventRepository = buildEventRepository();
    beforeEach(() => eventRepository.store(event));
    afterEach(eventRepository.removeAll);

    itShouldThrowADuplicateIdError({
      throwError: () =>
        validateAddGroupEvent({ ...event, id: "not_duped" }, eventRepository),
      entityName: "Group"
    });
  });
});
