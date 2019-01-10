const { upperCaseFirst: capitalize } = require("change-case");
const { identity, head } = require("ramda");
const { ADD_PERSON, ADD_PERSON_TO_GROUP } = require("../events/types");

module.exports = { reducer };

function reducer(people = {}, event) {
  switch (event.type) {
    case ADD_PERSON:
      return addPerson(people, event);
    case ADD_PERSON_TO_GROUP:
      return addPersonToGroup(people, event);
    default:
      return people;
  }
}

function addPerson(people, event) {
  if (people[event.data.personId]) {
    return people;
  }
  return { ...people, [event.data.personId]: buildPerson(event) };
}

function buildPerson({ data: { firstName, middleName, lastName, personId } }) {
  const first = capitalize(firstName);
  const middle = middleName ? capitalize(middleName) : null;
  const last = capitalize(lastName);
  const names = [first, middle, last].filter(identity);
  return {
    id: personId,
    name: {
      first,
      middle,
      last,
      full: names.join(" "),
      initials: names.map(head).join("")
    },
    groupIds: []
  };
}

function addPersonToGroup(people, { data: { personId, groupId } }) {
  const person = people[personId];
  return {
    ...people,
    [personId]: { ...person, groupIds: [...person.groupIds, groupId] }
  };
}
