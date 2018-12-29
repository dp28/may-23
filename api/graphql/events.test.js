const {
  resolvers: {
    Event: { __resolveType: resolveEventType },
    Query
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
  const { resolver: eventResolver, getEventRepository } = withContext(
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

    beforeEach(() => getEventRepository().store(event));

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
      await getEventRepository().store(firstEvent);
      await getEventRepository().store(secondEvent);
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
