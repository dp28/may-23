const { combineValidators } = require("./combine-validators");
const { Specification } = require("./specification");
const { findErrors } = require("./find-errors");
const {
  StringSpecification,
  BooleanSpecification,
  NumberSpecification,
  FunctionSpecification
} = require("./built-in-type-specifications");

module.exports = {
  combineValidators,
  Specification,
  findErrors,
  StringSpecification,
  BooleanSpecification,
  NumberSpecification,
  FunctionSpecification
};
