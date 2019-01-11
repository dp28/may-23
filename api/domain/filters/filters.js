const EQUAL = "EQUAL";
const NOT_EQUAL = "NOT_EQUAL";
const CONTAINED_IN = "CONTAINED_IN";
const COMPARISON_TYPES = [EQUAL, NOT_EQUAL, CONTAINED_IN];

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
  containedIn: buildFilter(CONTAINED_IN),
  EQUAL,
  NOT_EQUAL,
  CONTAINED_IN,
  COMPARISON_TYPES
};
