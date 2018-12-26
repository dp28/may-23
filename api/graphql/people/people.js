const { gql } = require("apollo-server-express");
const { addPerson } = require("../../domain/events/people");
const { equal } = require("../../domain/filters/filters");
const { duplicateId } = require("../../domain/errors/validation");

module.exports = {
  addPersonMutation,
  typeDefs: gql`
    input AddPersonInput {
      personId: ID!
      firstName: String!
      lastName: String!
      middleName: String
    }

    type PersonData {
      personId: ID!
      firstName: String!
      lastName: String!
      middleName: String
    }

    type AddPersonEvent {
      id: ID!
      createdAt: Date!
      type: String!
      data: PersonData
    }
  `,
  mutationTypeDefs: `
    addPerson(input: AddPersonInput!): AddPersonEvent
  `
};

async function addPersonMutation(_, { input }, { eventRepository }) {
  await ensurePersonIdDoesNotAlreadyExist(input.personId, eventRepository);
  return await eventRepository.store(addPerson(input));
}

async function ensurePersonIdDoesNotAlreadyExist(id, eventRepository) {
  const numberOfDupes = await eventRepository.count({
    filters: [equal(["data", "personId"], id), equal(["type"], "ADD_PERSON")]
  });
  if (numberOfDupes > 0) {
    throw duplicateId({ entityName: "Person", id });
  }
}
