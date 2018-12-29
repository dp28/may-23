const { gql } = require("apollo-server-express");
const { identity } = require("ramda");

module.exports = {
  typeDefs: [
    gql`
      type Query {
        healthcheck: String!
      }

      type Mutation {
        _empty(fake: Int): Int
      }
    `
  ],
  resolvers: {
    Query: { healthcheck: () => "ok" },
    Mutation: {
      _empty: identity
    }
  }
};
