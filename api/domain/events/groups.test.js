const { ADD_GROUP } = require("./types");
const { addGroup, validate } = require("./groups");
const { testEventCreatorAndValidator } = require("./test-utils");

testEventCreatorAndValidator({
  eventType: ADD_GROUP,
  eventCreator: addGroup,
  exampleInput: {
    name: "my group",
    groupId: "fake_id"
  },
  requiredDataFields: ["name", "groupId"],
  uniqueDataFields: ["groupId"],
  validate,
  entityName: "Group"
});
