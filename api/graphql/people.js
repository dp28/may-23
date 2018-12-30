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
    `
  ],
  resolvers: {}
};
