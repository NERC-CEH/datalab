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
  owners: [],
  visible: 'PUBLIC',
  fileLocation: 'path/to/file',
};
const metadataResponse = {
  ...metadata,
  assetId: 'asset-id',
};

describe('createAssetMetadata', () => {
  const { createAssetMetadata } = centralAssetRepoService;

  beforeEach(() => {
    httpMock.reset();
  });

  afterAll(() => {
    httpMock.restore();
  });

  it('calls infrastructure-api to create metadata with correct data and returns result data', async () => {
    httpMock
      .onPost(`${infrastructureApi}/centralAssetRepo/metadata`)
      .reply(201, metadataResponse);

    const returnValue = await createAssetMetadata(metadata, token);

    expect(returnValue).toEqual(metadataResponse);
    expect(httpMock.history.post.length).toBe(1);
    const [postMock] = httpMock.history.post;
    expect(postMock.data).toEqual(JSON.stringify(metadata));
    expect(postMock.headers.authorization).toEqual(token);
  });
});
