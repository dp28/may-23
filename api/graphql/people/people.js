const { gql } = require("apollo-server-express");
const { addPerson } = require("../../domain/events/people");

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

async function addPersonMutation(_, args, context) {
  return await context.eventRepository.store(addPerson(args));
}
