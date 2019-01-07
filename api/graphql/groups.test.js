const {
  resolvers: { Query }
} = require("./groups");
const { addGroup } = require("../domain/events/groups");
const { withContext } = require("./test-utils");
const { equal, notEqual } = require("../domain/filters/filters");

describe("groups resolver", () => {
  const { resolver: groupsResolver, getEventRepository } = withContext(
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

    beforeEach(() => getEventRepository().store(event));

    it("should return that group as the only item", async () => {
      expect(await groupsResolver({}, {})).toEqual([
        {
          id: "fake",
          name: "Test"
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
      await getEventRepository().store(firstEvent);
      await getEventRepository().store(secondEvent);
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
