const { curry } = require("ramda");
const { applyFilters } = require("./apply-filters/filters");

const buildEventBackedRepository = curry((eventsRepository, reducer) => {
  async function loadState() {
    const initialState = reducer(undefined, { type: "INIT" });
    const events = await eventsRepository.find();
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
});

module.exports = {
  buildEventBackedRepository
};
