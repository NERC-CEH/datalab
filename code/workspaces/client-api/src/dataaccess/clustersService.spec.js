import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import clustersService from './clustersService';
import config from '../config';

const httpMock = new MockAdapter(axios);
const infrastructureApi = config.get('infrastructureApi');

const token = 'token';

describe('clustersService', () => {
  beforeEach(() => {
    httpMock.reset();
  });

  afterAll(() => {
    httpMock.restore();
  });

  describe('createCluster', () => {
    const clusterRequest = {
      type: 'DASK',
      projectKey: 'test-project',
      name: 'cluster1',
      displayName: 'new cluster',
      volumeMount: 'example',
      condaPath: '/file/path',
      maxWorkers: 8,
      maxWorkerMemoryGb: 0.5,
      maxWorkerCpu: 1.5,
    };
    const clusterResponse = {
      ...clusterRequest,
      id: '1234',
    };
    const { createCluster } = clustersService;
    it('calls infrastructure-api to create cluster with correct data and returns result data', async () => {
      httpMock
        .onPost(`${infrastructureApi}/clusters/`)
        .reply(201, clusterResponse);

      const returnValue = await createCluster(clusterRequest, token);

      expect(returnValue).toEqual(clusterResponse);
      expect(httpMock.history.post.length).toBe(1);
      const [postMock] = httpMock.history.post;
      expect(postMock.data).toEqual(JSON.stringify(clusterRequest));
      expect(postMock.headers.authorization).toEqual(token);
    });
  });

  describe('deleteCluster', () => {
    const clusterRequest = {
      type: 'DASK',
      projectKey: 'test-project',
      name: 'cluster1',
    };
    const clusterResponse = clusterRequest;
    const { deleteCluster } = clustersService;
    it('calls infrastructure-api to delete cluster with correct data and returns result data', async () => {
      httpMock
        .onDelete(`${infrastructureApi}/clusters/test-project/DASK/cluster1`)
        .reply(200, clusterResponse);

      const returnValue = await deleteCluster(clusterRequest, token);

      expect(returnValue).toEqual(clusterResponse);
      expect(httpMock.history.delete.length).toBe(1);
      const [deleteMock] = httpMock.history.delete;
      expect(deleteMock.headers.authorization).toEqual(token);
    });
  });

  describe('getClusters', () => {
    const clusterResponse = {
      type: 'DASK',
      projectKey: 'test-project',
      name: 'cluster1',
      displayName: 'new cluster',
      volumeMount: 'example',
      condaPath: '/file/path',
      maxWorkers: 8,
      maxWorkerMemoryGb: 0.5,
      maxWorkerCpu: 1.5,
      id: '1234',
    };
    const { getClusters } = clustersService;
    it('calls infrastructure-api to get clusters with correct data and returns result data', async () => {
      httpMock
        .onGet(`${infrastructureApi}/clusters/?projectKey=test-project`)
        .reply(200, [clusterResponse]);

      const returnValue = await getClusters('test-project', token);

      expect(returnValue).toEqual([clusterResponse]);
      expect(httpMock.history.get.length).toBe(1);
      const [getMock] = httpMock.history.get;
      expect(getMock.headers.authorization).toEqual(token);
    });
  });

  describe('getClustersByMount', () => {
    const clusterResponse = {
      type: 'DASK',
      projectKey: 'test-project',
      name: 'cluster1',
      displayName: 'new cluster',
      volumeMount: 'example',
      condaPath: '/file/path',
      maxWorkers: 8,
      maxWorkerMemoryGb: 0.5,
      maxWorkerCpu: 1.5,
      id: '1234',
    };
    const { getClustersByMount } = clustersService;
    it('calls infrastructure-api to get clusters by mount with correct data and returns result data', async () => {
      httpMock
        .onGet(`${infrastructureApi}/clusters/test-project/mount/example`)
        .reply(200, [clusterResponse]);

      const returnValue = await getClustersByMount('test-project', 'example', token);

      expect(returnValue).toEqual([clusterResponse]);
      expect(httpMock.history.get.length).toBe(1);
      const [getMock] = httpMock.history.get;
      expect(getMock.headers.authorization).toEqual(token);
    });
  });

  describe('scaleDownCluster', () => {
    const clusterRequest = {
      type: 'DASK',
      projectKey: 'test-project',
      name: 'cluster1',
    };
    const clusterResponse = {
      message: 'OK',
    };
    const { scaleDownCluster } = clustersService;

    it('calls infrastructure-api to scale down a cluster', async () => {
      httpMock
        .onPut(`${infrastructureApi}/clusters/test-project/scaledown`)
        .reply(200, clusterResponse);

      const returnValue = await scaleDownCluster(clusterRequest, token);

      expect(returnValue).toEqual(clusterResponse);
      expect(httpMock.history.put.length).toBe(1);
      const [putMock] = httpMock.history.put;
      expect(putMock.data).toEqual(JSON.stringify(clusterRequest));
      expect(putMock.headers.authorization).toEqual(token);
    });
  });

  describe('scaleUpCluster', () => {
    const clusterRequest = {
      type: 'DASK',
      projectKey: 'test-project',
      name: 'cluster1',
    };
    const clusterResponse = {
      message: 'OK',
    };
    const { scaleUpCluster } = clustersService;

    it('calls infrastructure-api to scale up a cluster', async () => {
      httpMock
        .onPut(`${infrastructureApi}/clusters/test-project/scaleup`)
        .reply(200, clusterResponse);

      const returnValue = await scaleUpCluster(clusterRequest, token);

      expect(returnValue).toEqual(clusterResponse);
      expect(httpMock.history.put.length).toBe(1);
      const [putMock] = httpMock.history.put;
      expect(putMock.data).toEqual(JSON.stringify(clusterRequest));
      expect(putMock.headers.authorization).toEqual(token);
    });
  });
});
