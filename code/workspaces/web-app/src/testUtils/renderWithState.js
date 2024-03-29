import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { createPromise } from 'redux-promise-middleware';
import {
  PROMISE_TYPE_PENDING,
  PROMISE_TYPE_SUCCESS,
  PROMISE_TYPE_FAILURE,
} from '../actions/actionTypes';
import { render } from './renderTests';

const promiseTypeSuffixes = [PROMISE_TYPE_PENDING, PROMISE_TYPE_SUCCESS, PROMISE_TYPE_FAILURE];

const TEST_USER = 'test-user';

export const buildDefaultTestState = () => ({
  authentication: {
    identity: {
      sub: TEST_USER,
    },
    permissions: {
      fetching: { inProgress: false },
      value: [],
    },
  },
  projectUsers: {
    fetching: { inProgress: false },
    value: [
      { userId: TEST_USER, role: 'admin' },
    ],
  },
});

export const renderWithState = (
  initialState,
  ComponentToRender,
  props = {},
  renderOptions = {},
) => {
  const mockStore = configureStore([createPromise({ promiseTypeSuffixes })]);
  const store = mockStore(initialState);

  const wrapper = render(
    <Provider store={store}>
      <ComponentToRender {...props} />
    </Provider>,
    renderOptions,
  );

  return {
    wrapper,
    store,
  };
};
