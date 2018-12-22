const { generateId } = require("../id");
const { validatePresenceOfAll } = require("../errors/validation");

const ADD_PERSON = "ADD_PERSON";

module.exports = {
  addPerson,
  ADD_PERSON
};

function addPerson(args) {
  validatePresenceOfAll(["firstName", "lastName", "personId"], args);
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

function capitalize(word) {
  return word[0].toUpperCase() + word.substring(1);
}
