const { validatePresenceOfAll } = require("../../errors/validation");

module.exports = {
  combineValidators,
  combineValidatorsForType
};

function combineValidators({ validators, sequentially = false }) {
  return async (event, eventsRepository) => {
    if (sequentially) {
      for (let validator of validators) {
        await validator(event, eventsRepository);
      }
    } else {
      await Promise.all(
        validators.map(validator => validator(event, eventsRepository))
      );
    }
  };
}

function combineValidatorsForType({
  validators,
  sequentially,
  type,
  requiredDataFields = []
}) {
  const combined = combineValidators({ validators, sequentially });
  return async (event, eventsRepository) => {
    if (event.type === type) {
      validatePresenceOfAll(requiredDataFields, event.data);
      await combined(event, eventsRepository);
    }
  };
}
