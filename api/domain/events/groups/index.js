const { combineValidators } = require("../validation/combine-validators");
const { addGroup, validate: validateAddGroup } = require("./add-group");

module.exports = {
  addGroup,
  validate: combineValidators({ validators: [validateAddGroup] })
};
