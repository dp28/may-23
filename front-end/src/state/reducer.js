import { combineReducersByStrippingSuffix } from './utils';
import { uiReducer } from './ui-reducer';

const domainReducer = combineReducersByStrippingSuffix({
  example: (state = {}, _) => state
});

export const reducer = combineReducersByStrippingSuffix({
  uiReducer,
  domainReducer
});
