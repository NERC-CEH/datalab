import mockClient from './graphqlClient';
import projectsService from './projectsService';

jest.mock('./graphqlClient');

describe('projectsService', () => {
  beforeEach(() => mockClient.clearResult());

  describe('loadProjects', () => {
    it('should build the correct query and unpack the results', () => {
      mockClient.prepareSuccess({ projects: 'expectedValue' });

      return projectsService.loadProjects().then((response) => {
        expect(response).toEqual('expectedValue');
        expect(mockClient.lastQuery()).toMatchSnapshot();
      });
    });

    it('should throw an error if the query fails', () => {
      mockClient.prepareFailure('error');

      return projectsService.loadProjects().catch((error) => {
        expect(error).toEqual({ error: 'error' });
      });
    });
  });

  describe('loadProjectsForUser', () => {
    it('should build the correct query and unpack the results', () => {
      mockClient.prepareSuccess({ projectsForUser: 'expectedValue' });

      return projectsService.loadProjectsForUser().then((response) => {
        expect(response).toEqual('expectedValue');
        expect(mockClient.lastQuery()).toMatchSnapshot();
      });
    });

    it('should throw an error if the query fails', () => {
      mockClient.prepareFailure('error');

      return projectsService.loadProjectsForUser().catch((error) => {
        expect(error).toEqual({ error: 'error' });
      });
    });
  });

  describe('getAllProjectsAndResources', () => {
    it('should build the correct query and unpack the results', () => {
      mockClient.prepareSuccess({ allProjectsAndResources: 'expectedValue' });

      return projectsService.getAllProjectsAndResources().then((response) => {
        expect(response).toEqual('expectedValue');
        expect(mockClient.lastQuery()).toMatchSnapshot();
      });
    });

    it('should throw an error if the query fails', () => {
      mockClient.prepareFailure('error');

      return projectsService.getAllProjectsAndResources().catch((error) => {
        expect(error).toEqual({ error: 'error' });
      });
    });
  });

  describe('loadProjectInfo', () => {
    it('should build the correct query and unpack the results', () => {
      mockClient.prepareSuccess({ project: 'expectedValue' });

      return projectsService.loadProjectInfo().then((response) => {
        expect(response).toEqual('expectedValue');
        expect(mockClient.lastQuery()).toMatchSnapshot();
      });
    });

    it('should throw an error if the query fails', () => {
      mockClient.prepareFailure('error');

      return projectsService.loadProjectInfo().catch((error) => {
        expect(error).toEqual({ error: 'error' });
      });
    });
  });

  describe('createProject', () => {
    it('should build the correct query and unpack the results', () => {
      mockClient.prepareSuccess({ createProject: 'expectedValue' });

      return projectsService.createProject().then((response) => {
        expect(response).toEqual('expectedValue');
        expect(mockClient.lastQuery()).toMatchSnapshot();
      });
    });

    it('should throw an error if the query fails', () => {
      mockClient.prepareFailure('error');

      return projectsService.createProject().catch((error) => {
        expect(error).toEqual({ error: 'error' });
      });
    });
  });

  describe('requestProject', () => {
    const testProject = {
      name: 'test',
    };
    it('should build the correct query', async () => {
      mockClient.prepareSuccess({ requestProject: 'expectedValue' });

      const response = await projectsService.requestProject(testProject);
      expect(response).toEqual('expectedValue');
      expect(mockClient.lastQuery().replace(/\s/g, '')).toEqual('RequestProject($project:ProjectCreationRequest){requestProject(project:$project)}');
    });

    it('should throw an error if the query fails', async () => {
      mockClient.prepareFailure('error');

      await expect(projectsService.requestProject(testProject)).rejects.toEqual({ error: 'error' });
    });
  });

  describe('deleteProject', () => {
    it('should build the correct query and unpack the results', () => {
      mockClient.prepareSuccess({ deleteProject: 'expectedValue' });

      return projectsService.deleteProject().then((response) => {
        expect(response).toEqual('expectedValue');
        expect(mockClient.lastQuery()).toMatchSnapshot();
      });
    });

    it('should throw an error if the query fails', () => {
      mockClient.prepareFailure('error');

      return projectsService.deleteProject().catch((error) => {
        expect(error).toEqual({ error: 'error' });
      });
    });
  });

  describe('checkProjectKeyUniqueness', () => {
    it('should build the correct query and unpack the results', () => {
      mockClient.prepareSuccess({ checkProjectKeyUniqueness: 'expectedValue' });

      return projectsService.checkProjectKeyUniqueness().then((response) => {
        expect(response).toEqual('expectedValue');
        expect(mockClient.lastQuery()).toMatchSnapshot();
      });
    });

    it('should throw an error if the query fails', () => {
      mockClient.prepareFailure('error');

      return projectsService.checkProjectKeyUniqueness().catch((error) => {
        expect(error).toEqual({ error: 'error' });
      });
    });
  });
});
