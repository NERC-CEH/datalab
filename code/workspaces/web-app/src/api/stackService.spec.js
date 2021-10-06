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
      const data = { stack: { name: 'name', assets: [{ assetId: 'asset-1' }] } };
      mockClient.prepareSuccess(data);

      return stackService.createStack(data.stack).then((response) => {
        expect(response).toEqual(data.stack);
        expect(mockClient.lastQuery()).toMatchSnapshot();
        expect(mockClient.lastOptions()).toEqual({ stack: { name: 'name', assetIds: ['asset-1'] } });
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

  describe('editStack', () => {
    it('should build the correct mutation and unpack the results', () => {
      const data = { stack: { name: 'name', projectKey: 'test', shared: 'project', assets: [{ assetId: 'asset-1' }] } };
      mockClient.prepareSuccess(data);

      return stackService.editStack(data.stack).then((response) => {
        expect(response).toEqual(data.stack);
        expect(mockClient.lastQuery()).toMatchSnapshot();
        expect(mockClient.lastOptions()).toEqual({ stack: { name: 'name', projectKey: 'test', shared: 'project', assetIds: ['asset-1'] } });
      });
    });

    it('should throw an error if the mutation fails', () => {
      const data = { stack: { name: 'name', projectKey: 'test', shared: 'project' } };
      mockClient.prepareFailure('error');

      return stackService.editStack(data.stack).catch((error) => {
        expect(error).toEqual({ error: 'error' });
      });
    });
  });

  describe('restartStack', () => {
    it('should build the correct mutation and unpack the results', () => {
      const data = { stack: { name: 'name', projectKey: 'test', type: 'jupyter' } };
      mockClient.prepareSuccess(data);

      return stackService.restartStack(data.stack).then((response) => {
        expect(response).toEqual(data.stack);
        expect(mockClient.lastQuery()).toMatchSnapshot();
        expect(mockClient.lastOptions()).toEqual(data);
      });
    });

    it('should throw an error if the mutation fails', () => {
      const data = { stack: { name: 'name', projectKey: 'test', type: 'jupyter' } };
      mockClient.prepareFailure('error');

      return stackService.editStack(data.stack).catch((error) => {
        expect(error).toEqual({ error: 'error' });
      });
    });
  });

  describe('scaleStack', () => {
    it('should build the correct mutation to scale up', async () => {
      const data = { stack: { name: 'name', projectKey: 'test', type: 'jupyter' } };
      mockClient.prepareSuccess(data);

      const response = await stackService.scaleStack(data.stack, 1);
      expect(response).toEqual(data.scaleupStack);
      expect(mockClient.lastQuery()).toEqual(`
    ScaleStack($stack: ScaleRequest) {
      scaleupStack(stack: $stack) {
        message
      }
    }`);
      expect(mockClient.lastOptions()).toEqual(data);
    });

    it('should build the correct mutation to scale down', async () => {
      const data = { stack: { name: 'name', projectKey: 'test', type: 'jupyter' } };
      mockClient.prepareSuccess(data);

      const response = await stackService.scaleStack(data.stack, 0);
      expect(response).toEqual(data.scaleupStack);
      expect(mockClient.lastQuery()).toEqual(`
    ScaleStack($stack: ScaleRequest) {
      scaledownStack(stack: $stack) {
        message
      }
    }`);
      expect(mockClient.lastOptions()).toEqual(data);
    });

    it('should throw an error if the mutation fails', async () => {
      const data = { stack: { name: 'name', projectKey: 'test', type: 'jupyter' } };
      mockClient.prepareFailure('error');

      await expect(stackService.scaleStack(data.stack, 1)).rejects.toEqual({ error: 'error' });
    });
  });
});
