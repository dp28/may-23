const { matchesInMemory } = require("../apply-filters/filters");
const { validatePresenceOfAll } = require("../../../domain/errors/validation");

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
  validatePresenceOfAll(["id", "createdAt"], event);
  await Events.push(event);
  return event;
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

function compareCreatedAt(first, second) {
  return first.createdAt.getTime() - second.createdAt.getTime();
}
