import { combineReducers } from 'redux';

export const combineReducersByStrippingSuffix = (reducersByName) => (
  combineReducers(removeReducerSuffix(reducersByName))
);

function removeReducerSuffix(reducersByName) {
  return Object.entries(reducersByName).reduce((result, [name, reducer]) => {
    result[name.replace(/Reducer$/, '')] = reducer;
    return result;
  }, {});
}
