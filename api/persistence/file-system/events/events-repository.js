const fs = require("fs").promises;
const path = require("path");
const { applyFilters } = require("../../memory/apply-filters/filters");
const {
  validatePresenceOfAll,
  duplicateId
} = require("../../../domain/errors/validation");

module.exports.buildEventsRepository = directory => {
  const EventsRepositoryFilePath = path.join(directory, "events.json");

  async function load() {
    try {
      const data = await fs.readFile(EventsRepositoryFilePath, "utf8");
      return JSON.parse(data).events.map(transformEvent);
    } catch (error) {
      if (error.code === "ENOENT") {
        return [];
      } else throw error;
    }
  }

  async function save(events, { retry = true } = {}) {
    const data = { events };
    try {
      await fs.writeFile(EventsRepositoryFilePath, JSON.stringify(data), {
        encoding: "utf8",
        flag: "w"
      });
      return events;
    } catch (error) {
      if (retry && error.code === "ENOENT") {
        await fs.mkdir(directory, { recursive: true });
        await save(events, { retry: false });
      } else throw error;
    }
  }

  async function store(event) {
    validatePresenceOfAll(["id", "createdAt"], event);
    const events = await load();
    if (events.some(_ => _.id === event.id)) {
      throw duplicateId({ entityName: "Event", id: event.id });
    }
    events.push(event);
    await save(events);
    return event;
  }

  async function count({ filters } = {}) {
    const events = await load();
    return applyFilters({ filters }, events).length;
  }

  async function find({ filters } = {}) {
    const events = await load();
    return applyFilters({ filters }, events).sort(compareCreatedAt);
  }

  async function removeAll() {
    await save([]);
  }
  return {
    store,
    count,
    find,
    removeAll
  };
};

function transformEvent(rawEvent) {
  return {
    ...rawEvent,
    createdAt: new Date(rawEvent.createdAt)
  };
}

function compareCreatedAt(first, second) {
  return first.createdAt.getTime() - second.createdAt.getTime();
}
