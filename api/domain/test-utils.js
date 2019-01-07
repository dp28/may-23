module.exports = {
  onInit,
  getInitialState,
  reduceFromInitialState
};

function onInit(reducer, runTests) {
  return describe("without any state", () => {
    runTests(getInitialState(reducer));
  });
}

function getInitialState(reducer) {
  return reducer(undefined, { type: "INIT" });
}

function reduceFromInitialState(reducer, ...actions) {
  return actions.reduce(reducer, getInitialState(reducer));
}
