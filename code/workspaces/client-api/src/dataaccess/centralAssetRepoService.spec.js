import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import centralAssetRepoService from './centralAssetRepoService';
import config from '../config';

const httpMock = new MockAdapter(axios);
const infrastructureApi = config.get('infrastructureApi');

const token = 'token';
const metadata = {
  name: 'Test Metadata',
  version: '0.1.0',
  type: 'DATA',
  visible: 'PUBLIC',
  fileLocation: 'path/to/file',
};
const metadataResponse = {
  ...metadata,
  assetId: 'test-asset-id',
};

beforeEach(() => {
  httpMock.reset();
});

afterAll(() => {
  httpMock.restore();
});

describe('createAssetMetadata', () => {
  const { createAssetMetadata } = centralAssetRepoService;

  it('calls infrastructure-api to create metadata with correct data and returns result data', async () => {
    httpMock
      .onPost(`${infrastructureApi}/centralAssetRepo/metadata`)
      .reply(201, metadataResponse);

    const returnValue = await createAssetMetadata(metadata, token);

    expect(returnValue).toEqual(metadataResponse);
    expect(httpMock.history.post.length).toBe(1);
    const [postMock] = httpMock.history.post;
    expect(JSON.parse(postMock.data)).toEqual(metadata);
    expect(postMock.headers.authorization).toEqual(token);
  });
});

describe('updateAssetMetadata', () => {
  const { updateAssetMetadata } = centralAssetRepoService;

  it('calls infrastructure-api to update metadata with correct data and returns result data', async () => {
    httpMock
      .onPut(`${infrastructureApi}/centralAssetRepo/metadata/asset-id`)
      .reply(200, metadataResponse);
    const metadataUpdate = { visible: 'PUBLIC', projectKeys: ['proj1'], ownerUserIds: ['user1'] };
    const metadataRequest = { ...metadataUpdate, assetId: 'asset-id' };

    const returnValue = await updateAssetMetadata(metadataRequest, token);

    expect(returnValue).toEqual(metadataResponse);
    expect(httpMock.history.put.length).toBe(1);
    const [putMock] = httpMock.history.put;
    expect(JSON.parse(putMock.data)).toEqual(metadataUpdate);
    expect(putMock.headers.authorization).toEqual(token);
  });
});

describe('listCentralAssets', () => {
  const { listCentralAssets } = centralAssetRepoService;

  it('calls infrastructure-api to get all metadata assets', async () => {
    httpMock
      .onGet(`${infrastructureApi}/centralAssetRepo/metadata`)
      .reply(200, [metadataResponse]);

    const returnValue = await listCentralAssets(token);

    expect(returnValue).toEqual([metadataResponse]);
    expect(httpMock.history.get.length).toBe(1);
    const [getMock] = httpMock.history.get;
    expect(getMock.headers.authorization).toEqual(token);
  });
});

describe('listCentralAssetsAvailableToProject', () => {
  const { listCentralAssetsAvailableToProject } = centralAssetRepoService;
  const projectKey = 'test-project';

  it('calls infrastructure-api to get metadata of assets visible to the provided project', async () => {
    httpMock
      .onGet(`${infrastructureApi}/centralAssetRepo/metadata?projectKey=${projectKey}`)
      .reply(200, [metadataResponse]);

    const returnValue = await listCentralAssetsAvailableToProject(projectKey, token);

    expect(returnValue).toEqual([metadataResponse]);
    expect(httpMock.history.get.length).toBe(1);
    const [getMock] = httpMock.history.get;
    expect(getMock.headers.authorization).toEqual(token);
  });
});

describe('getAssetByIdAndProjectKey', () => {
  const { getAssetByIdAndProjectKey } = centralAssetRepoService;
  const assetId = 'test-asset-id';
  const projectKey = 'test-project';

  it('calls infrastructure-api to get metadata of asset with assetID that is visible to the provided project', async () => {
    httpMock
      .onGet(`${infrastructureApi}/centralAssetRepo/metadata/${assetId}?projectKey=${projectKey}`)
      .reply(200, metadataResponse);

    const returnValue = await getAssetByIdAndProjectKey(assetId, projectKey, token);

    expect(returnValue).toEqual(metadataResponse);
    expect(httpMock.history.get.length).toBe(1);
    const [getMock] = httpMock.history.get;
    expect(getMock.headers.authorization).toEqual(token);
  });
});

