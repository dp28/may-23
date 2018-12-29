const EQUAL = "EQUAL";
const NOT_EQUAL = "NOT_EQUAL";
const COMPARISON_TYPES = [EQUAL, NOT_EQUAL];

function buildFilter(comparisonType) {
  return (propertyPath, value) => ({
    propertyPath,
    comparisonType,
    value
  });
}

module.exports = {
  equal: buildFilter(EQUAL),
  notEqual: buildFilter(NOT_EQUAL),
  EQUAL,
  NOT_EQUAL,
  COMPARISON_TYPES
};
