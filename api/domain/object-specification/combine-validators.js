const { mergeErrors } = require("../errors/combined-error");

module.exports = {
  combineValidators
};

const isNotNullAndUndefined = x => x !== null && x !== undefined;

function combineValidators(validators, { sequentially = false } = {}) {
  const apply = sequentially ? applySequentially : applyInParallel;
  return (input, context) => {
    const { errors, isAsync } = apply(validators, input, context);
    return isAsync ? mergeAsync(errors) : mergeErrors(errors);
  };
}

function applyInParallel(validators, input, context) {
  return validators
    .map(validator => validator(input, context))
    .reduce(addValidationResult, buildEmptyValidationResult());
}

function isPromise(value) {
  return value && value.then && typeof value.then === "function";
}

function addToArray(array, element) {
  const arrayElement = Array.isArray(element) ? element : [element];
  return array.concat(arrayElement);
}

function applySequentially(validators, input, context) {
  for (let validator of validators) {
    const value = validator(input, context);
    if (isNotNullAndUndefined(value)) {
      return addValidationResult({}, value);
    }
  }
  return buildEmptyValidationResult();
}

function addValidationResult({ isAsync = false, errors = [] } = {}, value) {
  return {
    isAsync: isAsync || isPromise(value),
    errors: isNotNullAndUndefined(value) ? addToArray(errors, value) : errors
  };
}

function buildEmptyValidationResult() {
  return addValidationResult();
}

function mergeAsync(errors) {
  return Promise.all(errors)
    .then(resolvedErrors => resolvedErrors.filter(isNotNullAndUndefined))
    .then(mergeErrors);
}
