const { addPerson, ADD_PERSON, validatorMap } = require("./people");

const {
  itShouldBehaveLikeAnEventCreator,
  itShouldBehaveLikeAnEventValidatorMap
} = require("./test-utils");

const requiredDataFields = ["firstName", "lastName", "personId"];

const exampleInput = { firstName: "Tom", lastName: "Riddle", personId: "fake" };

describe("addPerson", () => {
  itShouldBehaveLikeAnEventCreator({
    type: ADD_PERSON,
    eventCreator: addPerson,
    exampleInput,
    requiredDataFields,
    optionalDataFields: ["middleName"]
  });

  it("should capitalize firstNames", () => {
    expect(
      addPerson({ ...exampleInput, firstName: "tom" }).data.firstName
    ).toEqual("Tom");
  });

  it("should capitalize lastNames", () => {
    expect(
      addPerson({
        ...exampleInput,
        lastName: "riddle"
      }).data.lastName
    ).toEqual("Riddle");
  });

  it("should capitalize middleNames", () => {
    expect(
      addPerson({
        ...exampleInput,
        middleName: "marvolo"
      }).data.middleName
    ).toEqual("Marvolo");
  });
});

describe("validation for addPerson", () => {
  itShouldBehaveLikeAnEventValidatorMap({
    validatorMap,
    eventType: ADD_PERSON,
    event: addPerson(exampleInput),
    entityName: "Person",
    requiredDataFields,
    uniqueDataFields: ["personId"]
  });
});
