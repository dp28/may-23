import {
  REQUEST_LOG_IN,
  requestLogIn
} from './log-in-actions';
import { itShouldBehaveLikeAnActionCreator } from './test-utils';

describe(requestLogIn, () => {
  itShouldBehaveLikeAnActionCreator({
    actionCreator: requestLogIn, type: REQUEST_LOG_IN
  });

  it(`should have the passed-in email property`, () => {
    expect(requestLogIn('a@b.com').data.email).toEqual('a@b.com');
  });
});
