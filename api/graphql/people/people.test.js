const { addPersonMutation } = require("./people");
const { ADD_PERSON } = require("../../domain/events/people");
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
    await addPersonMutation({}, { firstName: "a", lastName: "b" }, context);
    expect((await context.eventRepository.find(filters)).length).toEqual(1);
  });
});
