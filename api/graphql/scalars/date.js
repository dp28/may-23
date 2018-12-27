const { GraphQLScalarType } = require("graphql");
const { Kind } = require("graphql/language");
const { gql } = require("apollo-server-express");

const dateResolver = new GraphQLScalarType({
  name: "Date",
  description: "Date custom scalar type",
  parseValue(value) {
    return new Date(value);
  },
  serialize(value) {
    return value.getTime();
  },
  parseLiteral({ kind, value }) {
    return kind === Kind.INT ? new Date(Number(value)) : null;
  }
});

module.exports = {
  typeDefs: gql`
    scalar Date
  `,
  resolvers: {
    Date: dateResolver
  }
};
