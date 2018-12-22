const { EQUAL, NOT_EQUAL } = require("../../../domain/filters/filters");

module.exports = {
  matchesInMemory,
  applyFilters
};

function applyFilters({ filters = [] }, collection) {
  if (filters.length === 0) {
    return collection;
  }
  return collection.filter(object => matchesInMemory(filters, object));
}

function matchesInMemory(filters, object) {
  return filters.every(filter => singleFilterMatches(filter, object));
}

function singleFilterMatches(filter, object) {
  const optionalValue = getValue(filter.propertyPath, object);
  if (!optionalValue.hasValue) {
    return false;
  }
  return matchesValue(filter, optionalValue.value);
}

function matchesValue(filter, value) {
  switch (filter.comparisonType) {
    case EQUAL:
      return filter.value === value;
    case NOT_EQUAL:
      return filter.value !== value;
    default:
      throw new Error(`Unknown comparisonType "${filter.comparisonType}"`);
  }
}

function getValue(propertyPath, object) {
  if (propertyPath.length === 0) {
    return {
      hasValue: true,
      value: object
    };
  }
  const [property, ...remainingPropertyPath] = propertyPath;
  if (object && object.hasOwnProperty(property)) {
    return getValue(remainingPropertyPath, object[property]);
  }
  return { hasValue: false };
}
