const { applyFilters } = require("./apply-filters/filters");

module.exports = {
  buildEventBackedRepository
};

function buildEventBackedRepository({ reducer, eventRepository }) {
  async function loadState() {
    const initialState = reducer(undefined, { type: "INIT" });
    const events = await eventRepository.find();
    return events.reduce(reducer, initialState);
  }

  async function find({ filters } = {}) {
    const mappedById = await loadState();
    const values = Object.values(mappedById);
    return applyFilters({ filters }, values);
  }

  async function count({ filters } = {}) {
    const results = await find({ filters });
    return results.length;
  }

  return {
    find,
    count
  };
}