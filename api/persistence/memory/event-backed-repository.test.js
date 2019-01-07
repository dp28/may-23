const { generateId } = require("../../domain/id");
const { buildEventBackedRepository } = require("./event-backed-repository");
const { buildEventRepository } = require("./events/events-repository");
const { equal } = require("../../domain/filters/filters");

function testEvent({ data = {}, type = "TEST" } = {}) {
  return {
    id: generateId(),
    type,
    createdAt: new Date(),
    data
  };
}

function testReducer(state = {}, event) {
  if (event.type !== "TEST") {
    return state;
  }
  return { ...state, [event.id]: event };
}

describe("An in-memory repository generated from an event repository and a map-based reducer", () => {
  const eventRepository = buildEventRepository();
  const repository = buildEventBackedRepository(eventRepository)(testReducer);

  afterEach(eventRepository.removeAll);

  describe("#find", () => {
    it("should return an empty array if no events have been added", async () => {
      expect(await repository.find()).toEqual([]);
    });

    it("should return an empty array if only irrelevant events have been added", async () => {
      await eventRepository.store(testEvent({ type: "USELESS" }));
      expect(await repository.find()).toEqual([]);
    });

    it("should return the listed results of the reducer if relevant events have been added", async () => {
      const event1 = testEvent();
      const event2 = testEvent();
      await eventRepository.store(event1);
      await eventRepository.store(event2);
      expect(await repository.find()).toEqual([event1, event2]);
    });

    describe("if filters are applied", () => {
      const event1 = testEvent({ data: { x: "1" } });
      const event2 = testEvent({ data: { x: "2" } });
      const filter = equal(["data", "x"], "2");

      it("should return only the results matching the filters", async () => {
        await eventRepository.store(event1);
        await eventRepository.store(event2);
        expect(
          await repository.find({
            filters: [filter]
          })
        ).toEqual([event2]);
      });
    });
  });

  describe("#count", () => {
    it("should return 0 if no events have been added", async () => {
      expect(await repository.count()).toEqual(0);
    });

    it("should return 0 if only irrelevant events have been added", async () => {
      await eventRepository.store(testEvent({ type: "USELESS" }));
      expect(await repository.count()).toEqual(0);
    });

    it("should return the number of results of the reducer if relevant events have been added", async () => {
      const event1 = testEvent();
      const event2 = testEvent();
      await eventRepository.store(event1);
      await eventRepository.store(event2);
      expect(await repository.count()).toEqual(2);
    });

    describe("if filters are applied", () => {
      const event1 = testEvent({ data: { x: "1" } });
      const event2 = testEvent({ data: { x: "2" } });
      const filter = equal(["data", "x"], "2");

      it("should return only the number of results matching the filters", async () => {
        await eventRepository.store(event1);
        await eventRepository.store(event2);
        expect(
          await repository.count({
            filters: [filter]
          })
        ).toEqual(1);
      });
    });
  });
});
