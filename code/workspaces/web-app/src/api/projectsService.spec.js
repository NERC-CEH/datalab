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
});
