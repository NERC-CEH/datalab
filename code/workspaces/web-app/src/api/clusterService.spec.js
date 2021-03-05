import mockClient from './graphqlClient';
import clusterService from './clusterService';

jest.mock('./graphqlClient');

const getClusterCreationObject = () => ({
  displayName: 'Test Cluster',
  name: 'testcluster',
  type: 'DASK',
  projectKey: 'testproj',
  volumeMount: 'teststore',
  condaPath: '/conda/path',
  maxWorkers: 4,
  maxWorkerMemoryGb: 4,
  maxWorkerCpu: 1,
});

describe('clusterService', () => {
  beforeEach(() => mockClient.clearResult());

  describe('createCluster', () => {
    it('should build the correct mutation and unpack the results', async () => {
      const clusterCreationRequest = getClusterCreationObject();
      const creationResponseData = { id: 'test-id' };
      mockClient.prepareSuccess(creationResponseData);

      await clusterService.createCluster(clusterCreationRequest);

      expect(mockClient.lastQuery()).toMatchSnapshot();
      expect(mockClient.lastOptions()).toEqual({ cluster: clusterCreationRequest });
    });

    it('should throw an error if the mutation fails', async () => {
      const clusterCreationRequest = getClusterCreationObject();
      mockClient.prepareFailure('expected error');
      let error;
      try {
        await clusterService.createCluster(clusterCreationRequest);
      } catch (err) {
        error = err;
      }
      expect(error).toEqual({ error: 'expected error' });
    });
  });
});
