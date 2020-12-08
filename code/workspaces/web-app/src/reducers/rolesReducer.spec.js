import rolesReducer, { updateInstanceAdmin, updateCatalogueRole } from './rolesReducer';
import { PROMISE_TYPE_PENDING, PROMISE_TYPE_SUCCESS, PROMISE_TYPE_FAILURE } from '../actions/actionTypes';
import { GET_ALL_USERS_AND_ROLES_ACTION, SET_INSTANCE_ADMIN_ACTION, SET_CATALOGUE_ROLE_ACTION } from '../actions/roleActions';

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
      const nextstate = rolesReducer({ error: null, fetching: false, updating: false, value: [] }, action);

      // Assert
      expect(nextstate).toEqual({ error: null, fetching: true, updating: false, value: [] });
    });

    it('should handle GET_ALL_USERS_AND_ROLES_ACTION_SUCCESS', () => {
      // Arrange
      const type = `${GET_ALL_USERS_AND_ROLES_ACTION}_${PROMISE_TYPE_SUCCESS}`;
      const payload = ['payload'];
      const action = { type, payload };

      // Act
      const nextstate = rolesReducer({ error: null, fetching: true, updating: false, value: [] }, action);

      // Assert
      expect(nextstate).toEqual({ error: null, fetching: false, updating: false, value: action.payload });
    });

    it('should handle GET_ALL_USERS_AND_ROLES_ACTION_FAILURE', () => {
      // Arrange
      const type = `${GET_ALL_USERS_AND_ROLES_ACTION}_${PROMISE_TYPE_FAILURE}`;
      const payload = 'example error';
      const action = { type, payload };

      // Act
      const nextstate = rolesReducer({ error: null, fetching: true, updating: false, value: [] }, action);

      // Assert
      expect(nextstate).toEqual({ error: payload, fetching: false, updating: false, value: [] });
    });
  });

  describe('SET_INSTANCE_ADMIN_ACTION', () => {
    it('should handle SET_INSTANCE_ADMIN_ACTION_PENDING', () => {
      // Arrange
      const type = `${SET_INSTANCE_ADMIN_ACTION}_${PROMISE_TYPE_PENDING}`;
      const action = { type };

      // Act
      const nextstate = rolesReducer({ error: null, fetching: false, updating: false, value: [] }, action);

      // Assert
      expect(nextstate).toEqual({ error: null, fetching: false, updating: true, value: [] });
    });

    it('should handle SET_INSTANCE_ADMIN_ACTION_SUCCESS', () => {
      // Arrange
      const type = `${SET_INSTANCE_ADMIN_ACTION}_${PROMISE_TYPE_SUCCESS}`;
      const payload = { userId: 'user1', instanceAdmin: true };
      const action = { type, payload };

      // Act
      const nextstate = rolesReducer({ error: null, fetching: false, updating: true, value: [] }, action);

      // Assert
      expect(nextstate).toEqual({ error: null, fetching: false, updating: false, value: [action.payload] });
    });

    it('should handle SET_INSTANCE_ADMIN_ACTION_FAILURE', () => {
      // Arrange
      const type = `${SET_INSTANCE_ADMIN_ACTION}_${PROMISE_TYPE_FAILURE}`;
      const payload = 'example error';
      const action = { type, payload };

      // Act
      const nextstate = rolesReducer({ error: null, fetching: false, updating: true, value: [] }, action);

      // Assert
      expect(nextstate).toEqual({ error: payload, fetching: false, updating: false, value: [] });
    });
  });

  describe('SET_CATALOGUE_ROLE_ACTION', () => {
    it('should handle SET_CATALOGUE_ROLE_ACTION_PENDING', () => {
      // Arrange
      const type = `${SET_CATALOGUE_ROLE_ACTION}_${PROMISE_TYPE_PENDING}`;
      const action = { type };

      // Act
      const nextstate = rolesReducer({ error: null, fetching: false, updating: false, value: [] }, action);

      // Assert
      expect(nextstate).toEqual({ error: null, fetching: false, updating: true, value: [] });
    });

    it('should handle SET_CATALOGUE_ROLE_ACTION_SUCCESS', () => {
      // Arrange
      const type = `${SET_CATALOGUE_ROLE_ACTION}_${PROMISE_TYPE_SUCCESS}`;
      const payload = { userId: 'user1', catalogueRole: 'publisher' };
      const action = { type, payload };

      // Act
      const nextstate = rolesReducer({ error: null, fetching: false, updating: true, value: [] }, action);

      // Assert
      expect(nextstate).toEqual({ error: null, fetching: false, updating: false, value: [action.payload] });
    });

    it('should handle SET_CATALOGUE_ROLE_ACTION_FAILURE', () => {
      // Arrange
      const type = `${SET_CATALOGUE_ROLE_ACTION}_${PROMISE_TYPE_FAILURE}`;
      const payload = 'example error';
      const action = { type, payload };

      // Act
      const nextstate = rolesReducer({ error: null, fetching: false, updating: true, value: [] }, action);

      // Assert
      expect(nextstate).toEqual({ error: payload, fetching: false, updating: false, value: [] });
    });
  });

  describe('updateInstanceAdmin', () => {
    it('updates existing user', () => {
      // Arrange
      const value = [{ userId: 'user1', instanceAdmin: 'false', catalogueRole: 'publisher' }];
      const payload = { userId: 'user1', instanceAdmin: 'true' };

      // Act
      const newValue = updateInstanceAdmin(value, payload);

      // Assert
      expect(newValue).toEqual([{ userId: 'user1', instanceAdmin: 'true', catalogueRole: 'publisher' }]);
    });
  });

  describe('updateCatalogueRole', () => {
    it('updates existing user', () => {
      // Arrange
      const value = [{ userId: 'user1', instanceAdmin: 'false', catalogueRole: 'publisher' }];
      const payload = { userId: 'user1', catalogueRole: 'editor' };

      // Act
      const newValue = updateCatalogueRole(value, payload);

      // Assert
      expect(newValue).toEqual([{ userId: 'user1', instanceAdmin: 'false', catalogueRole: 'editor' }]);
    });
  });
});
