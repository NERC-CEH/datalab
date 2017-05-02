import { browserHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';
import promise from 'redux-promise-middleware';

import {
  PROMISE_TYPE_PENDING,
  PROMISE_TYPE_SUCCESS,
  PROMISE_TYPE_FAILURE,
} from '../actions/actionTypes';

const promiseTypeSuffixes = [PROMISE_TYPE_PENDING, PROMISE_TYPE_SUCCESS, PROMISE_TYPE_FAILURE];

export default [routerMiddleware(browserHistory), promise({ promiseTypeSuffixes })];
