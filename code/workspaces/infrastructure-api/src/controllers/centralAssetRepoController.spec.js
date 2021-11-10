import * as expressValidator from 'express-validator';
import centralAssetRepoRepository from '../dataaccess/centralAssetRepoRepository';
import stacksRepository from '../dataaccess/stacksRepository';
import centralAssetRepoController from './centralAssetRepoController';
import centralAssetRepoModel from '../models/centralAssetMetadata.model';
import stackManager from '../stacks/stackManager';

jest.mock('express-validator');
jest.mock('../dataaccess/centralAssetRepoRepository');
jest.mock('../dataaccess/stacksRepository');
jest.mock('../stacks/stackManager');

const matchedDataMock = jest
  .spyOn(expressValidator, 'matchedData')
  .mockImplementation(request => request);

const responseMock = {
  status: jest.fn().mockReturnThis(),
  send: jest.fn().mockReturnThis(),
};
const nextMock = jest.fn();

const { PUBLIC, BY_PROJECT } = centralAssetRepoModel;

const getMinimalMetadata = () => ({
  name: 'Test Metadata',
  version: '0.1.0',
  ownerUserIds: [],
  visible: PUBLIC,
  fileLocation: 'path/to/file',
});

const getUpdateMetadata = () => ({
  assetId: 'asset-id',
  ownerUserIds: ['user1'],
  visible: 'BY_PROJECT',
  projectKeys: ['projKey'],
});

