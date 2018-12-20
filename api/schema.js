const { gql } = require("apollo-server-express");
const nameTypes = require("./name/name-types");

const typeDefs = gql`
  ${nameTypes.typeDefs}
  type Person {
    id: ID!
    name: Name!
  }
  type Query {
    people: [Person]
  }
`;

/* Test data */
const people = [
  { id: 1, firstName: "Harry", lastName: "Potter" },
  { id: 2, firstName: "Ron", lastName: "Weasley" },
  { id: 3, firstName: "Hermione", lastName: "Granger" },
  { id: 4, firstName: "Draco", lastName: "Malfoy" }
];

const resolvers = {
  Query: {
    people: () =>
      people.map(post => ({
        ...post,
        name: () => buildName(post)
      }))
  }
};

function buildName({ firstName, lastName }) {
  return {
    first: firstName,
    last: lastName,
    initials: "not done"
  };
}

module.exports = {
  typeDefs,
  resolvers
};
