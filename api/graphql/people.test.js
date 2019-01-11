const {
  resolvers: { Query, Person }
} = require("./people");
const { addPerson } = require("../domain/events/people");
const { addPersonToGroup, addGroup } = require("../domain/events/groups");
const { withContext } = require("./test-utils");
const { equal, notEqual } = require("../domain/filters/filters");

describe("people resolver", () => {
  const { resolver: peopleResolver, getEventsRepository } = withContext(
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

    beforeEach(() => getEventsRepository().store(event));

    it("should return that person as the only item", async () => {
      expect(await peopleResolver({}, {})).toEqual([
        {
          id: "fake",
          groupIds: [],
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
      await getEventsRepository().store(firstEvent);
      await getEventsRepository().store(secondEvent);
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

describe("Person resolvers", () => {
  describe(".groups", () => {
    const { resolver: groupsResolver, getEventsRepository } = withContext(
      Person.groups
    );

    it("should return an empty array if there are no groups for the person", async () => {
      const groups = await groupsResolver({ groupIds: [] }, {});
      expect(groups).toEqual([]);
    });

    describe("if the person is part of a group", () => {
      const addPersonEvent = addPerson({
        personId: "fake",
        firstName: "A",
        lastName: "B"
      });
      const addOtherPersonEvent = addPerson({
        personId: "fake2",
        firstName: "A",
        lastName: "B"
      });
      const addGroupEvent = addGroup({ groupId: "fake", name: "A" });
      const addPersonToGroupEvent = addPersonToGroup({
        groupId: "fake",
        personId: "fake"
      });
      const addOtherPersonToGroupEvent = addPersonToGroup({
        groupId: "fake",
        personId: "fake2"
      });

      beforeEach(
        async () =>
          await Promise.all(
            [
              addPersonEvent,
              addOtherPersonEvent,
              addGroupEvent,
              addPersonToGroupEvent,
              addOtherPersonToGroupEvent
            ].map(getEventsRepository().store)
          )
      );

      it("should return the groups the person is part of", async () => {
        const groups = await groupsResolver({ groupIds: ["fake"] }, {});
        expect(groups.map(_ => _.id)).toEqual(["fake"]);
      });

      it("should not return any if the groups are filtered out", async () => {
        const filters = [notEqual(["id"], "fake")];
        const groups = await groupsResolver(
          { groupIds: ["fake"] },
          { filters }
        );
        expect(groups).toEqual([]);
      });
    });
  });
});
