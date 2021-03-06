const { equal } = require("./filters/filters");
const {
  itShouldThrowAParameterMissingError,
  itShouldThrowACannotBeBlankError,
  itShouldThrowADuplicateIdError
} = require("./errors/error-test-helpers");

module.exports.itShouldBehaveLikeAnEventsRepository = buildEventsRepository => {
  describe("an Event repository", () => {
    let repository;
    beforeEach(async () => {
      repository = await buildEventsRepository();
    });

    afterEach(async () => {
      await repository.removeAll();
    });

    describe("#store", () => {
      it("increases the number of events by one", async () => {
        const event = buildEvent();
        expect(await repository.count()).toEqual(0);
        await repository.store(event);
        expect(await repository.count()).toEqual(1);
      });

      describe("if the object does not have an id", () => {
        itShouldThrowAParameterMissingError({
          throwError: async () => await repository.store({}),
          parameter: "id"
        });
      });

      describe("if the object has a falsy id", () => {
        itShouldThrowACannotBeBlankError({
          throwError: async () => await repository.store({ id: null }),
          parameter: "id"
        });
      });

      describe("if the object does not have a createdAt property", () => {
        itShouldThrowAParameterMissingError({
          throwError: async () => await repository.store({ id: "fake" }),
          parameter: "createdAt"
        });
      });

      describe("if the object has a falsy createdAt", () => {
        itShouldThrowACannotBeBlankError({
          throwError: async () =>
            await repository.store({ id: "fake", createdAt: "" }),
          parameter: "createdAt"
        });
      });

      describe("if an event has already been added with the same id", () => {
        const addEvent = async () =>
          await repository.store({ id: "fake", createdAt: new Date() });

        beforeEach(addEvent);
        itShouldThrowADuplicateIdError({
          throwError: addEvent,
          entityName: "Event"
        });
      });
    });

    describe("#find", () => {
      it("should return all events if no filters are applied", async () => {
        const event = buildEvent();
        await repository.store(event);
        const results = await repository.find();
        expect(results).toEqual([event]);
      });

      it("should return only the events that match the filters", async () => {
        await repository.store(
          buildEvent({
            id: "fake1",
            shouldMatch: true,
            should: { match: true }
          })
        );
        await repository.store(
          buildEvent({
            id: "fake2",
            shouldMatch: false,
            should: { match: true }
          })
        );
        await repository.store(
          buildEvent({
            id: "fake3",
            shouldMatch: true,
            should: { match: false }
          })
        );
        await repository.store(
          buildEvent({
            id: "fake4",
            shouldMatch: true,
            should: { match: true }
          })
        );
        const results = await repository.find({
          filters: [
            equal(["shouldMatch"], true),
            equal(["should", "match"], true)
          ]
        });
        expect(results.map(_ => _.id)).toEqual(["fake1", "fake4"]);
      });

      it("should order events by createdAt, ascending", async () => {
        await repository.store(
          buildEvent({ id: "fake1", createdAt: new Date(2014, 1, 1) })
        );
        await repository.store(
          buildEvent({ id: "fake2", createdAt: new Date(2010, 1, 1) })
        );
        await repository.store(
          buildEvent({ id: "fake3", createdAt: new Date(2018, 1, 1) })
        );
        const results = await repository.find();
        expect(results.map(_ => _.id)).toEqual(["fake2", "fake1", "fake3"]);
      });
    });

    describe("#count", () => {
      it("should return the number of all the events if no filters are applied", async () => {
        const event = buildEvent();
        await repository.store(event);
        const number = await repository.count();
        expect(number).toEqual(1);
      });

      it("should return the number of events that match the filters", async () => {
        await repository.store(
          buildEvent({
            id: "fake1",
            shouldMatch: true,
            should: { match: true }
          })
        );
        await repository.store(
          buildEvent({
            id: "fake2",
            shouldMatch: false,
            should: { match: true }
          })
        );
        await repository.store(
          buildEvent({
            id: "fake3",
            shouldMatch: true,
            should: { match: false }
          })
        );
        await repository.store(
          buildEvent({
            id: "fake4",
            shouldMatch: true,
            should: { match: true }
          })
        );
        const number = await repository.count({
          filters: [
            equal(["shouldMatch"], true),
            equal(["should", "match"], true)
          ]
        });
        expect(number).toEqual(2);
      });
    });
  });
};

function buildEvent(additional = {}) {
  return {
    id: "fake_id",
    createdAt: new Date(),
    ...additional
  };
}
