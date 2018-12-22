const { gql } = require("apollo-server-express");
const people = require("./people/people");
const scalars = require("./scalars");
const typeDefs = gql`
  ${scalars.typeDefs}
  ${people.typeDefs}

  type Query {
    healthcheck: String!
  }
  type Mutation {
    ${people.mutationTypeDefs}
  }
`;

const resolvers = {
  ...scalars.resolverMap,
  Query: { healthcheck: () => "ok" },
  Mutation: {
    addPerson: people.addPersonMutation
  }
};

module.exports = {
  typeDefs,
  resolvers
};
