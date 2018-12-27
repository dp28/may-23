const { mergeTypes } = require("./utils");

module.exports = mergeTypes([
  require("./root"),
  require("./people/people"),
  require("./scalars")
]);
