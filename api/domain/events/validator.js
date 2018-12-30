const {
  validatePresenceOfAll,
  invalidParameter
} = require("../errors/validation");
const { validatorMap } = require("./people");

module.exports = {
  validateEvent
};

async function validateEvent(event, eventRepository) {
  validatePresenceOfAll(["id", "createdAt", "type", "data"], event);
  await ensureDataIsValidForType(event, eventRepository);
}

async function ensureDataIsValidForType(event, eventRepository) {
  if (validatorMap[event.type]) {
    await validatorMap[event.type](event, eventRepository);
  }
  throw invalidParameter({ parameter: "type" });
}
