const {
  buildEventRepository
} = require("../persistence/memory/events/events-repository");
const {
  buildEventBackedRepository
} = require("../persistence/memory/event-backed-repository");

module.exports = {
  withContext
};

function withContext(resolver) {
  const result = {
    resolver: (object, args) => resolver(object, args, result.context),
    getEventRepository: () => result.context.eventRepository
  };

  beforeEach(() => {
    const eventRepository = buildEventRepository();
    result.context = {
      eventRepository,
      buildEventBackedRepository: buildEventBackedRepository(eventRepository)
    };
  });

  afterEach(() => {
    result.context.eventRepository.removeAll();
  });

  return result;
}
