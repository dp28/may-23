const { combineValidators } = require("../validation/combine-validators");
const { addGroup, validate: validateAddGroup } = require("./add-group");
const {
  addPersonToGroup,
  validate: validateAddPersonToGroup
} = require("./add-person-to-group");

module.exports = {
  addGroup,
  addPersonToGroup,
  validate: combineValidators({
    validators: [validateAddGroup, validateAddPersonToGroup]
  })
};
