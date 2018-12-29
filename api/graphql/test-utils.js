const {
  buildEventRepository
} = require("../persistence/memory/events/events-repository");

module.exports = {
  withContext
};

function withContext(resolver) {
  const result = {
    resolver: (object, args) => resolver(object, args, result.context),
    getEventRepository: () => result.context.eventRepository
  };

  beforeEach(() => {
    result.context = { eventRepository: buildEventRepository() };
  });

  afterEach(() => {
    result.context.eventRepository.removeAll();
  });

  return result;
}
