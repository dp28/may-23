const path = require("path");
const {
  buildEventBackedRepository
} = require("../persistence/memory/event-backed-repository");
const {
  buildEventsRepository: inMemoryEventsRepository
} = require("../persistence/memory/events/events-repository");
const {
  buildEventsRepository: fileSystemEventsRepository
} = require("../persistence/file-system/events/events-repository");
const { reducer: groups } = require("../domain/groups/groups-reducer");
const { reducer: people } = require("../domain/people/people-reducer");

module.exports = {
  buildContext,
  buildFileSystemBackedContext
};

const ReducerMap = { groups, people };

function buildContext({ eventsRepository = inMemoryEventsRepository() } = {}) {
  const buildRepository = buildEventBackedRepository(eventsRepository);
  return Object.entries(ReducerMap).reduce(
    (context, [name, reducer]) => {
      context[`${name}Repository`] = buildRepository(reducer);
      return context;
    },
    {
      eventsRepository
    }
  );
}

function buildFileSystemBackedContext() {
  const dataSubDirectory = process.env.DATA_DIR || "tmp";
  const dataDirectory = path.join(
    __dirname,
    "../local-data/",
    dataSubDirectory
  );
  const eventsRepository = fileSystemEventsRepository(dataDirectory);
  return buildContext({ eventsRepository });
}
