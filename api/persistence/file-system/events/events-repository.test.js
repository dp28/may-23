const path = require("path");
const {
  itShouldBehaveLikeAnEventsRepository
} = require("../../../domain/event-repository-interface-test.js");
const { buildEventsRepository } = require("./events-repository");

describe("File-system-backed Event repository", () => {
  const testDirectory = path.join(__dirname, "../local-data/test/");
  itShouldBehaveLikeAnEventsRepository(() =>
    buildEventsRepository(testDirectory)
  );
});
