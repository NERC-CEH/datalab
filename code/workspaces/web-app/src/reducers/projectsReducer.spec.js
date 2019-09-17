import projectsReducer from './projectsReducer';
import { PROMISE_TYPE_PENDING, PROMISE_TYPE_SUCCESS, PROMISE_TYPE_FAILURE } from '../actions/actionTypes';
import { LOAD_PROJECTS_ACTION, LOAD_PROJECTINFO_ACTION } from '../actions/projectActions';

describe('projectsReducer', () => {
  it('should return the initial state', () => {
    // Act/Assert
    expect(projectsReducer(undefined, {})).toEqual({ fetching: false, value: {}, error: null });
  });

  describe('LOAD_PROJECTS', () => {
    it('should handle LOAD_PROJECTS_PENDING', () => {
      // Arrange
      const type = `${LOAD_PROJECTS_ACTION}_${PROMISE_TYPE_PENDING}`;
      const action = { type };

      // Act
      const nextstate = projectsReducer({ error: null, fetching: false, value: {} }, action);

      // Assert
      expect(nextstate).toEqual({ error: null, fetching: true, value: {} });
    });

    it('should handle LOAD_PROJECTS_SUCCESS', () => {
      // Arrange
      const type = `${LOAD_PROJECTS_ACTION}_${PROMISE_TYPE_SUCCESS}`;
      const payload = [{ project: 'firstProject' }, { project: 'secondProject' }];
      const action = { type, payload };

      // Act
      const nextstate = projectsReducer({ error: null, fetching: false, value: {} }, action);

      // Assert
      expect(nextstate).toEqual({ error: null, fetching: false, value: { projectArray: action.payload } });
    });

    it('should handle LOAD_PROJECTS_FAILURE', () => {
      // Arrange
      const type = `${LOAD_PROJECTS_ACTION}_${PROMISE_TYPE_FAILURE}`;
      const payload = 'example error';
      const action = { type, payload };

      // Act
      const nextstate = projectsReducer({ error: null, fetching: false, value: {} }, action);

      // Assert
      expect(nextstate).toEqual({ error: payload, fetching: false, value: {} });
    });
  });

  describe('LOAD_PROJECTINFO', () => {
    it('should handle LOAD_PROJECTINFO_PENDING', () => {
      // Arrange
      const type = `${LOAD_PROJECTINFO_ACTION}_${PROMISE_TYPE_PENDING}`;
      const action = { type };

      // Act
      const nextstate = projectsReducer({ error: null, fetching: false, value: {} }, action);

      // Assert
      expect(nextstate).toEqual({ error: null, fetching: true, value: {} });
    });

    it('should handle LOAD_PROJECTINFO_SUCCESS', () => {
      // Arrange
      const type = `${LOAD_PROJECTINFO_ACTION}_${PROMISE_TYPE_SUCCESS}`;
      const payload = { project: 'secondProject' };
      const action = { type, payload };

      // Act
      const nextstate = projectsReducer({ error: null, fetching: false, value: {} }, action);

      // Assert
      expect(nextstate).toEqual({ error: null, fetching: false, value: { currentProject: action.payload } });
    });

    it('should handle LOAD_PROJECTINFOFAILURE', () => {
      // Arrange
      const type = `${LOAD_PROJECTINFO_ACTION}_${PROMISE_TYPE_FAILURE}`;
      const payload = 'example error';
      const action = { type, payload };

      // Act
      const nextstate = projectsReducer({ error: null, fetching: false, value: {} }, action);

      // Assert
      expect(nextstate).toEqual({ error: payload, fetching: false, value: {} });
    });
  });
});
