const typeDefs = `
  type Person {
    id: ID!
    firstName: String!
    lastName: String!
    name: String!
  }
  type Query {
    people: [Person]
  }
`;

/* Test data */
const people = [
  { id: 1, firstName: 'Harry', lastName: 'Potter' },
  { id: 2, firstName: 'Ron', lastName: 'Weasley' },
  { id: 3, firstName: 'Hermione', lastName: 'Granger' },
  { id: 4, firstName: 'Draco', lastName: 'Malfoy' },
];

const resolvers = {
  Query: {
    people: () => people.map(post => ({ ...post, name: `${post.firstName} ${post.lastName}` })),
  },
};

module.exports = {
  typeDefs,
  resolvers,
};
