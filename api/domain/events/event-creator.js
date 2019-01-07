const { generateId } = require("../id");
const { validatePresenceOfAll } = require("../errors/validation");

module.exports = {
  buildEventCreator
};

function buildEventCreator({
  type,
  requiredDataFields = [],
  optionalDataFields = [],
  transformInput = {}
}) {
  return input => {
    validatePresenceOfAll(requiredDataFields, input);
    return {
      id: generateId(),
      createdAt: new Date(),
      type,
      data: buildData({
        fields: requiredDataFields.concat(optionalDataFields),
        input,
        transformInput
      })
    };
  };
}

function buildData({ fields, input, transformInput }) {
  const transformingReducer = buildTransformer(transformInput, input);
  return fields.reduce(transformingReducer, {});
}

function buildTransformer(transformMap, input) {
  return (result, field) => {
    if (!Object.hasOwnProperty.call(input, field)) {
      result[field] = null;
      return result;
    }
    const value = input[field];
    const transform = transformMap[field];
    result[field] = transform ? transform(value) : value;
    return result;
  };
}
