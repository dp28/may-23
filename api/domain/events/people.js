const { upperCaseFirst: capitalize } = require("change-case");
const { generateId } = require("../id");
const { validatePresenceOfAll } = require("../errors/validation");
const { ADD_PERSON } = require("./types");

module.exports = {
  addPerson,
  ADD_PERSON,
  validatorMap: {
    [ADD_PERSON]: validateAddPersonEventData
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

function validateAddPersonEventData(data) {
  validatePresenceOfAll(["firstName", "lastName", "personId"], data);
}
