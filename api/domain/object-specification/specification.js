const {
  validatePresenceOf,
  invalidParameter,
  incorrectType
} = require("../errors/validation");

module.exports = {
  Specification,
  isSpecification
};

const RequiredProperties = ["type", "optional", "validate", "properties"];

function isSpecification(object) {
  return Boolean(
    object &&
      typeof object === "object" &&
      RequiredProperties.every(prop =>
        Object.prototype.hasOwnProperty.call(object, prop)
      )
  );
}

const returnNull = () => null;

function Specification(args) {
  validatePresenceOf("type", args);
  const {
    type,
    optional = false,
    generate = undefined,
    validate = returnNull,
    defaultValue,
    properties = {},
    ...unknown
  } = args;
  ensureHasNoUnknownParameters(unknown);
  ensureOptionalIsBoolean(optional);
  ensureIsFunction("validate", validate);
  ensureAllPropertiesAreSpecifications(properties);
  if (generate !== undefined) {
    ensureIsFunction("generate", generate);
  }
  return {
    type,
    optional,
    generate,
    validate,
    defaultValue,
    properties
  };
}

function ensureHasNoUnknownParameters(unknown) {
  const names = Object.keys(unknown);
  if (names.length) {
    throw invalidParameter({
      parameter: names[0],
      reason: "unknown parameter"
    });
  }
}

function ensureOptionalIsBoolean(optional) {
  if (typeof optional !== "boolean") {
    throw incorrectType({
      parameter: "optional",
      expected: "Boolean"
    });
  }
}

function ensureIsFunction(name, func) {
  if (typeof func !== "function") {
    throw incorrectType({
      parameter: name,
      expected: "Function"
    });
  }
}

function ensureAllPropertiesAreSpecifications(properties) {
  Object.entries(properties).forEach(([name, value]) => {
    if (!isSpecification(value)) {
      throw incorrectType({
        parameter: name,
        expected: "Specification"
      });
    }
  });
}
