const { generateId } = require("../id");
const { validatePresenceOfAll } = require("../errors/validation");
const { ADD_GROUP } = require("./types");
const { equal } = require("../filters/filters");
const { duplicateId } = require("../errors/validation");

module.exports = {
  addGroup,
  ADD_GROUP,
  validatorMap: {
    [ADD_GROUP]: validateAddGroupEvent
  }
};

function addGroup(args) {
  validateAddGroupEventData(args);
  const { name, groupId } = args;
  return {
    id: generateId(),
    createdAt: new Date(),
    type: ADD_GROUP,
    data: {
      groupId,
      name
    }
  };
}

async function validateAddGroupEvent(event, eventRepository) {
  validateAddGroupEventData(event.data);
  await ensureGroupIdDoesNotAlreadyExist(event.data.groupId, eventRepository);
}

function validateAddGroupEventData(data) {
  validatePresenceOfAll(["name", "groupId"], data);
}
async function ensureGroupIdDoesNotAlreadyExist(id, eventRepository) {
  const numberOfDupes = await eventRepository.count({
    filters: [equal(["data", "groupId"], id), equal(["type"], "ADD_GROUP")]
  });
  if (numberOfDupes > 0) {
    throw duplicateId({ entityName: "Group", id });
  }
}
