const { ApolloServer } = require("apollo-server-express");
const { mergeTypes } = require("./utils");
const { buildFileSystemBackedContext } = require("./context");

const { typeDefs, resolvers } = mergeTypes([
  require("./root"),
  require("./scalars"),
  require("./comparisonType"),
  require("./events"),
  require("./people"),
  require("./groups")
]);

module.exports = {
  buildGraphqlServer: () =>
    new ApolloServer({
      typeDefs,
      resolvers,
      context: buildFileSystemBackedContext()
    })
};
