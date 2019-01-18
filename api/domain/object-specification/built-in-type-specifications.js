const { Specification } = require("./specification");
const { combineValidators } = require("./combine-validators");
const { incorrectType } = require("../errors/validation");

module.exports = {
  StringSpecification: BuiltInTypeSpecification("string"),
  BooleanSpecification: BuiltInTypeSpecification("boolean"),
  FunctionSpecification: BuiltInTypeSpecification("function"),
  NumberSpecification: BuiltInTypeSpecification("number")
};

function BuiltInTypeSpecification(type) {
  return ({ optional, defaultValue, generate, properties, validate } = {}) =>
    Specification({
      type,
      optional,
      defaultValue,
      generate,
      properties,
      validate: !validate
        ? validateType(type)
        : combineValidators([validateType(type), validate], {
            sequentially: true
          })
    });
}

function validateType(type) {
  return value =>
    typeof value === type ? null : incorrectType({ expected: type });
}
