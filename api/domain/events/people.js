const { generateId } = require("../id");
const { validatePresenceOfAll } = require("../errors/validation");

const ADD_PERSON = "ADD_PERSON";

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

function capitalize(word) {
  return word[0].toUpperCase() + word.substring(1);
}
