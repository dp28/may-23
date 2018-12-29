const { mergeDeepRight } = require("ramda");

module.exports = { mergeTypes };

function mergeTypes(types) {
  return types.reduce((result, type) => ({
    typeDefs: result.typeDefs.concat(type.typeDefs),
    resolvers: mergeDeepRight(result.resolvers, type.resolvers)
  }));
}
