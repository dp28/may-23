const { applyFilters } = require("../apply-filters/filters");
const {
  validatePresenceOfAll,
  duplicateId
} = require("../../../domain/errors/validation");

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
  if (Events.some(_ => _.id === event.id)) {
    throw duplicateId({ entityName: "Event", id: event.id });
  }
  await Events.push(event);
  return event;
}

async function count({ filters } = {}) {
  return applyFilters({ filters }, Events).length;
}

async function find({ filters } = {}) {
  return applyFilters({ filters }, Events).sort(compareCreatedAt);
}

async function removeAll() {
  Events = [];
}

function compareCreatedAt(first, second) {
  return first.createdAt.getTime() - second.createdAt.getTime();
}
