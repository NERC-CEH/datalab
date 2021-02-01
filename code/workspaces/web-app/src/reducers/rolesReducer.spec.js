import { permissionTypes } from 'common';
import rolesReducer, { setSystemRole } from './rolesReducer';
import { PROMISE_TYPE_PENDING, PROMISE_TYPE_SUCCESS, PROMISE_TYPE_FAILURE } from '../actions/actionTypes';
import { GET_ALL_USERS_AND_ROLES_ACTION, SET_INSTANCE_ADMIN_ACTION, SET_DATA_MANAGER_ACTION, SET_CATALOGUE_ROLE_ACTION } from '../actions/roleActions';

const { INSTANCE_ADMIN_ROLE_KEY } = permissionTypes;

describe('rolesReducer', () => {
  it('should return the initial state', () => {
    // Act/Assert
    expect(rolesReducer(undefined, {})).toEqual({
      fetching: false,
      updating: false,
      value: [],
      error: null,
    });
  });

  describe('GET_ALL_USERS_AND_ROLES_ACTION', () => {
    it('should handle GET_ALL_USERS_AND_ROLES_ACTION_PENDING', () => {
      // Arrange
      const type = `${GET_ALL_USERS_AND_ROLES_ACTION}_${PROMISE_TYPE_PENDING}`;
      const action = { type };

      // Act
      const nextState = rolesReducer({ error: null, fetching: false, updating: false, value: [] }, action);

      // Assert
      expect(nextState).toEqual({ error: null, fetching: true, updating: false, value: [] });
    });

    it('should handle GET_ALL_USERS_AND_ROLES_ACTION_SUCCESS', () => {
      // Arrange
      const type = `${GET_ALL_USERS_AND_ROLES_ACTION}_${PROMISE_TYPE_SUCCESS}`;
      const payload = ['payload'];
      const action = { type, payload };

      // Act
      const nextState = rolesReducer({ error: null, fetching: true, updating: false, value: [] }, action);

      // Assert
      expect(nextState).toEqual({ error: null, fetching: false, updating: false, value: action.payload });
    });

    it('should handle GET_ALL_USERS_AND_ROLES_ACTION_FAILURE', () => {
      // Arrange
      const type = `${GET_ALL_USERS_AND_ROLES_ACTION}_${PROMISE_TYPE_FAILURE}`;
      const payload = 'example error';
      const action = { type, payload };

      // Act
      const nextState = rolesReducer({ error: null, fetching: true, updating: false, value: [] }, action);

      // Assert
      expect(nextState).toEqual({ error: payload, fetching: false, updating: false, value: [] });
    });
  });

  describe('SET_INSTANCE_ADMIN_ACTION', () => {
    it('should handle SET_INSTANCE_ADMIN_ACTION_PENDING', () => {
      // Arrange
      const type = `${SET_INSTANCE_ADMIN_ACTION}_${PROMISE_TYPE_PENDING}`;
      const action = { type };

      // Act
      const nextState = rolesReducer({ error: null, fetching: false, updating: false, value: [] }, action);

      // Assert
      expect(nextState).toEqual({ error: null, fetching: false, updating: true, value: [] });
    });

    it('should handle SET_INSTANCE_ADMIN_ACTION_SUCCESS', () => {
      // Arrange
      const type = `${SET_INSTANCE_ADMIN_ACTION}_${PROMISE_TYPE_SUCCESS}`;
      const payload = { userId: 'user1', instanceAdmin: true };
      const action = { type, payload };

      // Act
      const nextState = rolesReducer({ error: null, fetching: false, updating: true, value: [] }, action);

      // Assert
      expect(nextState).toEqual({ error: null, fetching: false, updating: false, value: [action.payload] });
    });

    it('should handle SET_INSTANCE_ADMIN_ACTION_FAILURE', () => {
      // Arrange
      const type = `${SET_INSTANCE_ADMIN_ACTION}_${PROMISE_TYPE_FAILURE}`;
      const payload = 'example error';
      const action = { type, payload };

      // Act
      const nextState = rolesReducer({ error: null, fetching: false, updating: true, value: [] }, action);

      // Assert
      expect(nextState).toEqual({ error: payload, fetching: false, updating: false, value: [] });
    });
  });

  describe('SET_DATA_MANAGER_ACTION', () => {
    it('should handle SET_DATA_MANAGER_ACTION_PENDING', () => {
      // Arrange
      const type = `${SET_DATA_MANAGER_ACTION}_${PROMISE_TYPE_PENDING}`;
      const action = { type };

      // Act
      const nextState = rolesReducer({ error: null, fetching: false, updating: false, value: [] }, action);

      // Assert
      expect(nextState).toEqual({ error: null, fetching: false, updating: true, value: [] });
    });

    it('should handle SET_DATA_MANAGER_ACTION_SUCCESS', () => {
      // Arrange
      const type = `${SET_DATA_MANAGER_ACTION}_${PROMISE_TYPE_SUCCESS}`;
      const payload = { userId: 'user1', dataManager: true };
      const action = { type, payload };

      // Act
      const nextState = rolesReducer({ error: null, fetching: false, updating: true, value: [] }, action);

      // Assert
      expect(nextState).toEqual({ error: null, fetching: false, updating: false, value: [action.payload] });
    });

    it('should handle SET_DATA_MANAGER_ACTION_FAILURE', () => {
      // Arrange
      const type = `${SET_DATA_MANAGER_ACTION}_${PROMISE_TYPE_FAILURE}`;
      const payload = 'example error';
      const action = { type, payload };

      // Act
      const nextState = rolesReducer({ error: null, fetching: false, updating: true, value: [] }, action);

      // Assert
      expect(nextState).toEqual({ error: payload, fetching: false, updating: false, value: [] });
    });
  });

  describe('SET_CATALOGUE_ROLE_ACTION', () => {
    it('should handle SET_CATALOGUE_ROLE_ACTION_PENDING', () => {
      // Arrange
      const type = `${SET_CATALOGUE_ROLE_ACTION}_${PROMISE_TYPE_PENDING}`;
      const action = { type };

      // Act
      const nextState = rolesReducer({ error: null, fetching: false, updating: false, value: [] }, action);

      // Assert
      expect(nextState).toEqual({ error: null, fetching: false, updating: true, value: [] });
    });

    it('should handle SET_CATALOGUE_ROLE_ACTION_SUCCESS', () => {
      // Arrange
      const type = `${SET_CATALOGUE_ROLE_ACTION}_${PROMISE_TYPE_SUCCESS}`;
      const payload = { userId: 'user1', catalogueRole: 'publisher' };
      const action = { type, payload };

      // Act
      const nextState = rolesReducer({ error: null, fetching: false, updating: true, value: [] }, action);

      // Assert
      expect(nextState).toEqual({ error: null, fetching: false, updating: false, value: [action.payload] });
    });

    it('should handle SET_CATALOGUE_ROLE_ACTION_FAILURE', () => {
      // Arrange
      const type = `${SET_CATALOGUE_ROLE_ACTION}_${PROMISE_TYPE_FAILURE}`;
      const payload = 'example error';
      const action = { type, payload };

      // Act
      const nextState = rolesReducer({ error: null, fetching: false, updating: true, value: [] }, action);

      // Assert
      expect(nextState).toEqual({ error: payload, fetching: false, updating: false, value: [] });
    });
  });

  describe('setSystemRole', () => {
    it('updates existing user', () => {
      // Arrange
      const value = [{ userId: 'user1', instanceAdmin: 'false', catalogueRole: 'publisher' }];
      const payload = { userId: 'user1', instanceAdmin: 'true' };

      // Act
      const newValue = setSystemRole(value, INSTANCE_ADMIN_ROLE_KEY, payload);

      // Assert
      expect(newValue).toEqual([{ userId: 'user1', instanceAdmin: 'true', catalogueRole: 'publisher' }]);
    });
  });
});
