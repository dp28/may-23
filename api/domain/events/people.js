const { upperCaseFirst: capitalize } = require("change-case");
const { generateId } = require("../id");
const { validatePresenceOfAll } = require("../errors/validation");
const { ADD_PERSON } = require("./types");
const { equal } = require("../filters/filters");
const { duplicateId } = require("../errors/validation");

module.exports = {
  addPerson,
  ADD_PERSON,
  validatorMap: {
    [ADD_PERSON]: validateAddPersonEvent
  }
};

function addPerson(args) {
  validateAddPersonEventData(args);
  const { firstName, middleName, lastName, personId } = args;
  return {
    id: generateId(),
    createdAt: new Date(),
    type: ADD_PERSON,
    data: {
      personId,
      firstName: capitalize(firstName),
      lastName: capitalize(lastName),
      middleName: middleName ? capitalize(middleName) : null
    }
  };
}

async function validateAddPersonEvent(event, eventRepository) {
  validateAddPersonEventData(event.data);
  await ensurePersonIdDoesNotAlreadyExist(event.data.personId, eventRepository);
}

function validateAddPersonEventData(data) {
  validatePresenceOfAll(["firstName", "lastName", "personId"], data);
}
async function ensurePersonIdDoesNotAlreadyExist(id, eventRepository) {
  const numberOfDupes = await eventRepository.count({
    filters: [equal(["data", "personId"], id), equal(["type"], "ADD_PERSON")]
  });
  if (numberOfDupes > 0) {
    throw duplicateId({ entityName: "Person", id });
  }
}
