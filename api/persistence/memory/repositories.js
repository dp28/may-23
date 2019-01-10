const { buildEventBackedRepository } = require("./event-backed-repository");
const { buildEventsRepository } = require("./events/events-repository");
const { reducer: groups } = require("../../domain/groups/groups-reducer");
const { reducer: people } = require("../../domain/people/people-reducer");

module.exports = {
  buildRepositories
};

const ReducerMap = { groups, people };

function buildRepositories({
  eventsRepositoryFactory = buildEventsRepository
} = {}) {
  const eventsRepository = eventsRepositoryFactory();
  const buildRepository = buildEventBackedRepository(eventsRepository);
  return Object.entries(ReducerMap).reduce(
    (factories, [name, reducer]) => {
      factories[`${name}Repository`] = buildRepository(reducer);
      return factories;
    },
    {
      eventsRepository
    }
  );
}
