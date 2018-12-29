const { gql } = require("apollo-server-express");
const { identity } = require("ramda");

module.exports = {
  typeDefs: [
    gql`
      type Query {
        healthcheck: String!
      }
    `
  ],
  resolvers: {
    Query: { healthcheck: () => "ok" }
  }
};
