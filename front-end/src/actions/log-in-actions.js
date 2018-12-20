import { buildAction } from './build-action';

export const REQUEST_LOG_IN = 'REQUEST_LOG_IN';

export const requestLogIn = email => buildAction(REQUEST_LOG_IN, { email });
