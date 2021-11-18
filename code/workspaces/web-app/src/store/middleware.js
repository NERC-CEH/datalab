import { routerMiddleware } from 'connected-react-router';
import { createPromise } from 'redux-promise-middleware';
import browserHistory from './browserHistory';

import {
  PROMISE_TYPE_PENDING,
  PROMISE_TYPE_SUCCESS,
  PROMISE_TYPE_FAILURE,
} from '../actions/actionTypes';

const promiseTypeSuffixes = [PROMISE_TYPE_PENDING, PROMISE_TYPE_SUCCESS, PROMISE_TYPE_FAILURE];

const middleware = [routerMiddleware(browserHistory), createPromise({ promiseTypeSuffixes })];
export default middleware;
