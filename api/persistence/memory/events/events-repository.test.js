const {
  itShouldBehaveLikeAnEventsRepository
} = require("../../../domain/event-repository-interface-test.js");
const { buildEventsRepository } = require("./events-repository");

describe("File-system-backed Event repository", () => {
  itShouldBehaveLikeAnEventsRepository(buildEventsRepository);
});
