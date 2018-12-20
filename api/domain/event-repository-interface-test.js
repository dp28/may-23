const { equal } = require("./filters/filters");

module.exports.itShouldBehaveLikeAnEventRepository = buildEventRepository => {
  describe("an Event repository", () => {
    let repository;
    beforeEach(async () => {
      repository = await buildEventRepository();
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

      it("throws an error if the object does not have an id", async () => {
        try {
          await repository.store({});
          fail("Should have thrown an error");
        } catch (error) {
          expect(error.type).toEqual("VALIDATION_ERROR");
          expect(error.property).toEqual("id");
        }
      });

      it("throws an error if the object does not have a createdAt property", async () => {
        try {
          await repository.store({ id: "fake" });
          fail("Should have thrown an error");
        } catch (error) {
          expect(error.type).toEqual("VALIDATION_ERROR");
          expect(error.property).toEqual("createdAt");
        }
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
            id: "fake1",
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
  });
};

function buildEvent(additional = {}) {
  return {
    id: "fake_id",
    createdAt: new Date(),
    ...additional
  };
}
