const {
  buildRepositories: buildContext
} = require("../persistence/memory/repositories");
const {
  buildRepositories: buildFileSystemBackedContext
} = require("../persistence/file-system/repositories");

module.exports = {
  buildContext,
  buildFileSystemBackedContext
};
