const { upperCaseFirst: capitalize } = require("change-case");
const { validatePresenceOfAll } = require("../errors/validation");
const { ADD_PERSON } = require("./types");
const { equal } = require("../filters/filters");
const { duplicateId } = require("../errors/validation");
const { buildEventCreator } = require("./event-creator");

const requiredDataFields = ["firstName", "lastName", "personId"];

const addPerson = buildEventCreator({
  type: ADD_PERSON,
  requiredDataFields,
  optionalDataFields: ["middleName"],
  transformInput: {
    firstName: capitalize,
    lastName: capitalize,
    middleName: capitalize
  }
});

async function validateAddPersonEvent(event, eventRepository) {
  validatePresenceOfAll(requiredDataFields, event.data);
  await ensurePersonIdDoesNotAlreadyExist(event.data.personId, eventRepository);
}

async function ensurePersonIdDoesNotAlreadyExist(id, eventRepository) {
  const numberOfDupes = await eventRepository.count({
    filters: [equal(["data", "personId"], id), equal(["type"], "ADD_PERSON")]
  });
  if (numberOfDupes > 0) {
    throw duplicateId({ entityName: "Person", id });
  }
}

module.exports = {
  addPerson,
  ADD_PERSON,
  validatorMap: {
    [ADD_PERSON]: validateAddPersonEvent
  }
};
