import clustersRepository from './clustersRepository';
import database from '../config/database';

const clusterModelMock = {
  create: jest.fn(),
  exec: jest.fn(),
  exists: jest.fn(),
  find: jest.fn().mockReturnThis(),
  in: jest.fn().mockReturnThis(),
  or: jest.fn().mockReturnThis(),
  updateMany: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
};

jest.mock('../config/database');
database.getModel.mockReturnValue(clusterModelMock);

const clusterRequest = () => ({
  type: 'DASK',
  projectKey: 'test-project',
  name: 'cluster',
  displayName: 'new cluster',
  volumeMount: 'example',
  condaPath: '/file/path',
  maxWorkers: 8,
  maxWorkerMemoryGb: 0.5,
  maxWorkerCpu: 1.5,
});
const clusterDocument = () => ({
  ...clusterRequest(),
  _id: '1234',
});

describe('clustersRepository', () => {
  describe('createCluster', () => {
    it('calls to create new cluster document and returns the newly created document', async () => {
      // Arrange
      const cluster = clusterRequest();
      const document = clusterDocument();
      clusterModelMock.create.mockReturnValueOnce([document]);

      // Act
      const response = await clustersRepository.createCluster(cluster);

      // Assert
      expect(clusterModelMock.create).toHaveBeenCalledWith([cluster], { setDefaultsOnInsert: true });
      expect(response).toEqual(document);
    });
  });

  describe('clusterExists', () => {
    describe('returns that there is a conflict if cluster with', () => {
      it('same projectKey and name exists', async () => {
        // Arrange
        const cluster = clusterRequest();
        clusterModelMock.exists.mockResolvedValueOnce(true);

        // Act
        const response = await clustersRepository.clusterExists(cluster);

        // Assert
        expect(response).toEqual("Cluster already exists with name of 'cluster' in project with key 'test-project'.");
      });

      it('same projectKey and displayName exists', async () => {
        // Arrange
        const cluster = clusterRequest();
        clusterModelMock.exists.mockResolvedValueOnce(false);
        clusterModelMock.exists.mockResolvedValueOnce(true);

        // Act
        const response = await clustersRepository.clusterExists(cluster);

        // Assert
        expect(response).toEqual("Cluster already exists with display name of 'new cluster' in project with key 'test-project'.");
      });
    });
  });

  describe('listClusters', () => {
    it('calls to create new cluster document and returns the newly created document', async () => {
      // Arrange
      const { projectKey } = clusterRequest();
      const document = clusterDocument();
      clusterModelMock.exec.mockReturnValueOnce([document]);

      // Act
      const response = await clustersRepository.listByProject(projectKey);

      // Assert
      expect(clusterModelMock.find).toHaveBeenCalledWith({ projectKey });
      expect(response).toEqual([document]);
    });
  });
});
