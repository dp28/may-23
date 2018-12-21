const {
  UNKNOWN_ERROR,
  PARAMETER_MISSING,
  VALIDATION,
  CANNOT_BE_BLANK
} = require("./codes");

module.exports = {
  validationError,
  parameterMissing,
  validatePresenceOf,
  validatePresenceOfAll
};

function validatePresenceOfAll(parameters, object) {
  parameters.forEach(parameter => validatePresenceOf(parameter, object));
}

function validatePresenceOf(parameter, object) {
  if (!object.hasOwnProperty(parameter)) {
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

function cannotBeBlank({ parameter }) {
  return buildError({
    message: `'${parameter}' cannot be falsy`,
    code: CANNOT_BE_BLANK,
    parameter
  });
}

function buildError({ message, code, ...properties }) {
  const error = new Error(message);
  error.message = message || "An unknown error occurred";
  error.code = code || UNKNOWN_ERROR;
  return Object.assign(error, properties);
}
