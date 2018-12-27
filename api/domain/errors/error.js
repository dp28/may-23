const { UNKNOWN_ERROR } = require("./codes");

module.exports = {
  buildError
};

function buildError({ message, code, ...properties }) {
  const error = new Error(message);
  error.message = message || "An unknown error occurred";
  error.code = code || UNKNOWN_ERROR;
  return Object.assign(error, properties);
}
