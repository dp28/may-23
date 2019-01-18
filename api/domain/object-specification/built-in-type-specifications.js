const { Specification } = require("./specification");
const { incorrectType } = require("../errors/validation");

module.exports = {
  StringSpecification: BuiltInTypeSpecification("string"),
  BooleanSpecification: BuiltInTypeSpecification("boolean"),
  FunctionSpecification: BuiltInTypeSpecification("function"),
  NumberSpecification: BuiltInTypeSpecification("number")
};

function BuiltInTypeSpecification(type) {
  return ({ optional, defaultValue, generate, properties } = {}) =>
    Specification({
      type,
      optional,
      defaultValue,
      generate,
      properties,
      validate: validateType(type)
    });
}

function validateType(type) {
  return value =>
    typeof value === type ? null : incorrectType({ expected: type });
}
