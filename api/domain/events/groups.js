const { validatePresenceOfAll } = require("../errors/validation");
const { ADD_GROUP } = require("./types");
const { equal } = require("../filters/filters");
const { duplicateId } = require("../errors/validation");
const { buildEventCreator } = require("./event-creator");

const requiredDataFields = ["name", "groupId"];

const addGroup = buildEventCreator({
  type: ADD_GROUP,
  requiredDataFields
});

async function validateAddGroupEvent(event, eventRepository) {
  validatePresenceOfAll(requiredDataFields, event.data);
  await ensureGroupIdDoesNotAlreadyExist(event.data.groupId, eventRepository);
}

async function ensureGroupIdDoesNotAlreadyExist(id, eventRepository) {
  const numberOfDupes = await eventRepository.count({
    filters: [equal(["data", "groupId"], id), equal(["type"], "ADD_GROUP")]
  });
  if (numberOfDupes > 0) {
    throw duplicateId({ entityName: "Group", id });
  }
}

module.exports = {
  addGroup,
  ADD_GROUP,
  validatorMap: {
    [ADD_GROUP]: validateAddGroupEvent
  }
};
