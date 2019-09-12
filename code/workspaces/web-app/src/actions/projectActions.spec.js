import projectActions, {
  LOAD_PROJECTS_ACTION,
  LOAD_PROJECTINFO_ACTION,
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
      expect(output.type).toBe('LOAD_PROJECTS');
      expect(output.payload).toBe('expectedProjectsPayload');
    });

    it('loadProjectInfo', () => {
      // Arrange
      const loadProjectInfoMock = jest.fn().mockReturnValue('expectedProjectsPayload');
      projectsService.loadProjectInfo = loadProjectInfoMock;

      // Act
      const output = projectActions.loadProjectInfo('project99');

      // Assert
      expect(loadProjectInfoMock).toHaveBeenCalledTimes(1);
      expect(output.type).toBe('LOAD_PROJECTINFO');
      expect(output.payload).toBe('expectedProjectsPayload');
    });
  });

  describe('exports correct values for', () => {
    it('LOAD_PROJECTS_ACTION', () => {
      expect(LOAD_PROJECTS_ACTION).toBe('LOAD_PROJECTS');
    });

    it('LOAD_PROJECTINFO_ACTION', () => {
      expect(LOAD_PROJECTINFO_ACTION).toBe('LOAD_PROJECTINFO');
    });
  });
});
