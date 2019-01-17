const { COMBINED } = require("./codes");
const { buildError } = require("./error");

module.exports = {
  combinedError,
  mergeErrors
};

function combinedError(errors) {
  return buildError({
    code: COMBINED,
    message: `${errors.length} errors have occurred`,
    errors
  });
}

function mergeErrors(possibleErrors) {
  const errors = possibleErrors.filter(Boolean);
  if (!errors.length) {
    return null;
  }
  if (errors.length === 1) {
    return errors[0];
  }
  const uncombinedErrors = findUncombinedErrors(errors);
  return combinedError(uncombinedErrors);
}

function findUncombinedErrors(errors) {
  return errors.reduce((result, error) => {
    if (error && error.code && error.code === COMBINED) {
      return result.concat(findUncombinedErrors(error.errors));
    }
    return [...result, error];
  }, []);
}
