const express = require("express");

const { buildGraphqlServer } = require("./graphql");

const server = buildGraphqlServer();

const app = express();
server.applyMiddleware({ app });

const port = 4000;

app.listen({ port }, () =>
  console.log(`Server ready at http://localhost:${port}${server.graphqlPath}`)
);
