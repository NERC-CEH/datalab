import clusterService from '../api/clusterService';
import clusterActions, { CREATE_CLUSTER_ACTION, LOAD_CLUSTERS_ACTION } from './clusterActions';

jest.mock('../api/clusterService');

const createClusterMock = jest.fn();
clusterService.createCluster = createClusterMock;

const loadClustersMock = jest.fn();
clusterService.loadClusters = loadClustersMock;

const getClusterCreationObject = () => ({
  displayName: 'Test Cluster',
  name: 'testcluster',
  type: 'DASK',
  projectKey: 'project-key',
  volumeMount: 'teststore',
  condaPath: '/conda/path',
  maxWorkers: 4,
  maxWorkerMemoryGb: 4,
  maxWorkerCpu: 1,
});

describe('clusterActions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createCluster', () => {
    it('makes correct call to service function and provides result in action payload', () => {
      const createClusterMockReturnValue = 'cluster-created';
      createClusterMock.mockReturnValueOnce(createClusterMockReturnValue);
      const clusterCreationObject = getClusterCreationObject();

      const actionReturn = clusterActions.createCluster(clusterCreationObject);

      expect(createClusterMock).toHaveBeenCalledWith(clusterCreationObject);
      expect(actionReturn.type).toEqual(CREATE_CLUSTER_ACTION);
      expect(actionReturn.payload).toEqual(createClusterMockReturnValue);
    });
  });

  describe('loadClusters', () => {
    it('makes correct call to service function and provides result in action payload', async () => {
      const projectKey = 'project-key';
      const loadClustersMockReturnValue = 'clusters-loaded';
      loadClustersMock.mockResolvedValueOnce(loadClustersMockReturnValue);

      const actionReturn = clusterActions.loadClusters(projectKey);

      expect(loadClustersMock).toHaveBeenCalledWith(projectKey);
      expect(actionReturn.type).toEqual(LOAD_CLUSTERS_ACTION);
      expect(await actionReturn.payload).toEqual({ clusters: loadClustersMockReturnValue, projectKey });
    });
  });

  describe('exports correct values for', () => {
    it('CREATE_CLUSTER', () => {
      expect(CREATE_CLUSTER_ACTION).toEqual('CREATE_CLUSTER_ACTION');
    });

    it('LOAD_CLUSTERS', () => {
      expect(LOAD_CLUSTERS_ACTION).toEqual('LOAD_CLUSTERS_ACTION');
    });
  });
});
