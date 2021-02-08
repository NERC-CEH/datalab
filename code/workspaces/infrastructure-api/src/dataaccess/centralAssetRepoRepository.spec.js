import centralAssetRepoRepository from './centralAssetRepoRepository';
import database from '../config/database';

const centralAssetMetadataModelMock = {
  create: jest.fn(),
  exists: jest.fn(),
};

jest.mock('../config/database');
database.getModel.mockReturnValue(centralAssetMetadataModelMock);

const { createMetadata, metadataExists } = centralAssetRepoRepository;

describe('createMetadata', () => {
  it('calls to create new metadata document and returns the newly created document', async () => {
    const metadata = {
      name: 'Test Metadata',
      version: '0.1.0',
      type: 'DATA',
      owners: [],
      visible: 'PUBLIC',
      fileLocation: 'path/to/file',
    };
    const createdDocument = { ...metadata, assetId: 'test-asset-id' };
    centralAssetMetadataModelMock.create.mockReturnValueOnce([createdDocument]);

    const response = await createMetadata(metadata);

    expect(centralAssetMetadataModelMock.create).toHaveBeenCalledWith([metadata], { setDefaultsOnInsert: true });
    expect(response).toBe(createdDocument);
  });
});

describe('metadataExists', () => {
  describe('returns that there is a conflict if metadata with', () => {
    it('same name and version combination exists', async () => {
      const metadata = { name: 'Test Metadata', version: '0.1.0' };
      centralAssetMetadataModelMock.exists.mockResolvedValueOnce(true);
      const response = await metadataExists(metadata);
      expect(response.conflicts).toEqual(["Metadata already exists with 'name:version' combination 'Test Metadata:0.1.0'."]);
    });

    it('same fileLocation already exists', async () => {
      const metadata = { fileLocation: 'test/file/location' };
      centralAssetMetadataModelMock.exists.mockResolvedValueOnce(true);
      const response = await metadataExists(metadata);
      expect(response.conflicts).toEqual(["Metadata for asset with fileLocation 'test/file/location' already exists."]);
    });

    it('same masterUrl and no masterVersion already exists', async () => {
      const metadata = { masterUrl: 'masterUrl', masterVersion: undefined };
      centralAssetMetadataModelMock.exists.mockResolvedValueOnce(true);
      const response = await metadataExists(metadata);
      expect(response.conflicts).toEqual(["Metadata for asset with masterUrl 'masterUrl' already exists."]);
    });

    it('same masterUrl and masterVersion combination exists', async () => {
      const metadata = { masterUrl: 'masterUrl', masterVersion: 'masterVersion' };
      centralAssetMetadataModelMock.exists.mockResolvedValueOnce(true);
      const response = await metadataExists(metadata);
      expect(response.conflicts).toEqual(["Metadata for asset with 'masterUrl:masterVersion' combination 'masterUrl:masterVersion' already exists."]);
    });
  });
});
