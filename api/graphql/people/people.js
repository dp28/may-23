const { gql } = require("apollo-server-express");
const { addPerson } = require("../../domain/events/people");
const { equal } = require("../../domain/filters/filters");
const { duplicateId } = require("../../domain/errors/validation");

module.exports = {
  addPersonMutation,
  typeDefs: gql`
    type PersonData {
      firstName: String!
      lastName: String!
      middleName: String
    }

    type AddPersonEvent {
      id: ID!
      createdAt: String!
      type: String!
      data: PersonData
    }
  `,
  mutationTypeDefs: `
    addPerson(
      firstName: String!
      lastName: String!
      middleName: String
    ): AddPersonEvent
  `
};

async function addPersonMutation(_, args, { eventRepository }) {
  await ensurePersonIdDoesNotAlreadyExist(args.personId, eventRepository);
  return await eventRepository.store(addPerson(args));
}

async function ensurePersonIdDoesNotAlreadyExist(personId, eventRepository) {
  const numberOfDupes = await eventRepository.count({
    filters: [
      equal(["data", "personId"], personId),
      equal(["type"], "ADD_PERSON")
    ]
  });
  if (numberOfDupes > 0) {
    throw duplicateId({ entityName: "Person", id: personId });
  }
}
