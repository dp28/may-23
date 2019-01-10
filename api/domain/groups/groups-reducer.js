const { ADD_GROUP, ADD_PERSON_TO_GROUP } = require("../events/types");

module.exports = { reducer };

function reducer(groups = {}, event) {
  switch (event.type) {
    case ADD_GROUP:
      return addGroup(groups, event);
    case ADD_PERSON_TO_GROUP:
      return addPersonToGroup(groups, event);
    default:
      return groups;
  }
}

function addGroup(groups, event) {
  if (groups[event.data.groupId]) {
    return groups;
  }
  return { ...groups, [event.data.groupId]: buildGroup(event) };
}

function addPersonToGroup(groups, { data: { groupId, personId } }) {
  const group = groups[groupId];
  return {
    ...groups,
    [groupId]: { ...group, peopleIds: [...group.peopleIds, personId] }
  };
}

function buildGroup({ data: { name, groupId } }) {
  return {
    id: groupId,
    name,
    peopleIds: []
  };
}
