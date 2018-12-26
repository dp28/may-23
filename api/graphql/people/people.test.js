const { addPersonMutation } = require("./people");
const { ADD_PERSON } = require("../../domain/events/people");
const {
  itShouldThrowADuplicateIdError
} = require("../../domain/errors/error-test-helpers");
const {
  buildEventRepository
} = require("../../persistence/memory/events/events-repository");
const { equal } = require("../../domain/filters/filters");

describe(addPersonMutation, () => {
  let context;

  beforeEach(() => {
    context = {
      eventRepository: buildEventRepository()
    };
  });

  afterEach(() => {
    context.eventRepository.removeAll();
  });

  it("should persist an addPerson event", async () => {
    const filters = [equal(["type"], ADD_PERSON)];
    expect((await context.eventRepository.find(filters)).length).toEqual(0);
    await addPersonMutation(
      {},
      { input: { firstName: "a", lastName: "b", personId: "fake_id" } },
      context
    );
    expect((await context.eventRepository.find({ filters })).length).toEqual(1);
  });

  describe("if a person has already been added with the same id", () => {
    const input = {
      firstName: "Dupey",
      lastName: "McDupe",
      personId: "1"
    };

    const addPerson = async () =>
      await addPersonMutation({}, { input }, context);

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

    const addPerson = async () =>
      await addPersonMutation({}, { input }, context);

    beforeEach(async () => {
      await context.eventRepository.store({
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
