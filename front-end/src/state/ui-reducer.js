import { combineReducers } from 'redux';

export const uiReducer = combineReducers({
  currentTestPlan: (state = {}, _) => state
});
