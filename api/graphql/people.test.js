const {
  resolvers: { Query }
} = require("./people");
const { addPerson } = require("../domain/events/people");
const { withContext } = require("./test-utils");
const { equal } = require("../domain/filters/filters");

describe("people resolver", () => {
  const { resolver: peopleResolver, getEventRepository } = withContext(
    Query.people
  );

  it("should return an empty array if there are no people", async () => {
    expect(await peopleResolver({}, {})).toEqual([]);
  });

  describe("if there is a stored person", () => {
    const event = addPerson({
      personId: "fake",
      firstName: "Test",
      lastName: "Tester"
    });

    beforeEach(() => getEventRepository().store(event));

    it("should return that person as the only item", async () => {
      expect(await peopleResolver({}, {})).toEqual([
        {
          id: "fake",
          name: {
            first: "Test",
            middle: null,
            last: "Tester",
            initials: "TT",
            full: "Test Tester"
          }
        }
      ]);
    });
  });

  describe("if there are two stored people", () => {
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

    it("should return both people", async () => {
      const people = await peopleResolver({}, {});
      expect(people.map(_ => _.id)).toEqual(["fake", "fake2"]);
    });

    describe("if a filter is passed that only matches one person", () => {
      it("should only return that person", async () => {
        const filter = equal(["name", "first"], "Test2");
        const people = await peopleResolver(
          {},
          {
            filters: [filter]
          }
        );
        expect(people.map(_ => _.id)).toEqual(["fake2"]);
      });
    });

    describe("if a filter is passed that matches both people", () => {
      it("should return both people", async () => {
        const filter = equal(["name", "last"], "Tester");
        const people = await peopleResolver(
          {},
          {
            filters: [filter]
          }
        );
        expect(people.length).toEqual(2);
      });
    });

    describe("if a filter is passed that matches neither person", () => {
      it("should return an empty list", async () => {
        const filter = equal(["id"], "UNKNOWN");
        expect(
          await peopleResolver(
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
