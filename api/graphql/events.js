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

    input EventInputMap {
      ADD_PERSON: AddPersonEventInput
    }

    extend type Query {
      events(filters: [Filter!]): [Event!]!
    }

    type Mutation {
      recordEvent(event: EventInputMap): Query
    }
  `,
  resolvers: {
    Event: {
      __resolveType: event => pascalCase(event.type) + "Event"
    },
    Query: {
      events: async (object, { filters }, context) =>
        await context.eventRepository.find({ filters })
    },
    Mutation: {
      recordEvent: async (object, { event }, context) =>
        await Promise.all(
          Object.values(event).map(context.eventRepository.store)
        )
    }
  }
};
