import centralAssetRepoRepository from './centralAssetRepoRepository';
import database from '../config/database';

const nowMockTime = 'Date.now() timestamp';
jest.spyOn(Date, 'now').mockReturnValue(nowMockTime);

const centralAssetMetadataModelMock = {
  create: jest.fn(),
  exists: jest.fn(),
  find: jest.fn().mockReturnThis(),
  or: jest.fn().mockReturnThis(),
  updateMany: jest.fn().mockReturnThis(),
  exec: jest.fn(),
};

jest.mock('../config/database');
database.getModel.mockReturnValue(centralAssetMetadataModelMock);

const getMinimalMetadata = () => ({
  name: 'Test Metadata',
  version: '0.1.0',
  type: 'DATA',
  ownerUserIds: [],
  visible: 'PUBLIC',
  fileLocation: 'path/to/file',
});

const { createMetadata, metadataExists } = centralAssetRepoRepository;

describe('createMetadata', () => {
  it('calls to create new metadata document and returns the newly created document', async () => {
    const metadata = getMinimalMetadata();
    const createdDocument = { ...metadata, assetId: 'test-asset-id' };
    centralAssetMetadataModelMock.create.mockReturnValueOnce([createdDocument]);

    const response = await createMetadata(metadata);

    expect(centralAssetMetadataModelMock.create).toHaveBeenCalledWith([metadata], { setDefaultsOnInsert: true });
    expect(response).toBe(createdDocument);
  });
});

describe('listMetadata', () => {
  it('performs the correct query on central asset metadata model and returns the result', async () => {
    const metadata = getMinimalMetadata();
    centralAssetMetadataModelMock.exec.mockResolvedValueOnce([metadata]);

    const returnValue = await centralAssetRepoRepository.listMetadata();

    expect(returnValue).toEqual([metadata]);
    expect(centralAssetMetadataModelMock.find).toHaveBeenCalledWith();
    expect(centralAssetMetadataModelMock.exec).toHaveBeenCalledWith();
  });
});

describe('metadataAvailableToProject', () => {
  it('performs correct query on central asset metadata model and returns the result', async () => {
    const projectKey = 'test-project';
    const metadata = getMinimalMetadata();
    centralAssetMetadataModelMock.exec.mockResolvedValueOnce([metadata]);

    const returnValue = await centralAssetRepoRepository.metadataAvailableToProject(projectKey);

    expect(returnValue).toEqual([metadata]);
    expect(centralAssetMetadataModelMock.find).toHaveBeenCalledWith();
    expect(centralAssetMetadataModelMock.or).toHaveBeenCalledWith([
      { visible: 'PUBLIC' },
      { visible: 'BY_PROJECT', projectKeys: { $elemMatch: { $eq: projectKey } } },
    ]);
    expect(centralAssetMetadataModelMock.exec).toHaveBeenCalledWith();
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

describe('setLastAddedDateToNow', () => {
  it('performs the correct mutation on CentralAssetMetadataModel', async () => {
    const assetIds = ['test-asset-one', 'test-asset-two'];
    await centralAssetRepoRepository.setLastAddedDateToNow(assetIds);
    expect(centralAssetMetadataModelMock.updateMany).toHaveBeenCalledWith(
      { assetId: { $in: assetIds } },
      { lastAddedDate: nowMockTime },
    );
    expect(centralAssetMetadataModelMock.exec).toHaveBeenCalledWith();
  });
});
