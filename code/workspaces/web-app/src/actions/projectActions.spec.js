import projectActions, {
  LOAD_PROJECTS_ACTION,
} from './projectActions';
import projectsService from '../api/projectsService';

jest.mock('../api/projectsService');

const project = {
  id: 'project',
  displayName: 'The project with id "project"',
  description: 'Once upon a time there was only one...',
  type: 'project',
};

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
  });

  describe('exports correct values for', () => {
    it('LOAD_PROJECTS_ACTION', () => {
      expect(LOAD_PROJECTS_ACTION).toBe('LOAD_PROJECTS');
    });
  });
});