const getUpdateRequest = metadata => ({
  ...metadata,
  user: {
    sub: 'userId',
    roles: {},
  },
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('createAssetMetadata', () => {
  const { createAssetMetadata } = centralAssetRepoController;

  it('calls matched data to get the metadata information', async () => {
    const requestMock = { };
    await createAssetMetadata(requestMock, responseMock, nextMock);
    expect(matchedDataMock).toHaveBeenCalledWith(requestMock);
  });

  it('returns response configured with 400 status and error message if metadata does not contain one of fileLocation or masterUrl', async () => {
    const requestMock = { }; // missing fileLocation and masterUrl
    const returnValue = await createAssetMetadata(requestMock, responseMock, nextMock);
    expect(returnValue).toBe(responseMock);
    expect(responseMock.status).toHaveBeenCalledWith(400);
    expect(responseMock.send).toHaveBeenCalledWith({ error: "One of 'fileLocation' or 'masterUrl' must be defined." });
  });

  it('returns response configured with 409 status and result of metadataExists check if metadata already exists', async () => {
    const metadataExistsResponse = { conflicts: ['Expected test conflict'] };
    centralAssetRepoRepository.metadataExists.mockResolvedValueOnce(metadataExistsResponse);
    const requestMock = getMinimalMetadata();

    const returnValue = await createAssetMetadata(requestMock, responseMock, nextMock);

    expect(returnValue).toBe(responseMock);
    expect(responseMock.status).toHaveBeenCalledWith(409);
    expect(responseMock.send).toHaveBeenCalledWith(metadataExistsResponse);
  });

  it('calls next with an error if there is an error checking if the metadata exists', async () => {
    centralAssetRepoRepository.metadataExists.mockRejectedValueOnce(new Error('Expected test error'));
    const requestMock = getMinimalMetadata();
    await createAssetMetadata(requestMock, responseMock, nextMock);
    expect(nextMock).toHaveBeenCalledWith(new Error('Error creating asset metadata - failed to check if document already exists: Expected test error'));
  });

  it('creates new metadata document and returns the newly created document with 201 status', async () => {
    const requestMock = getMinimalMetadata();
    const newMetaDocument = { ...requestMock, assetId: 'test-asset-id' };
    centralAssetRepoRepository.createMetadata.mockResolvedValueOnce(newMetaDocument);

    const returnValue = await createAssetMetadata(requestMock, responseMock, nextMock);

    // For testing, the request mock doubles as the metadata object containing the metadata values
    expect(centralAssetRepoRepository.createMetadata).toHaveBeenCalledWith(requestMock);
    expect(returnValue).toBe(responseMock);
    expect(responseMock.status).toHaveBeenCalledWith(201);
    expect(responseMock.send).toHaveBeenCalledWith(newMetaDocument);
  });

  it('calls next with an error if there is an error when creating the new metadata document', async () => {
    const requestMock = getMinimalMetadata();
    centralAssetRepoRepository.createMetadata.mockRejectedValueOnce(new Error('Expected test error'));
    await createAssetMetadata(requestMock, responseMock, nextMock);
    expect(nextMock).toHaveBeenCalledWith(new Error('Error creating asset metadata - failed to create new document: Expected test error'));
  });
});

describe('updateAssetMetadata', () => {
  const { updateAssetMetadata } = centralAssetRepoController;

  it('calls matched data to get the metadata information', async () => {
    const requestMock = getUpdateRequest(getUpdateMetadata());
    await updateAssetMetadata(requestMock, responseMock, nextMock);
    expect(matchedDataMock).toHaveBeenNthCalledWith(1, requestMock, { locations: ['params'] });
    expect(matchedDataMock).toHaveBeenNthCalledWith(2, requestMock, { locations: ['body'] });
  });

  it('updates metadata document and returns the newly updated document with 200 status', async () => {
    const requestMetadata = getUpdateMetadata();
    const requestMock = getUpdateRequest(requestMetadata);
    requestMock.user.roles.instanceAdmin = true;

    const existingMetadata = getMinimalMetadata();
    const updatedMetaDocument = { ...getMinimalMetadata(), ...requestMetadata };
    const stack = { _id: 'id', assetIds: ['asset-id', 'asset-id2'] };
    centralAssetRepoRepository.getMetadataWithIds.mockResolvedValueOnce([existingMetadata]);
    centralAssetRepoRepository.updateMetadata.mockResolvedValueOnce(updatedMetaDocument);
    stacksRepository.getAllByAsset.mockResolvedValueOnce([stack]);
    stackManager.mountAssetsOnStack.mockResolvedValueOnce();

    await updateAssetMetadata(requestMock, responseMock, nextMock);

    expect(centralAssetRepoRepository.updateMetadata).toHaveBeenCalledWith(requestMetadata);
    expect(stacksRepository.getAllByAsset).toHaveBeenCalledWith('asset-id');
    expect(stackManager.mountAssetsOnStack).toHaveBeenCalledWith({ _id: 'id', assetIds: ['asset-id2'] });
    expect(stacksRepository.updateAssets).toHaveBeenCalledWith('id', ['asset-id2']);
    expect(responseMock.status).toHaveBeenCalledWith(200);
    expect(responseMock.send).toHaveBeenCalledWith(updatedMetaDocument);
  });

  it('updates metadata document if user is not admin but is a data owner', async () => {
    const requestMetadata = getUpdateMetadata();
    const requestMock = getUpdateRequest(requestMetadata);

    const existingMetadata = {
      ...getMinimalMetadata(),
      ownerUserIds: ['userId'],
    };
    const updatedMetaDocument = { ...getMinimalMetadata(), ...requestMetadata };
    const stack = { _id: 'id', assetIds: ['asset-id', 'asset-id2'] };
    centralAssetRepoRepository.getMetadataWithIds.mockResolvedValueOnce([existingMetadata]);
    centralAssetRepoRepository.updateMetadata.mockResolvedValueOnce(updatedMetaDocument);
    stacksRepository.getAllByAsset.mockResolvedValueOnce([stack]);
    stackManager.mountAssetsOnStack.mockResolvedValueOnce();

    await updateAssetMetadata(requestMock, responseMock, nextMock);

    expect(centralAssetRepoRepository.updateMetadata).toHaveBeenCalledWith(requestMetadata);
    expect(stacksRepository.getAllByAsset).toHaveBeenCalledWith('asset-id');
    expect(stackManager.mountAssetsOnStack).toHaveBeenCalledWith({ _id: 'id', assetIds: ['asset-id2'] });
    expect(stacksRepository.updateAssets).toHaveBeenCalledWith('id', ['asset-id2']);
    expect(responseMock.status).toHaveBeenCalledWith(200);
    expect(responseMock.send).toHaveBeenCalledWith(updatedMetaDocument);
  });

  it('calls next with an error if the document does not exist', async () => {
    const requestMock = getUpdateRequest(getUpdateMetadata());
    centralAssetRepoRepository.getMetadataWithIds.mockResolvedValueOnce([]);

    await updateAssetMetadata(requestMock, responseMock, nextMock);
    expect(nextMock).toHaveBeenCalledWith(new Error('Can not update asset metadata - no document exists with assetId asset-id'));
  });

  it('calls next with an error if the requesting user does not have permission to update', async () => {
    const requestMock = getUpdateRequest(getUpdateMetadata());
    const existingMetadata = getMinimalMetadata();
    centralAssetRepoRepository.getMetadataWithIds.mockResolvedValueOnce([existingMetadata]);

    await updateAssetMetadata(requestMock, responseMock, nextMock);
    expect(nextMock).toHaveBeenCalledWith(new Error('User does not have permission to update asset metadata for assetId asset-id'));
  });

  it('calls next with an error if there is an error when updating the metadata document', async () => {
    const requestMock = getUpdateRequest(getUpdateMetadata());
    requestMock.user.roles.instanceAdmin = true;
    const existingMetadata = getMinimalMetadata();
    const stack = { _id: 'id', assetIds: ['asset-id', 'asset-id2'] };
    centralAssetRepoRepository.getMetadataWithIds.mockResolvedValueOnce([existingMetadata]);
    stacksRepository.getAllByAsset.mockResolvedValueOnce([stack]);
    stackManager.mountAssetsOnStack.mockRejectedValueOnce(new Error('Expected test error'));

    await updateAssetMetadata(requestMock, responseMock, nextMock);
    expect(nextMock).toHaveBeenCalledWith(new Error('Error updating asset metadata - failed to update document: Expected test error'));
  });
});

describe('listAssetMetadata', () => {
  const { listAssetMetadata } = centralAssetRepoController;

  it('calls to list metadata and returns response configured with 200 status and array of metadata when projectKey not provided', async () => {
    const requestMock = {};
    const availableMetadata = [{ ...getMinimalMetadata(), assetId: 'asset-id' }];
    centralAssetRepoRepository.listMetadata.mockResolvedValueOnce(availableMetadata);

    const returnValue = await listAssetMetadata(requestMock, responseMock, nextMock);

    expect(returnValue).toBe(responseMock);
    expect(responseMock.status).toHaveBeenCalledWith(200);
    expect(responseMock.send).toHaveBeenCalledWith(availableMetadata);
  });

  it('calls to get metadata available to project and returns response configured with 200 status and array of metadata when projectKey provided', async () => {
    const requestMock = { projectKey: 'test-project' };
    const availableMetadata = [{ ...getMinimalMetadata(), assetId: 'asset-id' }];
    centralAssetRepoRepository.metadataAvailableToProject.mockResolvedValueOnce(availableMetadata);

    const returnValue = await listAssetMetadata(requestMock, responseMock, nextMock);

    expect(returnValue).toBe(responseMock);
    expect(responseMock.status).toHaveBeenCalledWith(200);
    expect(responseMock.send).toHaveBeenCalledWith(availableMetadata);
  });

  it('calls next with an error if there is an error when listing the metadata', async () => {
    const requestMock = {};
    centralAssetRepoRepository.listMetadata.mockRejectedValueOnce(new Error('Expected test error'));
    await listAssetMetadata(requestMock, responseMock, nextMock);
    expect(nextMock).toHaveBeenCalledWith(new Error('Error listing asset metadata: Expected test error'));
  });
});

describe('getAllMetadata', () => {
  const { getAllMetadata } = centralAssetRepoController;

  it('calls to list metadata and returns response configured with 200 status and array of metadata when user is admin', async () => {
    const requestMock = { user: { roles: { instanceAdmin: true } } };
    const availableMetadata = [{ ...getMinimalMetadata(), assetId: 'asset-id' }];
    centralAssetRepoRepository.listMetadata.mockResolvedValueOnce(availableMetadata);

    const returnValue = await getAllMetadata(requestMock, responseMock, nextMock);

    expect(returnValue).toBe(responseMock);
    expect(responseMock.status).toHaveBeenCalledWith(200);
    expect(responseMock.send).toHaveBeenCalledWith(availableMetadata);
  });

  it('calls to list metadata and returns response configured with 200 status and array of metadata when user is data manager', async () => {
    const requestMock = { user: { roles: { dataManager: true } } };
    const availableMetadata = [{ ...getMinimalMetadata(), assetId: 'asset-id' }];
    centralAssetRepoRepository.listMetadata.mockResolvedValueOnce(availableMetadata);

    const returnValue = await getAllMetadata(requestMock, responseMock, nextMock);

    expect(returnValue).toBe(responseMock);
    expect(responseMock.status).toHaveBeenCalledWith(200);
    expect(responseMock.send).toHaveBeenCalledWith(availableMetadata);
  });

  it('calls to get metadata available to user and returns response configured with 200 status and array of metadata when user is not admin or data manager', async () => {
    const roles = ['some role'];
    const requestMock = { user: { sub: 'userId', roles: { projectRoles: roles } } };
    const availableMetadata = [{ ...getMinimalMetadata(), assetId: 'asset-id' }];
    centralAssetRepoRepository.metadataAvailableToUser.mockResolvedValueOnce(availableMetadata);

    const returnValue = await getAllMetadata(requestMock, responseMock, nextMock);

    expect(returnValue).toBe(responseMock);
    expect(centralAssetRepoRepository.metadataAvailableToUser).toHaveBeenCalledWith('userId', roles);
    expect(responseMock.status).toHaveBeenCalledWith(200);
    expect(responseMock.send).toHaveBeenCalledWith(availableMetadata);
  });

  it('calls next with an error if there is an error when getting the metadata', async () => {
    const requestMock = { user: { roles: { instanceAdmin: true } } };
    centralAssetRepoRepository.listMetadata.mockRejectedValueOnce(new Error('Expected test error'));
    await getAllMetadata(requestMock, responseMock, nextMock);
    expect(nextMock).toHaveBeenCalledWith(new Error('Error getting asset metadata: Expected test error'));
  });
});

describe('getAssetById', () => {
  const { getAssetById } = centralAssetRepoController;

  describe('calls to get metadata with provided id and returns response configured with 200 status and metadata', () => {
    it('if asset is public', async () => {
      const requestMock = {};
      const metadata = {
        ...getMinimalMetadata(),
        assetId: 'asset-id',
        visible: PUBLIC,
      };
      centralAssetRepoRepository.getMetadataWithIds.mockResolvedValueOnce([metadata]);

      const returnValue = await getAssetById(requestMock, responseMock, nextMock);

      expect(returnValue).toBe(responseMock);
      expect(responseMock.status).toHaveBeenCalledWith(200);
      expect(responseMock.send).toHaveBeenCalledWith(metadata);
    });

    it('if asset is by project and projectKey of project asset is available from is provided', async () => {
      const projectKey = 'test-project';
      const requestMock = { projectKey };
      const metadata = {
        ...getMinimalMetadata(),
        assetId: 'asset-id',
        visible: BY_PROJECT,
        projectKeys: [projectKey],
      };
      centralAssetRepoRepository.getMetadataWithIds.mockResolvedValueOnce([metadata]);

      const returnValue = await getAssetById(requestMock, responseMock, nextMock);

      expect(returnValue).toBe(responseMock);
      expect(responseMock.status).toHaveBeenCalledWith(200);
      expect(responseMock.send).toHaveBeenCalledWith(metadata);
    });
  });

  describe('calls to get metadata with provided id and returns response configured with 404 status', () => {
    it('if no asset with ID found', async () => {
      const requestMock = {};
      centralAssetRepoRepository.getMetadataWithIds.mockResolvedValueOnce([]);

      const returnValue = await getAssetById(requestMock, responseMock, nextMock);

      expect(returnValue).toBe(responseMock);
      expect(responseMock.status).toHaveBeenCalledWith(404);
      expect(responseMock.send).toHaveBeenCalledWith();
    });

    it('if asset is by project and provided project is unable to access asset', async () => {
      const requestMock = { projectKey: 'project-without-access' };
      const metadata = {
        ...getMinimalMetadata(),
        assetId: 'asset-id',
        visible: BY_PROJECT,
        projectKeys: ['project-with-access'],
      };
      centralAssetRepoRepository.getMetadataWithIds.mockResolvedValueOnce([metadata]);

      const returnValue = await getAssetById(requestMock, responseMock, nextMock);

      expect(returnValue).toBe(responseMock);
      expect(responseMock.status).toHaveBeenCalledWith(404);
      expect(responseMock.send).toHaveBeenCalledWith();
    });
  });

  it('calls next with an error if there is an error when getting asset by ID', async () => {
    const requestMock = { assetId: 'test-asset' };
    centralAssetRepoRepository.getMetadataWithIds.mockRejectedValueOnce(new Error('Expected test error'));
    await getAssetById(requestMock, responseMock, nextMock);
    expect(nextMock).toHaveBeenCalledWith(new Error('Error getting asset with assetId: test-asset - Expected test error'));
  });
});

describe('stackCanUseAsset', () => {
  const { stackCanUseAsset } = centralAssetRepoController;

  it('is true if asset is public', () => {
    expect(stackCanUseAsset('projectKey1', 'PUBLIC', [])).toEqual(true);
  });

  it('is true if stack project is in list of projects', () => {
    expect(stackCanUseAsset('projectKey1', 'BY_PROJECT', ['projectKey1', 'projectKey2'])).toEqual(true);
  });

  it('is false if stack project is not in list of projects', () => {
    expect(stackCanUseAsset('projectKey3', 'BY_PROJECT', ['projectKey1', 'projectKey2'])).toEqual(false);
  });
});
