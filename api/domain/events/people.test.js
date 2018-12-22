const {
  itShouldThrowAParameterMissingError,
  itShouldThrowACannotBeBlankError
} = require("../errors/error-test-helpers");

const { addPerson, ADD_PERSON } = require("./people");

describe("addPerson", () => {
  const buildEvent = () =>
    addPerson({ firstName: "Tom", lastName: "Riddle", personId: "fake_id" });
  const type = ADD_PERSON;

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

  it("should have the passed-in personId data property", () => {
    expect(buildEvent().data.personId).toBeTruthy();
  });

  it(`should have the type '${type}'`, () => {
    expect(buildEvent().type).toEqual(type);
  });

  it("should have a firstName data property", () => {
    expect(buildEvent().data.firstName).toEqual("Tom");
  });

  it("can have a middleName data property", () => {
    const event = addPerson({
      firstName: "Tom",
      middleName: "Marvolo",
      lastName: "Riddle",
      personId: "fake_id"
    });
    expect(event.data.middleName).toEqual("Marvolo");
  });

  it("should have a lastName data property", () => {
    expect(buildEvent().data.lastName).toEqual("Riddle");
  });

  describe("if there is no firstName passed in", () => {
    itShouldThrowAParameterMissingError({
      throwError: () => addPerson({}),
      parameter: "firstName"
    });
  });

  describe("if an empty firstName passed in", () => {
    itShouldThrowACannotBeBlankError({
      throwError: () => addPerson({ firstName: "" }),
      parameter: "firstName"
    });
  });

  describe("if there is no lastName passed in", () => {
    itShouldThrowAParameterMissingError({
      throwError: () => addPerson({ firstName: "a" }),
      parameter: "lastName"
    });
  });

  describe("if an empty lastName passed in", () => {
    itShouldThrowACannotBeBlankError({
      throwError: () => addPerson({ firstName: "a", lastName: "" }),
      parameter: "lastName"
    });
  });

  describe("if there is no personId passed in", () => {
    itShouldThrowAParameterMissingError({
      throwError: () => addPerson({ firstName: "a", lastName: "a" }),
      parameter: "personId"
    });
  });

  describe("if an empty personId passed in", () => {
    itShouldThrowACannotBeBlankError({
      throwError: () =>
        addPerson({ firstName: "a", lastName: "a", personId: "" }),
      parameter: "personId"
    });
  });

  describe("if there is no middleName passed in", () => {
    it("should be set to null", () => {
      expect(buildEvent().data.middleName).toBe(null);
    });
  });

  it("should capitalize firstNames", () => {
    expect(
      addPerson({
        firstName: "tom",
        lastName: "r",
        personId: "fake_id"
      }).data.firstName
    ).toEqual("Tom");
  });

  it("should capitalize lastNames", () => {
    expect(
      addPerson({
        firstName: "tom",
        lastName: "riddle",
        personId: "fake_id"
      }).data.lastName
    ).toEqual("Riddle");
  });

  it("should capitalize middleNames", () => {
    expect(
      addPerson({
        firstName: "tom",
        middleName: "marvolo",
        lastName: "riddle",
        personId: "fake_id"
      }).data.middleName
    ).toEqual("Marvolo");
  });
});
