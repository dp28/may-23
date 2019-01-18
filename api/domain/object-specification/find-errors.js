const { isSpecification } = require("./specification");
const { incorrectType, requiredProperty } = require("../errors/validation");
const { mergeErrors } = require("../errors/combined-error");
const { combineValidators } = require("./combine-validators");

module.exports = {
  findErrors
};

function findErrors({ specification, context }, value) {
  ensureIsSpecification(specification);
  if (arguments.length === 1) {
    return findErrors.bind(null, { specification, context });
  }
  return findError(specification, value, context);
}

function findError(specification, value, context) {
  const validators = [checkIsRequired, findErrorsInProperties, validate].map(
    _ => _.bind(null, specification)
  );
  const validateAll = combineValidators(validators, { sequentially: true });
  return validateAll(value, context);
}

function ensureIsSpecification(specification) {
  if (!isSpecification(specification)) {
    throw incorrectType({
      parameter: "specification",
      expected: "Specification"
    });
  }
}

function checkIsRequired(specification, value) {
  if (!specification.optional && (value === undefined || value === null)) {
    return requiredProperty({ property: specification.type });
  }
  return null;
}

function findErrorsInProperties(specification, value, context) {
  const propErrors = Object.entries(specification.properties).map(
    findErrorInProperty(context, value)
  );
  return mergeErrors(propErrors);
}

function findErrorInProperty(context, value) {
  return ([propertyName, propertySpecification]) => {
    const error = findErrors(
      { specification: propertySpecification, context },
      value[propertyName]
    );
    if (error) {
      error.property = propertyName;
      return error;
    }
    return null;
  };
}

function validate(specification, value, context) {
  return specification.validate(value, context);
}
