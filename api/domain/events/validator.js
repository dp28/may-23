const {
  validatePresenceOfAll,
  invalidParameter
} = require("../errors/validation");
const { validatorMap } = require("./people");

module.exports = {
  validateEvent
};

function validateEvent(event) {
  validatePresenceOfAll(["id", "createdAt", "type", "data"], event);
  ensureDataIsValidForType(event);
}

function ensureDataIsValidForType(event) {
  if (validatorMap[event.type]) {
    validatorMap[event.type](event.data);
  }
  throw invalidParameter({ parameter: "type" });
}
