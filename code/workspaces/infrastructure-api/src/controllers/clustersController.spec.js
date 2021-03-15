import * as expressValidator from 'express-validator';
import clustersRepository from '../dataaccess/clustersRepository';
import clustersController from './clustersController';
import * as clusterManager from '../stacks/clusterManager';

jest.mock('../stacks/clusterManager');
clusterManager.createClusterStack = jest.fn().mockResolvedValue('okay');
clusterManager.getSchedulerServiceName = jest.fn().mockReturnValue('dask-scheduler-cluster');

jest.mock('../dataaccess/clustersRepository');

const matchedDataMock = jest
  .spyOn(expressValidator, 'matchedData')
  .mockImplementation(request => request);

const responseMock = {
  status: jest.fn().mockReturnThis(),
  send: jest.fn().mockReturnThis(),
};
const nextMock = jest.fn();

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
  schedulerAddress: 'tcp://dask-scheduler-cluster:8786',
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('clustersController', () => {
  describe('createCluster', () => {
    const { createCluster } = clustersController;

    it('calls matched data to get the cluster information', async () => {
      // Arrange
      const requestMock = { };

      // Act
      await createCluster(requestMock, responseMock, nextMock);

      // Assert
      expect(matchedDataMock).toHaveBeenCalledWith(requestMock);
    });

    it('returns response configured with 409 status and result of clusterExists check if cluster already exists', async () => {
      // Arrange
      const clusterExistsResponse = 'Cluster already exists';
      clustersRepository.clusterExists.mockResolvedValueOnce(clusterExistsResponse);
      const requestMock = clusterRequest();

      // Act
      const returnValue = await createCluster(requestMock, responseMock, nextMock);

      // Assert
      expect(returnValue).toBe(responseMock);
      expect(responseMock.status).toHaveBeenCalledWith(409);
      expect(responseMock.send).toHaveBeenCalledWith({ message: clusterExistsResponse });
    });

    it('calls next with an error if there is an error checking if the cluster exists', async () => {
      // Arrange
      clustersRepository.clusterExists.mockRejectedValueOnce(new Error('Expected test error'));
      const requestMock = clusterRequest();

      // Act
      await createCluster(requestMock, responseMock, nextMock);

      // Assert
      expect(nextMock).toHaveBeenCalledWith(new Error('Error creating cluster - failed to check if document already exists: Expected test error'));
    });

    it('creates new cluster document and returns the newly created document with 201 status', async () => {
      // Arrange
      const requestMock = clusterRequest();
      const document = clusterDocument();
      clustersRepository.createCluster.mockResolvedValueOnce(document);

      // Act
      const returnValue = await createCluster(requestMock, responseMock, nextMock);

      // For testing, the request mock doubles as the metadata object containing the metadata values
      expect(clustersRepository.createCluster).toHaveBeenCalledWith({ ...requestMock, schedulerAddress: document.schedulerAddress });
      expect(clusterManager.createClusterStack).toHaveBeenCalledWith(requestMock);
      expect(returnValue).toBe(responseMock);
      expect(responseMock.status).toHaveBeenCalledWith(201);
      expect(responseMock.send).toHaveBeenCalledWith(document);
    });

    it('calls next with an error if there is an error when creating the new metadata document', async () => {
      // Arrange
      const requestMock = clusterRequest();
      clustersRepository.createCluster.mockRejectedValueOnce(new Error('Expected test error'));

      // Act
      await createCluster(requestMock, responseMock, nextMock);

      // Assert
      expect(nextMock).toHaveBeenCalledWith(new Error('Error creating cluster - failed to create new document: Expected test error'));
    });
  });

  describe('listByProject', () => {
    const { listByProject } = clustersController;
    it('calls to get clusters available to project and returns response configured with 200 status and array of clusters when projectKey provided', async () => {
      // Arrange
      const requestMock = { projectKey: 'test-proj' };
      const clusterDocuments = [clusterDocument()];
      clustersRepository.listByProject.mockResolvedValueOnce(clusterDocuments);

      // Act
      const returnValue = await listByProject(requestMock, responseMock, nextMock);

      // Assert
      expect(returnValue).toBe(responseMock);
      expect(responseMock.status).toHaveBeenCalledWith(200);
      expect(responseMock.send).toHaveBeenCalledWith(clusterDocuments);
    });

    it('calls next with an error if there is an error when listing the metadata', async () => {
      // Arrange
      const requestMock = {};
      clustersRepository.listByProject.mockRejectedValueOnce(new Error('Expected test error'));

      // Act
      await listByProject(requestMock, responseMock, nextMock);

      // Assert
      expect(nextMock).toHaveBeenCalledWith(new Error('Error listing clusters: Expected test error'));
    });
  });
});
