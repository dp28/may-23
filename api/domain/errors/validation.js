const {
  PARAMETER_MISSING,
  VALIDATION,
  CANNOT_BE_BLANK,
  DUPLICATE_ID,
  INVALID_PARAMETER,
  NOT_FOUND
} = require("./codes");
const { buildError } = require("./error");

module.exports = {
  validationError,
  parameterMissing,
  validatePresenceOf,
  validatePresenceOfAll,
  duplicateId,
  notFound,
  invalidParameter
};

function validatePresenceOfAll(parameters, object) {
  parameters.forEach(parameter => validatePresenceOf(parameter, object));
}

function validatePresenceOf(parameter, object) {
  if (!Object.hasOwnProperty.call(object, parameter)) {
    throw parameterMissing({ parameter });
  }
  if (!object[parameter]) {
    throw cannotBeBlank({ parameter });
  }
}

function validationError({ message, parameter }) {
  return buildError({
    message,
    code: VALIDATION,
    parameter
  });
}

function parameterMissing({ message, parameter }) {
  return buildError({
    message: message || `missing '${parameter}' parameter`,
    code: PARAMETER_MISSING,
    parameter
  });
}

function invalidParameter({ reason, parameter }) {
  const suffix = reason ? `: ${reason}` : "";
  return buildError({
    message: `invalid value for '${parameter}' parameter${suffix}`,
    code: INVALID_PARAMETER,
    parameter
  });
}

function cannotBeBlank({ parameter }) {
  return buildError({
    message: `'${parameter}' cannot be falsy`,
    code: CANNOT_BE_BLANK,
    parameter
  });
}

function duplicateId({ entityName, id }) {
  return buildError({
    message: `'${entityName}' already exists with id '${id}'`,
    code: DUPLICATE_ID,
    duplicateId: id,
    entityName
  });
}

function notFound({ entityName, id }) {
  return buildError({
    message: `'${entityName}' not found with id '${id}'`,
    code: NOT_FOUND,
    id,
    entityName
  });
}
