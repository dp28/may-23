const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const path = require("path");

const {
  buildEventRepository
} = require("./persistence/file-system/events/events-repository");
const {
  buildEventBackedRepository
} = require("./persistence/memory/event-backed-repository");
const { typeDefs, resolvers } = require("./graphql");

const dataDirectory = path.join(__dirname, "/local-data/");
const eventRepository = buildEventRepository(dataDirectory);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: {
    eventRepository,
    buildEventBackedRepository: buildEventBackedRepository(eventRepository)
  }
});

const app = express();
server.applyMiddleware({ app });

const port = 4000;

app.listen({ port }, () =>
  console.log(`Server ready at http://localhost:${port}${server.graphqlPath}`)
);
