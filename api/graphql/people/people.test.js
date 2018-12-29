const {
  resolvers: { Mutation }
} = require("./people");
const { ADD_PERSON } = require("../../domain/events/people");
const {
  itShouldThrowADuplicateIdError
} = require("../../domain/errors/error-test-helpers");
const { equal } = require("../../domain/filters/filters");
const { withContext } = require("../test-utils");

describe("addPerson mutation resolver", () => {
  const { getEventRepository, resolver: addPersonMutation } = withContext(
    Mutation.addPerson
  );
  it("should persist an addPerson event", async () => {
    const filters = [equal(["type"], ADD_PERSON)];
    expect((await getEventRepository().find(filters)).length).toEqual(0);
    await addPersonMutation(
      {},
      { input: { firstName: "a", lastName: "b", personId: "fake_id" } }
    );
    expect((await getEventRepository().find({ filters })).length).toEqual(1);
  });

  describe("if a person has already been added with the same id", () => {
    const input = {
      firstName: "Dupey",
      lastName: "McDupe",
      personId: "1"
    };

    const addPerson = async () => await addPersonMutation({}, { input });

    beforeEach(addPerson);

    itShouldThrowADuplicateIdError({
      throwError: addPerson,
      entityName: "Person"
    });
  });

  describe("if a non ADD_PERSON event exists with the same personId", () => {
    const input = {
      firstName: "Dupey",
      lastName: "McDupe",
      personId: "1"
    };

    const addPerson = async () => await addPersonMutation({}, { input });

    beforeEach(async () => {
      await getEventRepository().store({
        id: "fake",
        createdAt: new Date(),
        data: { personId: input.id }
      });
    });

    it("should not throw an error", async () => {
      await expect(addPerson()).resolves.not.toThrow();
    });
  });
});
