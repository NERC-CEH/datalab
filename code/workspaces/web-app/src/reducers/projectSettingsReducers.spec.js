import projectSettingsReducer from './projectSettingsReducers';
import { PROMISE_TYPE_PENDING, PROMISE_TYPE_SUCCESS, PROMISE_TYPE_FAILURE } from '../actions/actionTypes';
import {
  GET_PROJECT_USER_PERMISSIONS_ACTION,
  ADD_PROJECT_USER_PERMISSION_ACTION,
} from '../actions/projectSettingsActions';

describe('projectSettingsReducer', () => {
  const initialState = {
    fetching: {
      inProgress: false,
      error: false,
    },
    updating: {
      inProgress: false,
      error: false,
    },
    value: [],
  };

  it('should return the initial state', () => {
    expect(projectSettingsReducer(undefined, {})).toEqual(initialState);
  });

  describe('should handle GET_PROJECT_USER_PERMISSIONS_ACTION when it', () => {
    it('is PENDING', () => {
      const type = `${GET_PROJECT_USER_PERMISSIONS_ACTION}_${PROMISE_TYPE_PENDING}`;
      const action = { type };

      const nextState = projectSettingsReducer(initialState, action);
      expect(nextState).toEqual({
        ...initialState, fetching: { ...initialState.fetching, inProgress: true },
      });
    });

    it('is SUCCESS', () => {
      const type = `${GET_PROJECT_USER_PERMISSIONS_ACTION}_${PROMISE_TYPE_SUCCESS}`;
      const payload = [{ name: 'user1', role: 'admin' }, { name: 'user2', role: 'user' }];
      const action = { type, payload };

      const nextState = projectSettingsReducer(initialState, action);

      expect(nextState).toEqual({ ...initialState, value: payload });
    });

    it('is FAILURE', () => {
      const type = `${GET_PROJECT_USER_PERMISSIONS_ACTION}_${PROMISE_TYPE_FAILURE}`;
      const payload = new Error();
      const action = { type, payload };

      const nextState = projectSettingsReducer(initialState, action);

      expect(nextState).toEqual({
        ...initialState,
        fetching: { ...initialState.fetching, error: true },
        value: new Error(),
      });
    });
  });

  describe('should handle ADD_PROJECT_USER_PERMISSION_ACTION when it', () => {
    it('is PENDING', () => {
      const type = `${ADD_PROJECT_USER_PERMISSION_ACTION}_${PROMISE_TYPE_PENDING}`;
      const action = { type };

      const nextState = projectSettingsReducer(initialState, action);
      expect(nextState).toEqual({
        ...initialState, updating: { ...initialState.updating, inProgress: true },
      });
    });

    it('is FAILURE', () => {
      const type = `${ADD_PROJECT_USER_PERMISSION_ACTION}_${PROMISE_TYPE_FAILURE}`;
      const payload = new Error();
      const action = { type, payload };

      const nextState = projectSettingsReducer(initialState, action);

      expect(nextState).toEqual({
        ...initialState,
        updating: { ...initialState.updating, error: true },
      });
    });

    describe('is SUCCESS', () => {
      it('adds user to array of users if they do not already exist', () => {
        const type = `${ADD_PROJECT_USER_PERMISSION_ACTION}_${PROMISE_TYPE_SUCCESS}`;
        const payload = {
          user: { name: 'user1', userId: 'user1-ID' },
          role: 'admin',
          project: 'project',
        };
        const action = { type, payload };

        const nextState = projectSettingsReducer(initialState, action);

        expect(nextState).toEqual({
          ...initialState,
          value: [{ ...payload.user, role: payload.role }],
        });
      });

      it('replaces user permissions in array if user already exist', () => {
        const type = `${ADD_PROJECT_USER_PERMISSION_ACTION}_${PROMISE_TYPE_SUCCESS}`;
        const payload = {
          user: { name: 'user1', userId: 'user1-ID' },
          role: 'admin',
          project: 'project',
        };
        const action = { type, payload };

        const prevState = {
          ...initialState,
          value: [{ name: 'user1', userId: 'user1-ID', role: 'viewer' }],
        };

        const nextState = projectSettingsReducer(prevState, action);

        expect(nextState).toEqual({
          ...initialState,
          value: [{ ...payload.user, role: payload.role }],
        });
      });
    });
  });
});
