import projectSettingsReducer from './projectSettingsReducers';
import { PROMISE_TYPE_PENDING, PROMISE_TYPE_SUCCESS, PROMISE_TYPE_FAILURE } from '../actions/actionTypes';
import { GET_PROJECT_USER_PERMISSIONS_ACTION } from '../actions/projectSettingsActions';

describe('projectSettingsReducer', () => {
  it('should return the initial state', () => {
    expect(projectSettingsReducer(undefined, {})).toEqual({
      fetching: false,
      value: [],
      error: null,
    });
  });

  it('should handle GET_PROJECT_USER_PERMISSIONS_ACTION_PENDING', () => {
    const type = `${GET_PROJECT_USER_PERMISSIONS_ACTION}_${PROMISE_TYPE_PENDING}`;
    const action = { type };

    const nextState = projectSettingsReducer({ error: null, fetching: false, value: [] }, action);

    expect(nextState).toEqual({ error: null, fetching: true, value: [] });
  });

  it('should handle GET_PROJECT_USER_PERMISSIONS_ACTION_SUCCESS', () => {
    const type = `${GET_PROJECT_USER_PERMISSIONS_ACTION}_${PROMISE_TYPE_SUCCESS}`;
    const payload = [{ name: 'user1', role: 'admin' }, { name: 'user2', role: 'user' }];
    const action = { type, payload };

    const nextState = projectSettingsReducer({ error: null, fetching: false, value: [] }, action);

    expect(nextState).toEqual({ error: null, fetching: false, value: payload });
  });

  it('should handle GET_PROJECT_USER_PERMISSIONS_ACTION_FAILURE', () => {
    const type = `${GET_PROJECT_USER_PERMISSIONS_ACTION}_${PROMISE_TYPE_FAILURE}`;
    const payload = new Error();
    const action = { type, payload };

    const nextState = projectSettingsReducer({ error: null, fetching: false, value: [] }, action);

    expect(nextState).toEqual({ error: true, fetching: false, value: payload });
  });
});
