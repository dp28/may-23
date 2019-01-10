const { ADD_PERSON_TO_GROUP } = require("../types");
const { notFound } = require("../../errors/validation");
const { buildEventCreator } = require("../event-creator");
const {
  combineValidatorsForType
} = require("../validation/combine-validators");

const requiredDataFields = ["personId", "groupId"];

const addPersonToGroup = buildEventCreator({
  type: ADD_PERSON_TO_GROUP,
  requiredDataFields
});

async function ensurePersonExists(event, { peopleRepository }) {
  const id = event.data.personId;
  if (!(await peopleRepository.exists(id))) {
    throw notFound({ entityName: "Person", id });
  }
}

async function ensureGroupExists(event, { groupsRepository }) {
  const id = event.data.groupId;
  if (!(await groupsRepository.exists(id))) {
    throw notFound({ entityName: "Group", id });
  }
}

module.exports = {
  addPersonToGroup,
  validate: combineValidatorsForType({
    type: ADD_PERSON_TO_GROUP,
    requiredDataFields,
    validators: [ensurePersonExists, ensureGroupExists]
  })
};
