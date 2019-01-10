const { reducer } = require("./groups-reducer");
const { onInit, reduceFromInitialState } = require("../test-utils");
const { addGroup, addPersonToGroup } = require("../events/groups");

describe("groups reducer", () => {
  onInit(reducer, result => {
    it("should return an empty object", () => {
      expect(result).toEqual({});
    });
  });

  describe("when a group is added", () => {
    const event = addGroup({
      name: "chums",
      groupId: "fakeId"
    });

    const groups = reduceFromInitialState(reducer, event);

    it("should return a single group", () => {
      expect(Object.keys(groups).length).toEqual(1);
    });

    it("should map to the group by their id", () => {
      const id = Object.keys(groups)[0];
      expect(groups[id].id).toEqual(id);
    });

    describe("the returned group", () => {
      const group = groups.fakeId;

      it("should have the passed in id", () => {
        expect(group.id).toEqual(event.data.groupId);
      });

      it("should have the passed-in name", () => {
        expect(group.name).toEqual("chums");
      });

      it("should have an empty array of people ids", () => {
        expect(group.peopleIds).toEqual([]);
      });
    });

    describe("if another group is added", () => {
      describe("with the same name but a different id", () => {
        const duplicateNameEvent = addGroup({
          name: event.data.name,
          groupId: "fakeId2"
        });
        const moreGroups = reducer(groups, duplicateNameEvent);

        it("should return two groups", () => {
          expect(Object.keys(moreGroups).length).toEqual(2);
        });
      });

      describe("with the same id but a different name", () => {
        const duplicateNameEvent = addGroup({
          name: "pals",
          groupId: event.data.groupId
        });
        const noMoreGroups = reducer(groups, duplicateNameEvent);

        it("should return just the first group", () => {
          expect(noMoreGroups).toEqual(groups);
        });
      });
    });
  });

  describe("when a person is added to a group", () => {
    const personId = "blabla";
    const groupId = "groupblabla";
    const event = addPersonToGroup({
      personId,
      groupId
    });

    const groups = reduceFromInitialState(
      reducer,
      addGroup({
        name: "chums",
        groupId
      })
    );

    it("should add the personId to the array of peopleIds", () => {
      const group = reducer(groups, event)[groupId];
      expect(group.peopleIds).toEqual([personId]);
    });
  });
});
