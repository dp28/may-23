const { ADD_GROUP } = require("./types");
const { equal } = require("../filters/filters");
const { duplicateId } = require("../errors/validation");
const { buildEventCreator } = require("./event-creator");
const { combineValidatorsForType } = require("./validation/combine-validators");

const requiredDataFields = ["name", "groupId"];

const addGroup = buildEventCreator({
  type: ADD_GROUP,
  requiredDataFields
});

async function ensureGroupIdDoesNotAlreadyExist(event, eventRepository) {
  const id = event.data.groupId;
  const numberOfDupes = await eventRepository.count({
    filters: [equal(["data", "groupId"], id), equal(["type"], "ADD_GROUP")]
  });
  if (numberOfDupes > 0) {
    throw duplicateId({ entityName: "Group", id });
  }
}

module.exports = {
  addGroup,
  validate: combineValidatorsForType({
    type: ADD_GROUP,
    requiredDataFields,
    validators: [ensureGroupIdDoesNotAlreadyExist]
  })
};
