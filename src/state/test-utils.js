export const onInit = (reducer, runTests) => {
  describe('without any state', () => {
    runTests(getInitialState(reducer));
  });
}

export function getInitialState(reducer) {
  return reducer(undefined, { type: 'INIT' });
}

export function reduceFromInitialState(reducer, ...actions) {
  return actions.reduce(reducer, getInitialState(reducer));
}
