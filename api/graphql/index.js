const { mergeTypes } = require("./utils");

module.exports = mergeTypes([
  require("./root"),
  require("./scalars"),
  require("./comparisonType"),
  require("./events"),
  require("./people")
]);
