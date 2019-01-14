const {
  resolvers: { Query, Group }
} = require("./groups");
const { addGroup, addPersonToGroup } = require("../domain/events/groups");
const { addPerson } = require("../domain/events/people");
const { withContext } = require("./test-utils");
const { equal, notEqual } = require("../domain/filters/filters");

describe("groups resolver", () => {
  const { resolver: groupsResolver, getEventsRepository } = withContext(
    Query.groups
  );

  it("should return an empty array if there are no groups", async () => {
    expect(await groupsResolver({}, {})).toEqual([]);
  });

  describe("if there is a stored group", () => {
    const event = addGroup({
      groupId: "fake",
      name: "Test"
    });

    beforeEach(() => getEventsRepository().store(event));

    it("should return that group as the only item", async () => {
      expect(await groupsResolver({}, {})).toEqual([
        {
          id: "fake",
          name: "Test",
          peopleIds: []
        }
      ]);
    });
  });

  describe("if there are two stored groups", () => {
    const firstEvent = addGroup({
      groupId: "fake",
      name: "Test"
    });
    const secondEvent = addGroup({
      groupId: "fake2",
      name: "Test2"
    });

    beforeEach(async () => {
      await getEventsRepository().store(firstEvent);
      await getEventsRepository().store(secondEvent);
    });

    it("should return both groups", async () => {
      const groups = await groupsResolver({}, {});
      expect(groups.map(_ => _.id)).toEqual(["fake", "fake2"]);
    });

    describe("if a filter is passed that only matches one group", () => {
      it("should only return that group", async () => {
        const filter = equal(["name"], "Test2");
        const groups = await groupsResolver(
          {},
          {
            filters: [filter]
          }
        );
        expect(groups.map(_ => _.id)).toEqual(["fake2"]);
      });
    });

    describe("if a filter is passed that matches both groups", () => {
      it("should return both groups", async () => {
        const filter = notEqual(["name"], "Tester");
        const groups = await groupsResolver(
          {},
          {
            filters: [filter]
          }
        );
        expect(groups.length).toEqual(2);
      });
    });

    describe("if a filter is passed that matches neither group", () => {
      it("should return an empty list", async () => {
        const filter = equal(["id"], "UNKNOWN");
        expect(
          await groupsResolver(
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

describe("Group resolvers", () => {
  describe(".people", () => {
    const { resolver: peopleResolver, getEventsRepository } = withContext(
      Group.people
    );

    it("should return an empty array if there are no people for the person", async () => {
      const people = await peopleResolver({ peopleIds: [] }, {});
      expect(people).toEqual([]);
    });

    describe("if the group contains a person", () => {
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

      it("should return the people in the group", async () => {
        const people = await peopleResolver({ peopleIds: ["fake"] }, {});
        expect(people.map(_ => _.id)).toEqual(["fake"]);
      });

      it("should not return any people if they are filtered out", async () => {
        const filters = [notEqual(["id"], "fake")];
        const people = await peopleResolver(
          { peopleIds: ["fake"] },
          { filters }
        );
        expect(people).toEqual([]);
      });
    });
  });
});
