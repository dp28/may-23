const {
  itShouldBehaveLikeAnEventRepository
} = require("../../../domain/event-repository-interface-test.js");
const { buildEventRepository } = require("./events-repository");

describe("File-system-backed Event repository", () => {
  itShouldBehaveLikeAnEventRepository(buildEventRepository);
});