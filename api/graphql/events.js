const { gql } = require("apollo-server-express");
const { pascalCase } = require("change-case");

module.exports = {
  typeDefs: gql`
    interface Event {
      id: ID!
      createdAt: Date!
      type: String!
    }

    input Filter {
      value: String!
      propertyPath: [String!]!
      comparisonType: ComparisonType!
    }

    extend type Query {
      events(filters: [Filter!]): [Event!]!
    }
  `,
  resolvers: {
    Event: {
      __resolveType: event => pascalCase(event.type) + "Event"
    },
    Query: {
      events: async (object, { filters }, context) =>
        await context.eventRepository.find({ filters })
    }
  }
};
