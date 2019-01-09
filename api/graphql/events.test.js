const { dissocPath } = require("ramda");
const {
  resolvers: {
    Event: { __resolveType: resolveEventType },
    Query,
    Mutation
  }
} = require("./events");
const { addPerson } = require("../domain/events/people");
const { withContext } = require("./test-utils");
const { equal } = require("../domain/filters/filters");

describe("Event.__resolveType", () => {
  it("should return 'AddPersonEvent' for 'ADD_PERSON' type events", () => {
    expect(
      resolveEventType(
        addPerson({
          personId: "fake",
          firstName: "Test",
          lastName: "Tester"
        })
      )
    ).toEqual("AddPersonEvent");
  });
});

describe("events resolver", () => {
  const { resolver: eventResolver, getEventsRepository } = withContext(
    Query.events
  );

  it("should return an empty array if there are no events", async () => {
    expect(await eventResolver({}, {})).toEqual([]);
  });

  describe("if there is a stored event", () => {
    const event = addPerson({
      personId: "fake",
      firstName: "Test",
      lastName: "Tester"
    });

    beforeEach(() => getEventsRepository().store(event));

    it("should return that event as the only item", async () => {
      expect(await eventResolver({}, {})).toEqual([event]);
    });
  });

  describe("if there are two stored events", () => {
    const firstEvent = addPerson({
      personId: "fake",
      firstName: "Test",
      lastName: "Tester"
    });
    const secondEvent = addPerson({
      personId: "fake2",
      firstName: "Test2",
      lastName: "Tester"
    });

    beforeEach(async () => {
      await getEventsRepository().store(firstEvent);
      await getEventsRepository().store(secondEvent);
    });

    it("should return both events", async () => {
      expect(await eventResolver({}, {})).toEqual([firstEvent, secondEvent]);
    });

    describe("if a filter is passed that only matches one event", () => {
      it("should only return that event", async () => {
        const filter = equal(["data", "personId"], secondEvent.data.personId);
        expect(
          await eventResolver(
            {},
            {
              filters: [filter]
            }
          )
        ).toEqual([secondEvent]);
      });
    });

    describe("if a filter is passed that matches both events", () => {
      it("should return both events", async () => {
        const filter = equal(["type"], secondEvent.type);
        expect(
          await eventResolver(
            {},
            {
              filters: [filter]
            }
          )
        ).toEqual([firstEvent, secondEvent]);
      });
    });

    describe("if a filter is passed that matches neither event", () => {
      it("should return an empty list", async () => {
        const filter = equal(["type"], "UNKNOWN");
        expect(
          await eventResolver(
            {},
            {
              filters: [filter]
            }
          )
        ).toEqual([]);
      });
    });
  });
});

describe("recordEvent mutation resolver", () => {
  const { getEventsRepository, resolver: recordEventMutation } = withContext(
    Mutation.recordEvent
  );
  const event = addPerson({
    firstName: "a",
    lastName: "b",
    personId: "fake_id"
  });

  it("should persist the event", async () => {
    await recordEventMutation({}, { event: { ADD_PERSON: event } });
    expect(await getEventsRepository().find()).toEqual([event]);
  });

  describe("if the event is invalid", () => {
    it("should throw an error", async () => {
      const invalidEvent = dissocPath(["data", "firstName"], event);
      try {
        await recordEventMutation({}, { event: { ADD_PERSON: invalidEvent } });
        fail("Should have thrown an error");
      } catch (error) {
        expect(error.code).toBeTruthy();
      }
    });
  });
});
