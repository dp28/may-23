const path = require("path");
const {
  buildRepositories: buildRepositoriesFromEventsRepo
} = require("../memory/repositories");
const { buildEventsRepository } = require("./events/events-repository");

module.exports = {
  buildRepositories
};

function buildRepositories() {
  const dataSubDirectory = process.env.DATA_DIR || "tmp";
  const dataDirectory = path.join(
    __dirname,
    "../../local-data/",
    dataSubDirectory
  );
  const eventsRepository = buildEventsRepository(dataDirectory);
  return buildRepositoriesFromEventsRepo({
    eventsRepositoryFactory: () => eventsRepository
  });
}
