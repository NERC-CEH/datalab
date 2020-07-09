import mockClient from './graphqlClient';
import stackService from './stackService';

jest.mock('./graphqlClient');

describe('stackService', () => {
  beforeEach(() => mockClient.clearResult());

  describe('loadStacks', () => {
    it('should build the correct query and unpack the results', () => {
      mockClient.prepareSuccess({ stacks: 'expectedValue' });

      return stackService.loadStacks().then((response) => {
        expect(response).toEqual('expectedValue');
        expect(mockClient.lastQuery()).toMatchSnapshot();
      });
    });

    it('should throw an error if the query fails', () => {
      mockClient.prepareFailure('error');

      return stackService.loadStacks().catch((error) => {
        expect(error).toEqual({ error: 'error' });
      });
    });
  });

  describe('getUrl', () => {
    it('should build the correct query and return the url', () => {
      const data = { stack: { redirectUrl: 'expectedUrl' } };
      const queryParams = { projectKey: 'testproj', id: 'id' };
      mockClient.prepareSuccess(data);

      return stackService.getUrl(queryParams.projectKey, queryParams.id).then((response) => {
        expect(response).toEqual(data.stack);
        expect(mockClient.lastQuery()).toMatchSnapshot();
        expect(mockClient.lastOptions()).toEqual(queryParams);
      });
    });

    it('should throw an error if no url is specified', () => {
      const data = { stack: { name: 'name' } };
      mockClient.prepareSuccess(data);

      return stackService.getUrl().catch((error) => {
        expect(error.message).toEqual('Missing stack URL');
      });
    });
  });

  describe('createStack', () => {
    it('should build the correct mutation and unpack the results', () => {
      const data = { stack: { name: 'name' } };
      mockClient.prepareSuccess(data);

      return stackService.createStack(data.stack).then((response) => {
        expect(response).toEqual(data.stack);
        expect(mockClient.lastQuery()).toMatchSnapshot();
        expect(mockClient.lastOptions()).toEqual(data);
      });
    });

    it('should throw an error if the mutation fails', () => {
      const data = { stack: { name: 'name' } };
      mockClient.prepareFailure('error');

      return stackService.createStack(data.stack).catch((error) => {
        expect(error).toEqual({ error: 'error' });
      });
    });
  });

  describe('deleteStack', () => {
    it('should build the correct mutation and unpack the results', () => {
      const data = { stack: { name: 'name' } };
      mockClient.prepareSuccess(data);

      return stackService.deleteStack(data.stack).then((response) => {
        expect(response).toEqual(data.stack);
        expect(mockClient.lastQuery()).toMatchSnapshot();
        expect(mockClient.lastOptions()).toEqual(data);
      });
    });

    it('should throw an error if the mutation fails', () => {
      const data = { stack: { name: 'name' } };
      mockClient.prepareFailure('error');

      return stackService.deleteStack(data.stack).catch((error) => {
        expect(error).toEqual({ error: 'error' });
      });
    });
  });

  describe('updateStackShareStatus', () => {
    it('should build the correct mutation and unpack the results', () => {
      const data = { stack: { name: 'name', projectKey: 'test', shared: 'project' } };
      mockClient.prepareSuccess(data);

      return stackService.updateStackShareStatus(data.stack).then((response) => {
        expect(response).toEqual(data.stack);
        expect(mockClient.lastQuery()).toMatchSnapshot();
        expect(mockClient.lastOptions()).toEqual(data);
      });
    });

    it('should throw an error if the mutation fails', () => {
      const data = { stack: { name: 'name', projectKey: 'test', shared: 'project' } };
      mockClient.prepareFailure('error');

      return stackService.updateStackShareStatus(data.stack).catch((error) => {
        expect(error).toEqual({ error: 'error' });
      });
    });
  });
});
