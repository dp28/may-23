const { mergeDeepRight } = require("ramda");

module.exports = { mergeTypes };

function mergeTypes(types) {
  console.log(types.map(_ => _.typeDefs.toString()));

  return types.reduce((result, type) => ({
    typeDefs: result.typeDefs.concat(type.typeDefs),
    resolvers: mergeDeepRight(result.resolvers, type.resolvers)
  }));
}
