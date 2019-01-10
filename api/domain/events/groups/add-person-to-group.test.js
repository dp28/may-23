const { ADD_PERSON_TO_GROUP } = require("../types");
const { addPersonToGroup, validate } = require("./add-person-to-group");
const {
  itShouldBehaveLikeAnEventCreator,
  itShouldBehaveLikeAnEventValidator,
  buildRepositoriesAndClearUp
} = require("../test-utils");
const {
  itShouldThrowANotFoundError
} = require("../../errors/error-test-helpers");
const { addGroup } = require("./add-group");
const { addPerson } = require("../people");

describe(addPersonToGroup, () => {
  itShouldBehaveLikeAnEventCreator({
    type: ADD_PERSON_TO_GROUP,
    eventCreator: addPersonToGroup,
    exampleInput: {
      personId: "fakeId",
      groupId: "fakeGroupId"
    },
    requiredDataFields: ["personId", "groupId"]
  });
});

describe("validate ADD_PERSON_TO_GROUP events", () => {
  const repositories = buildRepositoriesAndClearUp();

  beforeEach(() => {
    repositories.eventsRepository.store(
      addPerson({ firstName: "A", lastName: "B", personId: "fake" })
    );
    repositories.eventsRepository.store(
      addGroup({ name: "B", groupId: "fake" })
    );
  });

  itShouldBehaveLikeAnEventValidator({
    validate,
    event: addPersonToGroup({ personId: "fake", groupId: "fake" }),
    requiredDataFields: ["personId", "groupId"]
  });

  describe("if no person exists with the specified id", () => {
    const event = addPersonToGroup({
      personId: "not_there",
      groupId: "fake"
    });

    itShouldThrowANotFoundError({
      throwError: () => validate(event, repositories),
      entityName: "Person"
    });
  });

  describe("if no person exists with the specified id", () => {
    const event = addPersonToGroup({ personId: "not_there", groupId: "fake" });

    itShouldThrowANotFoundError({
      throwError: () => validate(event, repositories),
      entityName: "Person"
    });
  });

  describe("if no group exists with the specified id", () => {
    const event = addPersonToGroup({
      personId: "fake",
      groupId: "not_there"
    });

    itShouldThrowANotFoundError({
      throwError: () => validate(event, repositories),
      entityName: "Group"
    });
  });
});
