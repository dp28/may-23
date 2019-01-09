const { gql } = require("apollo-server-express");

module.exports = {
  typeDefs: [
    gql`
      type AddPersonEvent implements Event {
        id: ID!
        createdAt: Date!
        type: String!
        data: PersonData
      }

      type PersonData {
        personId: ID!
        firstName: String!
        lastName: String!
        middleName: String
      }

      input AddPersonEventInput {
        id: ID!
        createdAt: Date!
        type: String!
        data: AddPersonInput
      }

      input AddPersonInput {
        personId: ID!
        firstName: String!
        lastName: String!
        middleName: String
      }

      type Name {
        first: String!
        middle: String
        last: String!
        initials: String!
        full: String!
      }

      type Person {
        id: ID!
        name: Name!
      }

      extend type Query {
        people(filters: [Filter!]): [Person!]!
      }
    `
  ],
  resolvers: {
    Query: {
      people: async (object, { filters }, context) =>
        await context.peopleRepository.find({ filters })
    }
  }
};
