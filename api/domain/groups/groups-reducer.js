const { ADD_GROUP } = require("../events/types");

module.exports = { reducer };

function reducer(groups = {}, event) {
  switch (event.type) {
    case ADD_GROUP:
      return addGroup(groups, event);
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

function buildGroup({ data: { name, groupId } }) {
  return {
    id: groupId,
    name
  };
}
