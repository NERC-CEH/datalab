import projectsReducer from './projectsReducer';
import { PROMISE_TYPE_PENDING, PROMISE_TYPE_SUCCESS, PROMISE_TYPE_FAILURE } from '../actions/actionTypes';
import { LOAD_PROJECTS_ACTION, GET_ALL_PROJECTS_AND_RESOURCES_ACTION } from '../actions/projectActions';

describe('projectsReducer', () => {
  it('should return the initial state', () => {
    // Act/Assert
    expect(projectsReducer(undefined, {})).toEqual({
      fetching: false,
      value: [],
      error: null,
    });
  });

  describe('LOAD_PROJECTS', () => {
    it('should handle LOAD_PROJECTS_PENDING', () => {
      // Arrange
      const type = `${LOAD_PROJECTS_ACTION}_${PROMISE_TYPE_PENDING}`;
      const action = { type };

      // Act
      const nextstate = projectsReducer({ error: null, fetching: false, value: [] }, action);

      // Assert
      expect(nextstate).toEqual({ error: null, fetching: true, value: [] });
    });

    it('should handle LOAD_PROJECTS_SUCCESS', () => {
      // Arrange
      const type = `${LOAD_PROJECTS_ACTION}_${PROMISE_TYPE_SUCCESS}`;
      const payload = [{ project: 'firstProject' }, { project: 'secondProject' }];
      const action = { type, payload };

      // Act
      const nextstate = projectsReducer({ error: null, fetching: false, value: [] }, action);

      // Assert
      expect(nextstate).toEqual({ error: null, fetching: false, value: action.payload });
    });

    it('should handle LOAD_PROJECTS_FAILURE', () => {
      // Arrange
      const type = `${LOAD_PROJECTS_ACTION}_${PROMISE_TYPE_FAILURE}`;
      const payload = 'example error';
      const action = { type, payload };

      // Act
      const nextstate = projectsReducer({ error: null, fetching: false, value: [] }, action);

      // Assert
      expect(nextstate).toEqual({ error: payload, fetching: false, value: [] });
    });
  });

  describe('GET_ALL_PROJECTS_AND_RESOURCES_ACTION', () => {
    it('should handle GET_ALL_PROJECTS_AND_RESOURCES_ACTION_PENDING', () => {
      // Arrange
      const type = `${GET_ALL_PROJECTS_AND_RESOURCES_ACTION}_${PROMISE_TYPE_PENDING}`;
      const action = { type };

      // Act
      const nextstate = projectsReducer({ error: null, fetching: false, value: [] }, action);

      // Assert
      expect(nextstate).toEqual({ error: null, fetching: true, value: [] });
    });

    it('should handle GET_ALL_PROJECTS_AND_RESOURCES_ACTION_SUCCESS', () => {
      // Arrange
      const type = `${GET_ALL_PROJECTS_AND_RESOURCES_ACTION}_${PROMISE_TYPE_SUCCESS}`;
      const projects = [{ project: 'firstProject' }, { project: 'secondProject' }];
      const action = { type, payload: { projects } };

      // Act
      const nextstate = projectsReducer({ error: null, fetching: false, value: [] }, action);

      // Assert
      expect(nextstate).toEqual({ error: null, fetching: false, value: projects });
    });

    it('should handle GET_ALL_PROJECTS_AND_RESOURCES_ACTION_FAILURE', () => {
      // Arrange
      const type = `${GET_ALL_PROJECTS_AND_RESOURCES_ACTION}_${PROMISE_TYPE_FAILURE}`;
      const payload = 'example error';
      const action = { type, payload };

      // Act
      const nextstate = projectsReducer({ error: null, fetching: false, value: [] }, action);

      // Assert
      expect(nextstate).toEqual({ error: payload, fetching: false, value: [] });
    });
  });
});
