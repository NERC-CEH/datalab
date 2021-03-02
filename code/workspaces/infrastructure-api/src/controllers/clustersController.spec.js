import * as expressValidator from 'express-validator';
import clustersRepository from '../dataaccess/clustersRepository';
import clustersController from './clustersController';

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
  name: 'new cluster',
  volumeMount: 'example',
  condaPath: '/file/path',
  maxWorkers: 8,
  maxWorkerMemoryGb: 0.5,
  maxWorkerCpu: 1.5,
});

describe('createCluster', () => {
  const { createCluster } = clustersController;

  it('calls matched data to get the cluster information', async () => {
    const requestMock = { };
    await createCluster(requestMock, responseMock, nextMock);
    expect(matchedDataMock).toHaveBeenCalledWith(requestMock);
  });

  it('returns response configured with 409 status and result of clusterExists check if cluster already exists', async () => {
    const clusterExistsResponse = ['Cluster already exists'];
    clustersRepository.clusterExists.mockResolvedValueOnce(clusterExistsResponse);
    const requestMock = clusterRequest();

    const returnValue = await createCluster(requestMock, responseMock, nextMock);

    expect(returnValue).toBe(responseMock);
    expect(responseMock.status).toHaveBeenCalledWith(409);
    expect(responseMock.send).toHaveBeenCalledWith(clusterExistsResponse);
  });

  it('calls next with an error if there is an error checking if the cluster exists', async () => {
    clustersRepository.clusterExists.mockRejectedValueOnce(new Error('Expected test error'));
    const requestMock = clusterRequest();
    await createCluster(requestMock, responseMock, nextMock);
    expect(nextMock).toHaveBeenCalledWith(new Error('Error creating cluster - failed to check if document already exists: Expected test error'));
  });

  it('creates new cluster document and returns the newly created document with 201 status', async () => {
    const requestMock = clusterRequest();
    const newMetaDocument = { ...requestMock, _id: '1234' };
    clustersRepository.createCluster.mockResolvedValueOnce(newMetaDocument);

    const returnValue = await createCluster(requestMock, responseMock, nextMock);

    // For testing, the request mock doubles as the metadata object containing the metadata values
    expect(clustersRepository.createCluster).toHaveBeenCalledWith(requestMock);
    expect(returnValue).toBe(responseMock);
    expect(responseMock.status).toHaveBeenCalledWith(201);
    expect(responseMock.send).toHaveBeenCalledWith(newMetaDocument);
  });

  it('calls next with an error if there is an error when creating the new metadata document', async () => {
    const requestMock = clusterRequest();
    clustersRepository.createCluster.mockRejectedValueOnce(new Error('Expected test error'));
    await createCluster(requestMock, responseMock, nextMock);
    expect(nextMock).toHaveBeenCalledWith(new Error('Error creating cluster - failed to create new document: Expected test error'));
  });
});
