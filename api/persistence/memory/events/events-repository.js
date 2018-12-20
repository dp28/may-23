const { matchesInMemory } = require("../apply-filters/filters");

module.exports.buildEventRepository = () => {
  return {
    store,
    count,
    find,
    removeAll
  };
};

let Events = [];

async function store(event) {
  ensureHas("id", event);
  ensureHas("createdAt", event);
  await Events.push(event);
  return event;
}

function ensureHas(property, object) {
  if (!object.hasOwnProperty(property)) {
    throw validationError({
      message: `Events must have a '${property}' property`,
      property
    });
  }
}

async function count() {
  return Events.length;
}

async function find({ filters = [] } = {}) {
  return Events.filter(event => matchesInMemory(filters, event)).sort(
    compareCreatedAt
  );
}

async function removeAll() {
  Events = [];
}

function validationError({ message, property }) {
  const error = new Error(message);
  error.message = message;
  error.property = property;
  error.type = "VALIDATION_ERROR";
  return error;
}

function compareCreatedAt(first, second) {
  return first.createdAt.getTime() - second.createdAt.getTime();
}
