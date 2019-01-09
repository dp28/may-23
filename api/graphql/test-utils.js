const { buildContext } = require("./context");

module.exports = {
  withContext
};

function withContext(resolver) {
  const result = {
    resolver: (object, args) => resolver(object, args, result.context),
    getEventsRepository: () => result.context.eventsRepository
  };

  beforeEach(() => {
    result.context = buildContext();
  });

  afterEach(() => {
    result.context.eventsRepository.removeAll();
  });

  return result;
}
