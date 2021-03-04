import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import clustersService from './clustersService';
import config from '../config';

const httpMock = new MockAdapter(axios);
const infrastructureApi = config.get('infrastructureApi');

const token = 'token';
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

describe('clustersService', () => {
  describe('createCluster', () => {
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
});
