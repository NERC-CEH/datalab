import projectActions, {
  LOAD_PROJECTS_ACTION,
  SET_CURRENT_PROJECT_ACTION,
  CREATE_PROJECT_ACTION,
  DELETE_PROJECT_ACTION,
  CHECK_PROJECT_KEY_UNIQUE_ACTION,
} from './projectActions';
import projectsService from '../api/projectsService';

jest.mock('../api/projectsService');

describe('projectActions', () => {
  beforeEach(() => jest.resetAllMocks());

  describe('calls correct service for', () => {
    it('loadProjects', () => {
      // Arrange
      const loadProjectsMock = jest.fn().mockReturnValue('expectedProjectsPayload');
      projectsService.loadProjects = loadProjectsMock;

      // Act
      const output = projectActions.loadProjects();

      // Assert
      expect(loadProjectsMock).toHaveBeenCalledTimes(1);
      expect(output.type).toBe(LOAD_PROJECTS_ACTION);
      expect(output.payload).toBe('expectedProjectsPayload');
    });

    it('setCurrentProject', () => {
      // Arrange
      const loadProjectInfoMock = jest.fn().mockReturnValue('expectedProjectsPayload');
      projectsService.loadProjectInfo = loadProjectInfoMock;

      // Act
      const output = projectActions.setCurrentProject('project99');

      // Assert
      expect(loadProjectInfoMock).toHaveBeenCalledTimes(1);
      expect(output.type).toBe(SET_CURRENT_PROJECT_ACTION);
      expect(output.payload).toBe('expectedProjectsPayload');
    });

    it('createProject', () => {
      const project = { name: 'project', key: 'project' };
      projectsService.createProject = jest.fn(() => 'expected-payload');

      const output = projectActions.createProject(project);

      expect(projectsService.createProject).toHaveBeenCalledTimes(1);
      expect(projectsService.createProject).toHaveBeenCalledWith(project);
      expect(output.type).toEqual(CREATE_PROJECT_ACTION);
      expect(output.payload).toEqual('expected-payload');
    });

    it('deleteProject', () => {
      const projectKey = 'testproj';
      projectsService.deleteProject = jest.fn(() => 'expected-payload');

      const output = projectActions.deleteProject(projectKey);

      expect(projectsService.deleteProject).toHaveBeenCalledTimes(1);
      expect(projectsService.deleteProject).toHaveBeenCalledWith(projectKey);
      expect(output.type).toEqual(DELETE_PROJECT_ACTION);
      expect(output.payload).toEqual('expected-payload');
    });

    it('checkProjectKeyUniqueness', () => {
      const projectKey = 'projectKey';
      projectsService.checkProjectKeyUniqueness = jest.fn(() => 'expected-payload');

      const output = projectActions.checkProjectKeyUniqueness(projectKey);

      expect(projectsService.checkProjectKeyUniqueness).toHaveBeenCalledTimes(1);
      expect(projectsService.checkProjectKeyUniqueness).toHaveBeenCalledWith(projectKey);
      expect(output.type).toEqual(CHECK_PROJECT_KEY_UNIQUE_ACTION);
      expect(output.payload).toEqual('expected-payload');
    });
  });

  describe('exports correct values for', () => {
    it('LOAD_PROJECTS_ACTION', () => {
      expect(LOAD_PROJECTS_ACTION).toBe('LOAD_PROJECTS');
    });

    it('SET_CURRENT_PROJECT_ACTION', () => {
      expect(SET_CURRENT_PROJECT_ACTION).toBe('SET_CURRENT_PROJECT_ACTION');
    });

    it('CREATE_PROJECT_ACTION', () => {
      expect(CREATE_PROJECT_ACTION).toBe('CREATE_PROJECT_ACTION');
    });

    it('DELETE_PROJECT_ACTION', () => {
      expect(DELETE_PROJECT_ACTION).toBe('DELETE_PROJECT_ACTION');
    });

    it('CHECK_PROJECT_KEY_UNIQUE_ACTION', () => {
      expect(CHECK_PROJECT_KEY_UNIQUE_ACTION).toBe('CHECK_PROJECT_KEY_UNIQUE_ACTION');
    });
  });
});
