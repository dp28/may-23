const { gql } = require("apollo-server-express");
const { pascalCase } = require("change-case");

const types = require("../domain/events/types");
const { validateEvent } = require("../domain/events/validation/validator");

const typeMap = Object.values(types)
  .map(type => `${type}: ${pascalCase(type)}EventInput`)
  .join("\n");

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
      ${typeMap}
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
        await context.eventsRepository.find({ filters })
    },
    Mutation: {
      recordEvent: async (object, { event }, context) => {
        const events = Object.values(event);
        await Promise.all(events.map(event => validateEvent(event, context)));
        return await Promise.all(events.map(context.eventsRepository.store));
      }
    }
  }
};
