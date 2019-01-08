const {
  validatePresenceOfAll,
  invalidParameter
} = require("../../errors/validation");
const EventTypes = require("../types");
const { combineValidators } = require("./combine-validators");

const validators = [require("../groups"), require("../people")].map(
  _ => _.validate
);

const validateEventTypes = combineValidators({ validators });

const validateEvent = combineValidators({
  validators: [validateBaseEvent, validateEventTypes],
  sequentially: true
});

function validateBaseEvent(event) {
  validatePresenceOfAll(["id", "createdAt", "type", "data"], event);
  if (!Object.hasOwnProperty.call(EventTypes, event.type)) {
    throw invalidParameter({ parameter: "type" });
  }
}

module.exports = {
  validateEvent
};
