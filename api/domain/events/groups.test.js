const { addGroup, ADD_GROUP, validatorMap } = require("./groups");
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
  validatorMap,
  entityName: "Group"
});
