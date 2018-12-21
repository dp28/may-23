const { gql } = require("apollo-server-express");
const people = require("./people/people");
const typeDefs = gql`
  ${people.typeDefs}

  type Query {
    healthcheck: String!
  }
  type Mutation {
    ${people.mutationTypeDefs}
  }
`;

const resolvers = {
  Query: { healthcheck: () => "ok" },
  Mutation: {
    addPerson: people.addPersonMutation
  }
};

module.exports = {
  typeDefs,
  resolvers
};
