const { COMPARISON_TYPES } = require("../domain/filters/filters");

module.exports = {
  typeDefs: [
    `
    enum ComparisonType {
      ${COMPARISON_TYPES.join("\n")}
    }
    `
  ],
  resolvers: {
    ComparisonType: COMPARISON_TYPES.reduce((map, type) => {
      map[type] = type;
      return map;
    }, {})
  }
};
