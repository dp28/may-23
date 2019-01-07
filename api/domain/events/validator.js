const { mergeDeepRight } = require("ramda");
const {
  validatePresenceOfAll,
  invalidParameter
} = require("../errors/validation");
const people = require("./people");
const groups = require("./groups");

const validatorMap = mergeDeepRight(people.validatorMap, groups.validatorMap);

module.exports = {
  validateEvent
};

async function validateEvent(event, eventRepository) {
  validatePresenceOfAll(["id", "createdAt", "type", "data"], event);
  await ensureDataIsValidForType(event, eventRepository);
}

async function ensureDataIsValidForType(event, eventRepository) {
  if (!Object.hasOwnProperty.call(validatorMap, event.type)) {
    throw invalidParameter({ parameter: "type" });
  }
  await validatorMap[event.type](event, eventRepository);
}
