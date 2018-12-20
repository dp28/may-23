const path = require("path");
const {
  itShouldBehaveLikeAnEventRepository
} = require("../../../domain/event-repository-interface-test.js");
const { buildEventRepository } = require("./events-repository");

describe("File-system-backed Event repository", () => {
  const testDirectory = path.join(__dirname, "../local-data/test/");
  itShouldBehaveLikeAnEventRepository(() =>
    buildEventRepository(testDirectory)
  );
});
