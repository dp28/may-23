const { upperCaseFirst: capitalize } = require("change-case");
const { ADD_PERSON } = require("./types");
const { equal } = require("../filters/filters");
const { duplicateId } = require("../errors/validation");
const { buildEventCreator } = require("./event-creator");
const { combineValidatorsForType } = require("./validation/combine-validators");

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

async function ensurePersonIdDoesNotAlreadyExist(event, eventRepository) {
  const id = event.data.personId;
  const numberOfDupes = await eventRepository.count({
    filters: [equal(["data", "personId"], id), equal(["type"], "ADD_PERSON")]
  });
  if (numberOfDupes > 0) {
    throw duplicateId({ entityName: "Person", id });
  }
}

module.exports = {
  addPerson,
  validate: combineValidatorsForType({
    type: ADD_PERSON,
    requiredDataFields,
    validators: [ensurePersonIdDoesNotAlreadyExist]
  })
};
